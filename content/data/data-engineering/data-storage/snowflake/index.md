---
title: Snowflake notes
ready: true
publish: true
date: 2025-03-28
---
# Saving costs and time
During testing of SQL models in Snowflake, sometimes we want to debug a complex queries with many CTEs involved. For example:

```sql
with cte_1 as (
    select * from table_1
    where....
),

cte_2 as (
    select * from table_2
    where....
)

select ...
from cte_1 c1
inner join cte_2 c2
on ...

```


But sometimes we want to modify parameters only in the last query, without modifying the CTEs. For example, adding a WHERE or changing values queried. 

Every time we run the SQL, all the CTEs will need to run again, and in some cases the CTEs take a long time to query. We want to be able to test things quickly. That's when we can use the Snowflake temporary tables with `create or replace temp table`:

```sql
create or replace temp table cte_1 as (
    select * from table_1
    where....
);

create or replace temp table cte_2 as (
    select * from table_2
    where....
);

select ...
from cte_1 c1
inner join cte_2 c2
on ...
```

We just run once each CTE independently. Then, we can run the last `select` statement without needing to rerun the CTEs every time we make a change in the downstream model.

https://docs.snowflake.com/en/user-guide/tables-temp-transient


# Useful queries
See properties of warehouse:

```sql
show parameters in warehouse my_warehouse;
```

Warehouses can have parameters configured like timeout of queries that can be useful to set for more governance control.

https://docs.snowflake.com/en/sql-reference/sql/show-parameters


# Secure views

Views should be defined as secure when they are specifically designated for data privacy (i.e. to limit access to sensitive data that should not be exposed to all users of the underlying table(s)).

Secure views should not be used for views that are defined solely for query convenience, such as views created to simplify queries for which users do not need to understand the underlying data representation. Secure views can execute more slowly than non-secure views.

https://docs.snowflake.com/en/user-guide/views-secure