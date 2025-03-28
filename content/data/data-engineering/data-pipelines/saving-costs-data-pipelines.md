---
title: Saving costs on data pipelines
date: 2024-01-11
tags:
  - data-engineering
publish: true
ready: true
---

Working in a start-up presents the challenge of providing the highest impact at the lowest cost. Isn't that every company's goal, though? One of my main responsibilities in my day-to-day job is to find that balance. How do I keep adding models and pipelines without dramatically increasing our costs? 

In the last few weeks, I've had to do exactly that. And in this article, I'll present some of the learnings I've had along the way.

For context, in our Data Architecture, we use a combination of Airbyte (Ingestion) + DBT (Transformation) + Airflow (Orchestration) and Biguery as our Data Warehouse. You can find more details on the architecture [here](https://medium.com/@ignaciovi/from-zero-to-modern-data-stack-2b5a645efb40). That's not to say that the recommendations mentioned below are not valid for other tools. Most of the recommendations are what I've seen commonly described as best practices in my research.

Without further ado, find below the changes I've made to reduce the costs of our BigQuery billing down 30%.

# Identifying heavy queries
First, I started by identifying the queries that processed the highest number of bytes:
```sql
SELECT
 query,
 sum(total_bytes_processed) as total
FROM `project`.`region`.INFORMATION_SCHEMA.JOBS_BY_PROJECT
WHERE EXTRACT(DATE FROM  creation_time) = current_date()
group by query
ORDER BY total DESC
LIMIT 10
```

Once we identified the largest queries, there are a few questions we can ask:

# Data freshness
How often do we need the data? This is the first question we need to answer since it has a simpler solution. If we don't need the data every hour, why not change the ingestion and transformation to run once a day instead? That will reduce its cost by 1/24!

If it runs every hour, do we really need to run it at 3am? Why not run it from 9am to 5pm? Ask stakeholders how often they need the data refreshed.

In my case, I realised I had a 30 GB audit log table that was ingested and transformed every hour! We use this table to extract the login times of our customers, but this piece of information wasn't really needed every hour. So I changed it to ingest the data once a day.

On the DBT side, I also changed the job to run once a day for this table. To do that, I assigned [tags](https://docs.getdbt.com/reference/resource-configs/tags) to those tables that I wanted to run with a lower frequency. I assigned the tag with:

```sql
{{ config(
    tags='daily'
) }}
```

Then, I created a new daily job that runs `dbt build -s tag:daily`

# Query optimisation
Can we optimise the query? There are a lot of resources out there on query optimisation, but normally it boils down to:
- Selecting only the data that is needed
- Using CTEs as logic blocks (I like to think about them as Lego blocks to build a query or as functions to build a class)
- Perform heavy operations on the last mile, only on the data that is needed. Ask yourself, is it more efficient to run a JOIN operation after I've filtered my data with the records I need?

As an example, I had to create a table that aggregated daily metrics like revenue, customers entering the funnel, customers completing the funnel, number of orders,...
I created a CTE that extracted every metric and grouped it by date. Then, at the final step, I joined all the CTEs by the date column

Example of transformation:

```sql
with daily_revenue as (
  select
    date(created_at) as day,
    sum(revenue_gbp) as total_revenue_gbp
  from {{ ref('stg_revenue_source__revenue') }}
  group by day
)

daily_customers_entering_funnel as (
  select
    date(registered_at) as day,
    count(*) as customer_entering_funnel_count
  from {{ ref('stg_company_db__customers') }} c
  group by day
),

daily_customers_completing_funnel as (
  select
    date(registered_at) as day,
    count(*) as customer_completing_funnel_count
  from {{ ref('stg_company_db__customers') }} c
  where has_completed_funnel is true
  group by day
),

join_1 as (
  select
    coalesce(dr.day, dcef.day) as day,
    dr.total_revenue_gbp,
    dcef.customer_entering_funnel_count
  from daily_revenue dr
  full outer join daily_customers_entering_funnel dcef
  on dr.day = dcef.day
),

final as (
  select
    coalesce(j.day, dccf.day) as day,
    ifnull(dr.total_revenue_gbp, 0) as total_revenue_gbp
    ifnull(dcef.customer_entering_funnel_count, 0) as customer_entering_funnel_count
    ifnull(dcef.customer_completing_funnel_count, 0) as customer_completing_funnel_count
  from join_1 j
  full outer join daily_customers_completing_funnel dccf
  on j.day = dccf.day
)

select * from final 
```

# Partitioning
Do we need to perform calculations and aggregations for the full table on every run?
The audit log table I've mentioned before was being fully ingested and transformed on every run.
The change I made was to modify the data ingestion to incremental append (only new data is added).
Then, on DBT I only transformed audit log records for the last 3 days. I knew that historic audit log records wouldn't change in the future (data is immutable), but I set up 3 days as the date range for ingestion just in case.

```sql
{% set partitions_to_replace = [
  'timestamp(current_date)',
  'timestamp(date_sub(current_date, interval 1 day))',
  'timestamp(date_sub(current_date, interval 2 day))',
  'timestamp(date_sub(current_date, interval 3 day))'
] %}

{{
  config(
    materialized='incremental',
    incremental_strategy = 'insert_overwrite',
    cluster_by = 'user_id',
    partition_by = {'field': '_airbyte_extracted_at', 'data_type': 'timestamp'},
    partitions = partitions_to_replace
  )
}}

with audit_log as (
  select 
    * 
  from
  {{ source('raw_data', 'audit_log') }} al
  {% if is_incremental() %}
  -- Look back 3 partition days
  where timestamp_trunc(_airbyte_extracted_at, day) in ({{ partitions_to_replace | join(',') }})
  {% endif %}
)

select 
  id as audit_log_id,
  user_id,
  operation,
  params,
  result,
  created_at,
  app,
  _airbyte_extracted_at
from audit_log al

```

# Removing no needed transformations
Check if there are any tables and transformations that are not being used.
In my case, I was creating snapshots of tables that were not needed so I had just to remove that.


# Wrap up
Making the changes mentioned above didn't take a long time and we could see the benefits very fast. I wish I had done this early and I've learned that it is beneficial to do "stability breaks" from time to time, similar to software engineers do, to identify technical debt and do fixes that will save a lot of money in the long run.
