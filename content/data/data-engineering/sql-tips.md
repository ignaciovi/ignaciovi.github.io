---
title: SQL tips
date: 2024-12-30
ready: true
deployed: true
---

# Qualify
`QUALIFY` allows filtering rows based on the results of window functions directly. It's supported in Snowflake:

```sql
SELECT *
FROM table
QUALIFY ROW_NUMBER() OVER (PARTITION BY ID ORDER BY UPDATED_AT DESC NULLS LAST) = 1;
```

It's the equivalent of:

```sql
WITH ranked AS (
    SELECT 
        ID,
        UPDATED_AT,
        ROW_NUMBER() OVER (PARTITION BY ID ORDER BY UPDATED_AT DESC NULLS LAST) AS rn
    FROM table
)
SELECT *
FROM ranked
WHERE rn = 1;
```


# Cross join
 A cross join is a type of join that combines each row from one table with every row from another table, creating a Cartesian product of the rows

![[cross-join-example.png]]