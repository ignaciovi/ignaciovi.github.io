---
title: Snowpipe
date: 2025-01-17
ready: true
publish: true
tags:
  - data-engineering
  - data-ingestion
---

Snowpipe is an event-driven mechanism to automatically load data from, for example, an S3 bucket into a table within SnowFlake

# Troubleshooting

How to check the Snowpipe logs to see if the file was ingested:

```
select SYSTEM$PIPE_STATUS('{db_name}.{schema_name}.{table_name}');
```


How to check if a copy statement was successful:
```
select *
from table(information_schema.copy_history(TABLE_NAME=>'{db_name}.{schema_name}.{table_name}', START_TIME=> DATEADD(hours, -1, CURRENT_TIMESTAMP())));

```


## Terraform Module

The aim of the module is to create all necessary resources for any bucket-prefix/SnowFlake-table pair, where all resources are uniquely created with minimal permissions for only the purpose of enabling the SnowPipe.

Thus, for each instance of the module the following resources should be created:

- AWS:
    - IAM Role for SnowFlake to assume, with an access policy that only permits one user from
    - S3 Bucket Notification, with policy that allows the SnowFlake;
    - SNS Topic, attached to the S3 Bucket Notification and with a policy that allows S3 to publish to it and the SnowFlake IAM user to subscribe;
    
- SnowFlake:
    - Table, into which the ‘raw’ data will be put;
    - Storage Integration, that assumes the IAM Role for SnowFlake created in AWS;
    - Stage, that acts as the reference for the source S3 bucket;
    - Pipe, that will create a behind-the-scenes SQS queue and subscribe to the SNS topic and serverless loader.



