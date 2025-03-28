---
title: Surrogate keys notes
date: 2025-03-28
ready: true
publish: true
---

Creating surrogate BINARY keys make joining between tables faster!

For data governance, add dbt-checkpoint to enforce having SKEY and NKEY in information mart layer.


```sql
SELECT 
    MD5(CAST(customer_id AS STRING)) AS customer_skey, -- Binary surrogate key
    customer_id as customer_nkey, 
    first_name, 
    last_name, 
    email 
FROM {{ ref('stg_customers') }}
```




Creating metadata columns is useful to prevent unnecessary inserts

```
{%- set yaml_metadata -%}
hashed_columns:
    CUSTOMER_SKEY:
      - 'CUSTOMER_ID'
    CUSTOMER_HASHDIFF:
      - 'FIRST_NAME'
      - 'LAST_NAME'
      - 'EMAIL'
      - 'PHONE_NUMBER'
{%- endset -%}

{% set metadata_dict = fromyaml(yaml_metadata) %}
{% set hashed_columns = metadata_dict["hashed_columns"] %}

with customers as (
    select
        CUSTOMER_ID,
        EMAIL,
        FIRST_NAME,
        LAST_NAME,
        PHONE_NUMBER,

        -- Generate surrogate key and hashdiff
        {{ automate_dv.hash_columns(columns=hashed_columns) | indent(4) }}

    from {{ source("raw", "customers") }}
)
select *
from customers
where {{- not_exists("customers", ["CUSTOMER_SKEY", "CUSTOMER_HASHDIFF"]) }}

```


So we can find unique keys and dups payload