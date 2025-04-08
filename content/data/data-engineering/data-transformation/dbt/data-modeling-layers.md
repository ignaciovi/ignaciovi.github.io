---
title: Data modeling layers
tags:
  - dbt
  - data-engineering
  - data-governance
ready: true
publish: true
date: 2025-04-08
---
Notes on data modelling. This is a work in progress as I keep learning about best practices.

How to structure the data warehouse layers:

![[data-modeling-layers.png]]

# Data modeling checklist
- Do the table and columns adhere to good naming conventions?
- Does the table represent a unique entity with a unique index?
- Primary and foreign keys?
- Do we have tests that monitor for table constraints (null/unique...)? Every table we use should have tests defined to ensure data quality. Unit testing?
- Should it be a view/table/ephemeral? Should it be incremental?
- Does the table and its columns have descriptions where the name is ambiguous? These should persist onto the data warehouse and onto data cataloguing tools we use.

# Naming conventions
This is my preference for naming conventions:

| **Object**             | **Convention**              | **Examples**           |
| ---------------------- | --------------------------- | ---------------------- |
| Timestamp columns      | Suffix with `_at`           | `created_at`           |
| Date columns           | Suffix with `_date`         | `close_date`           |
| Boolean columns        | Prefix with `is_` or `has_` | `is_deleted`           |
| Identity value columns | Suffix with `_id`           | `user_account_id`      |
| Table Name             | Snake case<br>Singular      | `order_reconciliation` |
| Column Name            | Snake case                  | `user_id`              |
| Surrogate key          | Suffix `_skey`              | `user_skey`            |

However, I'd prefer a flexible governance approach. Having some rules in place to avoid creating chaos, but being flexible enough to not cause headaches to developers, and be able to have fluid processes.

A good way of enforcing conventions and making sure that they are consistent is to set up guardrails. Take a look at my article on dbt-checkpoint if you are using DBT for data modelling https://medium.com/@ignaciovi/improve-data-quality-in-dbt-with-dbt-checkpoint-dd9e37909790

With pre-commit checkpoints, we make sure that no code can be committed if a column doesn't follow the standards established. Add this to Github actions or any other way of adding checks to a PR and it adds another layer of governance.

Adding prefix and suffix to columns makes it easier to understand what's the column type we want to query and facilitates data exploration and cataloguing.

# Data layers
In order to facilitate data querying, exploration and transformations, specially for self-service, DBT best practices divide models in layers, separating them by purpose and level of transformation.

Data should normally be structured with three users in mind:
- Data scientists, engineers and analysts: technical users that know how to query, transform and aggregate tables if needed. It should be easy for them to do any of those actions
- Non technical users: self-service to solve basic ad-hoc questions. I believe though that self-service is a double edge sword and you either need an analyst to support and review, or the non-technical user should be trained in analytics
- Dashboards reporting


## Landing
All raw data is stored as it comes from sources. No transformations are applied.

Naming Conventions

| **Object** | **Convention**           | **Examples**       |
| ---------- | ------------------------ | ------------------ |
| Table Name | suffixed with `_landing` | `my_table_landing` |


 Standard Columns where applicable:

| **Column Name**  | **Purpose**                                                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| DWH_LOADED_AT    | Timestamp of when the row was loaded into data warehouse                                                                       |
| FILE_NAME        | Name of the file the row was loaded from                                                                                       |
| FILE_ROW_NUMBER  | Row in the file that the row was loaded from                                                                                   |
| EVENT_CREATED_AT | Timestamp of when the event was triggered in the upstream source system. This is sourced from an existing field from the event |


## Staging
Staged landing tables, i.e. lightly transformed landing tables in a 1-to-1 relationship.

There is always a staging table for each raw table

Naming Conventions


| **Object** | **Convention**       | **Examples**   |
| ---------- | -------------------- | -------------- |
| Table Name | Prefixed with `stg_` | `stg_my_table` |



Standard Columns:

| **Column Name**    | **Type** | **Purpose**                                                                                                         |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `<table>_hash_key` |          | Logical primary key of the record created using a SHA-256 hash.                                                     |
| `<table>_hashdiff` |          | A hash of the attribute data to enable tracking of changes and avoid unnecessary creation of historic data records. |
| `file_name`        |          | Entity or file the data was loaded from                                                                             |
| `file_row_number`  |          | Row number of the source file the record was loaded from (if applicable)                                            |
| `dwh_loaded_at`    |          | Timestamp of when the row was loaded into the LANDING area table                                                    |

## Transformation

Intermediate layer between STAGING and INFORMATION_MART used to transform and join together staging tables before modelling in information_mart.

Tables are presented in third-normal-form (3NF) : every piece of data in a table should directly describe the primary key, not another column.

Naming Conventions

| **Object**              | **Convention**      | **Examples**                         |
| ----------------------- | ------------------- | ------------------------------------ |
| Table Name<br>View Name | Prefixed with `tr_` | `tr_my_table`<br><br>`v_tr_my_table` |


Standard Columns

|                    |           |                                                                                                                     |
| ------------------ | --------- | ------------------------------------------------------------------------------------------------------------------- |
| **Column Name**    | **Type**  | **Purpose**                                                                                                         |
| `<table>_hash_key` |           | Logical primary key of the record created using a SHA-256 hash.                                                     |
| `<table>_hashdiff` |           | A hash of the attribute data to enable tracking of changes and avoid unnecessary creation of historic data records. |
| `dwh_loaded_at`    | timestamp | Timestamp of when the row was loaded into the LANDING area table                                                    |


## Information Mart

Consumer facing tables, entity layer. Only this data is consumed by dashboards and end users. Each table is meant to represent a specific entity or concept at its unique grain. 

Here we combine staging and intermediate layers to create wide and detailed tables for orders, customers, etc… From these models we can derive specific purpose models for each business area like monthly_kpis or `customer_profit_and_loss`.

Dimensions are normally objects/things. 
Facts are actions/verbs. Fact tables are generally only every inserted to

A transaction is something that takes place, an action, a fact.
An order item is something, a dimension.

Type 2 dimensions are always a good starting point for most dimensions


Naming Conventions

| **Object**       | **Convention**   | **Examples**    |
| ---------------- | ---------------- | --------------- |
| Dimension tables | Prefix with `d_` | `d_customer`    |
| Fact tables      | Prefix with `f_` | `f_transaction` |
| Surrogate keys   | Suffix `_skey`   | `customer_skey` |
| Natural key      | Suffix `_nkey`   | `customer_nkey` |


Standard columns

| **Column Name** | **Type**  | **Purpose**                                                                                                                                             |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <entity>_SKEY   | VARCHAR   | Surrogate primary key of the table. Must be unique (see below). For a Type 2 this usually combines the NKEY with `eff_from` to create something unique. |
| <entity>_NKEY   | VARCHAR   | Type 2 only. The “super natural key” (see below).                                                                                                       |
| eff_from        | TIMESTAMP | Type 2 only. Timestamp of when the row was changed on the source system                                                                                 |
| eff_to          | TIMESTAMP | Type 2 only. Timestamp of the NEXT change to the row in the source system minus 1 second. Defaults to `9999/12/31 23:59:59` (see “high nulls” below)    |

🔴 Need to review this section
### Surrogate and Supernatural Keys

https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/natural-durable-supernatural-key

> _Natural keys_ created by operational source systems are subject to business rules outside the control of the DW/BI system. For instance, an employee number (natural key) may be changed if the employee resigns and then is rehired. When the data warehouse wants to have a single key for that employee, a new _durable key_ must be created that is persistent and does not change in this situation. This key is sometimes referred to as a _durable supernatural key_. The best durable keys have a format that is independent of the original business process and thus should be simple integers assigned in sequence beginning with 1. While multiple surrogate keys may be associated with an employee over time as their proﬁle changes, the durable key never changes.

In a nutshell, if you have a type 2 dimension, the value of the `..._skey` column will be different for each instance of the entity in the dimension whereas the `..._nkey` value will stay the same. This allows for “point in time” queries on the dimensions to select the entity at a particular moment in history and then join to the fact table with the supernatural key to collect all of the facts associated with the entity.

The surrogate key value will link to the fact table to capture the state of the entity **at the point in time the fact was created**. This is an important consideration when capturing attributes such as “Status”. You probably want to query the latest status, not the status at the time the fact occurred.

### High and Low Null Values for Type 2 Effective Dates

When modelling type 2 dimensions, you will always have an `effective_from` date and an `effective_to` date. Neither of these dates must **ever** contain a null value otherwise you will force users to put extra logic in their queries when all the want really to do is just use a `BETWEEN` statement e.g.

`SELECT * FROM d_wallet w WHERE TO_DATE('2022-06-01') BETWEEN effective_from AND effective_to;`

The above query should result in one row for each entity, showing the status of the entity for the 1st of June 2022. If you have NULL values in either of the column, you’ll have to resort to using `NVL` or `COALESCE` statements.

Note, `BETWEEN` in SQL is **inclusive** ([arguably](https://softwareengineering.stackexchange.com/questions/160191/why-is-sqls-between-inclusive-rather-than-half-open "https://softwareengineering.stackexchange.com/questions/160191/why-is-sqls-between-inclusive-rather-than-half-open") a poor design choice), i.e. `A BETWEEN X AND Y` is equivalent to `A >= X AND A <= Y`. Therefore, if `effective_to` is the same as the `effective_from` of another row (as it usually will be), and the date being checked is the same value, **both** rows will be returned, with chaos likely ensuing.

Therefore, `BETWEEN` **should not be used** for dates, as the correct comparison is `A >= X AND A < Y` (i.e. `< Y` rather than `<= Y`). Alternatively, if you insist on using `BETWEEN`, you can use `A BETWEEN X AND Y AND A != Y`, but no-one is going to remember to do that, so it’s best just to avoid `BETWEEN` entirely.

To avoid this, we simply insert a dummy value for the NULL. So for the most recent record `effective_from` would be defaulted to `9999-12-31`.

|   |   |   |
|---|---|---|
||**Datetime**|**Date**|
|**High Null Value**|`9999-12-31 23:59:59.999`|`9999-12-31`|
|**Low Null Value**|`1970-01-01 00:00:00.000`|`1970-01-01`|
||||

### Entities

The route to a successful Data Warehouse is identifying all the key entities which can be used to derive insights for analytics.

It is crucial in this step to identify an appropriate identifier which can be used to relate the entity in question to other business objects in the Data Warehouse.

The most important data modeling concept is the grain of a relation. The grain of the relation defines what a single row represents in the relation. Every table name should contain the grain. 
