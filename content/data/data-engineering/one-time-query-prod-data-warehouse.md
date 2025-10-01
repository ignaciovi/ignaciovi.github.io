---
title: Running one time queries in Production
ready: true
publish: true
tags:
  - data-engineering
---
Sometimes, you need to run a query directly against the production data warehouse. This usually happens when something failed or requires urgent changes. Examples: drop table that is failing to rebuild it, backfilling data after a failed pipeline...

A recommended approach is to create a dedicated repo (or subfolder in an existing infra repo) for executing one-time queries in the production data warehouse

Instead of running queries manually, define them in code. For example, using Terraform with a `snowsql_exec` resource:
    
```terraform
resource "snowsql_exec" "select" {
  create = <<EOT

  SELECT * FROM TABLE_NAME;

  EOT
}
```


Deployment Workflow:

1. Create a PR : Add or update the `one-time-query.tf` file with your query.
2. Request Review : Tag the infrastructure or data engineering team. Approval is required before execution.
3. CI/CD Execution : When the PR is approved and merged, the CI/CD pipeline triggers the query execution in the Snowflake production warehouse.
4. Auditable History: The query and its context are now permanently recorded in version control for future reference.

This reduces the chance of mistakes in production and provides traceability of changes

