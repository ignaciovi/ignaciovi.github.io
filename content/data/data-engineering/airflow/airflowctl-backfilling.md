---
title: airflowctl and backfilling
ready: true
date: 2025-09-25
publish: true
---
In cases, when we need to selectively reprocess a window of dates for a DAG, we can use backfilling with `airflowctl.py`.

Imagine you have a DAG called `survey_load` that normally ingests daily survey responses. 

```python
...

@task
def load_survey_data(date, backfill=False):
    if backfill:
        print(f"[BACKFILL] Reprocessing data for {date}")
        # call your pipeline.backfill_survey(...)
    else:
        print(f"[INCREMENTAL] Loading new data for {date}")
        # call your pipeline.load_survey(...)


@dag(
    dag_id="survey_load",
    start_date=datetime(2022, 1, 1, tzinfo=LOCAL_TZ),
    schedule="0 3 * * *",   # run daily at 3am
    catchup=False,
    params={"backfill": Param(False, type="boolean")},
    tags=["example"],
)
def survey_load():
    load_survey_data(date="{{ logical_date }}", backfill="{{ params.backfill }}")


survey_load_dag = survey_load()

```


By default it runs incrementally, processing only the latest day’s data. But if you discover that responses from September 1–3 didn’t load correctly, you can backfill just that period.

```python
python airflowctl.py backfill \
  --dag decipher_load \
  --start-date 2023-09-01 \
  --end-date 2023-09-03 \
  --conf '{"backfill": true}'
```

- Airflow creates task runs for Sept 1, 2, and 3.
- The `--conf` parameter sets `params.backfill=true` inside the DAG.
- Tasks switch from incremental ingestion to the backfill pipeline path, reprocessing historical data for those dates.

| Task Instance    | logical_date | backfill param | Behavior          |
| ---------------- | ------------ | -------------- | ----------------- |
| load_survey_data | 2023-09-01   | True           | Backfill pipeline |
| load_survey_data | 2023-09-02   | True           | Backfill pipeline |
| load_survey_data | 2023-09-03   | True           | Backfill pipeline |


We can change airflowctl.py to be able to:
1. Pick a DAG (interactive or via argument).
2. Build up `dags backfill` CLI arguments (start, end, flags, conf).
3. Execute the command in MWAA (`execute_mwaa_cli_command`).
4. Displays results or errors.


Simplified version of airflowctl.py:

```python
import click
from datetime import datetime
from typing import Optional

# You will need to implement this for your MWAA environment
from mwaa_helpers import get_list_of_dag_names, execute_mwaa_cli_command


@click.command()
@click.option("--dag", "dag", required=False, help="DAG ID to backfill")
@click.option("--start-date", "start_date", type=click.DateTime(formats=["%Y-%m-%d"]), required=False)
@click.option("--end-date", "end_date", type=click.DateTime(formats=["%Y-%m-%d"]), required=False)
@click.option("--continue-on-failures", is_flag=True, default=False, help="Continue on failures")
@click.option("--reset-dagruns", is_flag=True, default=False, help="Reset DAG runs before backfill")
@click.option("--conf", "conf", required=False, default=None, help="JSON config for DAG params")
def backfill(
    dag: Optional[str],
    start_date: Optional[datetime],
    end_date: Optional[datetime],
    continue_on_failures: bool,
    reset_dagruns: bool,
    conf: str,
):
    """Backfill a DAG in MWAA."""
    
    # 1. Get available DAGs
    dag_names, _ = get_list_of_dag_names()
    if not dag_names:
        click.secho("No DAGs found in the MWAA instance.", fg="red")
        return

    # 2. Prompt for DAG if not provided
    dag_choices = click.Choice(dag_names, case_sensitive=True)
    if dag is None:
        dag_parsed = click.prompt("Select a DAG", type=dag_choices, show_choices=True)
    else:
        try:
            dag_parsed = dag_choices.convert(dag, None, None)
        except click.BadParameter:
            click.secho(f"There is no such DAG as '{dag}'", fg="red")
            return

    # 3. Build CLI arguments
    cmd_args = []
    if start_date:
        cmd_args.extend(["--start", start_date.date().isoformat()])
    if end_date:
        cmd_args.extend(["--end", end_date.date().isoformat()])
    if continue_on_failures:
        cmd_args.append("--continue-on-failures")
    if reset_dagruns:
        cmd_args.append("--reset-dagruns")
    if conf:
        cmd_args.append(f"--conf '{conf}'")
    
    cmd_args.extend(["--yes", dag_parsed])

    # 4. Run the backfill in MWAA
    command = f"dags backfill {' '.join(cmd_args)}"
    click.secho(f"Executing: {command}", fg="blue")
    
    stdout, stderr = execute_mwaa_cli_command(command)
    
    if stdout:
        click.secho("Result:", fg="green")
        click.echo(stdout)
    if stderr:
        click.secho("Error:", fg="red")
        click.echo(stderr)


if __name__ == "__main__":
    backfill()

```


