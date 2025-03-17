---
title: Data Ingestion Event Pattern Notes
date: 2025-03-17
tags:
  - data-engineering
  - data-ingestion
ready: true
deployed: true
---


Tips and notes on data ingestion event based data pattern.


# Compacting jobs
In event driven architecture:

If pipelines are not optimised for low data volumes,  many small files are created and causes several issues.

- The ETL jobs are slowed due to executing far more S3 and KMS API calls than is necessary
- Logging costs are increased due to logging these API calls
- KMS rate limits are often reached and KMS costs comprise a significant proportion of the costs


Solution is to bundle/compact events.

The events received can be bundled-up, with the bundles being created at the biggest possible size according to the batching time and batching size parameters. Following this, those objects are read-in and classified according to the source system into one object per source system, therefore decreasing the number of events per object further.

This can reduce the amount of calls due to fetching input data objects, improve performance and reduce costs.



# How long to keep data
Data lands into bucket, to be ingested into the data warehouse.

Normally we don't want to keep the data for a long period because it is hard to do Right to Be Forgotten (RTBF) and delete customer data, from terabytes of CSV or parquet files.

The data is already available in the data warehouse which will be structured and easier to handle. Keeping data in the buckets for 90 days seems appropriate in most cases.
