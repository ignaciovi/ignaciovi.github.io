---
title: Data Ingestion Patterns
tags:
  - data-engineering
  - data-ingestion
ready: true
deployed: true
date: 2025-03-17
---
Data ingestion is the process of getting data from A to B. Being:
- "A" normally an external data source
- "B" an internal data storage where data from multiple sources is stored and combined to create new enriched data models

# Data ingestion patterns
Common data ingestion patterns I've seen

## Pattern 1: Batch ingestion
Querying data from a database into a data warehouse.
- Easy pattern. We can use a tool like [[airbyte|Airbyte]] to move data from a data warehouse like Postgres to a Data Warehouse like BigQuery. I did this in the startup I used to work and it's documented here https://medium.com/@ignaciovi/from-zero-to-modern-data-stack-2b5a645efb40
- It can put strain in the database which is used by the main application. Ideally, you would run incrementally, only moving data that has changed or that is new. You don't want to get all the data every time it runs, it wouldn't be efficient and it would take too long
- You only have one copy of the data. It's difficult to handle data ingestion issues. If the table in the data warehouse is deleted, you have to get all the data from the database again.

## Pattern 2: Event Based Data
- Data arrives in small batches to a bucket via some event router like Eventbridge
- It's not realtime but it's probably the lowest latency approach before realtime and most of the use cases don't need anything better than that
- Data can be partitioned by date in folders
- Once data lands in bucket, we can use other data ingestion tool to move data to our data warehouse. Snowflake for example can use [[snowpipe|Snowpipe]] that detects when new files are added to the bucket and sends them incrementally to the LANDING layer in the data warehouse
- Notes and tips [[data-ingestion-event-pattern-notes|here]]

## Pattern 3: External Data
- Large set of data exists on external buckets (like S3) that is updated infrequently
- External table over the bucket data exposes it to the data warehouse via an EXTERNAL_TABLES schema
- Materialised views copy the data efficiently into native tables where masking can be applied

## Pattern 4: Static Reference Data
- Small set of static data
- Data is held as a CSV file (normally). It can be saved as seeds with [[data/data-engineering/dbt/index|DBT]]
- Refreshed during regular scheduled load process

## Pattern 5: Third Party Large File Ingestion
- Third party sends a dataset
- Data transfer technology like [MFT](https://www.ibm.com/topics/managed-file-transfer) is set up so the third party can deliver data to an internal company bucket
- Data goes to LANDING table using an ingestion tool like Snowpipe (for Snowflake)

## Pattern 6: Ad-hoc Use File Ingestion
- Analysts, Data scientists etc. have a one-off file the want to report against
- These roles have access to an adhoc role where they can manually create tables
- Data can be copied into the tables via UI.
- ADHOC schemas are locked down to just those roles to avoid accidental leakage of PII


# Common issues I've faced
List of common issues found with data ingestion:
- Data quality. Receiving wrong data formats or schemas landing. For this, ideally we would have data contracts with the source and data quality tests on our side to catch errors as soon as possible
	- We can have tools that detect schema changes so we can investigate if it's breaking something as soon as possible. Normally this type of error can be reduced by letting engineers know that their work affect us and communication. Ownership is important too
- Data missing. Need to set up rollback processes to ingest missing data. Add data freshness and volume checks. Tools like [[montecarlo|Montecarlo]] handle this automatically
