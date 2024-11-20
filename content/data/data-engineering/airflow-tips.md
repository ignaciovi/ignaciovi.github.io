---
title: Airflow tips and practices
ready: true
---

Tips and tricks I'm learning with Airflow.

# Development good practices
You want to be able to test changes fast when you develop. 
It's recommended to have an Airflow local environment set up pointing to DEV data or a clone of DEV.

If using Airflow in AWS with MWAA, there is a repo that helps with that:
https://github.com/aws/aws-mwaa-local-runner

# Airflow Variables
Using Airflow variables in top-level Python code for DAGs should be avoided as much as possible, since it yields network calls and database access. See [Top level Python Code](https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html#best-practices-top-level-code).

```
from airflow.models import Variable
from airflow.operators.bash import BashOperator
from airflow import DAG
from datetime import datetime

foo_var = Variable.get("foo")  # AVOID THIS

with DAG(
    "example_dag",
    start_date=datetime(2023, 1, 1),
    schedule_interval=None,
) as dag:

    bash_use_variable_bad_1 = BashOperator(
        task_id="bash_use_variable_bad_1",
        bash_command="echo variable foo=${foo_env}",
        env={"foo_env": foo_var}
    )

)
```

If Airflow Variables must be used in top-level DAG code, then their impact on DAG parsing can be mitigated by [enabling the experimental cache](https://airflow.apache.org/docs/apache-airflow/stable/configurations-ref.html#config-secrets-use-cache). Note that it's an experimental feature (at the moment of writing)

The alternative approach to defining variables top-level is to call the `Variable.get` inside functions and get the values when the functions are called.

```
from airflow.models import Variable
from airflow.operators.bash import BashOperator
from airflow import DAG
from datetime import datetime

def fetch_variable_at_runtime():
    return Variable.get("foo")

with DAG(
    "example_dag",
    start_date=datetime(2023, 1, 1),
    schedule_interval=None,
) as dag:

    bash_use_variable_good = BashOperator(
        task_id="bash_use_variable_good",
        bash_command="echo variable foo=${foo_env}",
        env={"foo_env": "{{ var.value.foo }}"}  
    )
```

# Handling secrets
When handling variables like API Keys in Airflow, we want to keep the data secure and only readable to certain roles. It should be used in DAGs without its value being leaked

We can use SecretManager to keep those values and read from them.
If using AWS and Terraform: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/secretsmanager_secret

1. Define encryption KMS (Key Management Service). It is like having a secure digital vault that helps you lock and unlock sensitive data with keys
2. Create secret with encryption. Define roles that can access the secret

The secret is protected by an AWS KMS key, and the roles listed in `rw_principals` are given read/write access to the secret

This means that any EC2 instance, Lambda function, or other AWS service (like Airflow running in an EC2 instance or MWAA) that assumes these roles can access the secret using the AWS SDK (e.g., `boto3` for Python).

The `data "aws_secretsmanager_secret"` block in Terraform allows you to reference this existing secret within other parts of your Terraform configuration. It essentially pulls metadata from the Secrets Manager secret.

The secret can be accessed via DAG with boto3 library or in another service, sending it as a resource.

This same concept can be applied to other cloud providers, since they have similar solutions.

# Running ad-hoc models in production
If you're using DBT and want to just run one model in production, it's not as easy as accessing your local environment, pointing to production and running the model. Well, that is not a good practices because production shouldn't be easily accessible from a local environment.

You can have a DAG in production Airflow that runs the ad-hoc model for you
The DAG allows as input the name of the model and it does a full refresh of the model when you run it.

```
...

with DAG(
    "full_refresh",
    ...
    params={
        "list_of_models_to_be_refreshed": Param(
            "d_test  f_test",
            type="string",
            title="List of models to be refreshed",
            description="This field is required. Enter a space delimitated list of models to be fully refreshed",
        ),
        "seed_only": Param(
            False,
            type="boolean",
            title="Should the seeds be fully refreshed?",
            description="Toggle whether models or seeds should be fully refreshed.",
        )
    ...
    },
) as dag:

    dbt_full_refresh_task = BatchOperator(
        ...
        overrides={
            "command": [
                "dbt",
                '{% if dag_run.conf["seed_only"] %}seed{% else %}run{% endif %}',
                "--full-refresh",
                "--select",
                '{{ dag_run.conf["list_of_models_to_be_refreshed"] }}',
            ],
            ...
        },
    )
```