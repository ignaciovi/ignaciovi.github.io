---
title: Simplifying Column Metadata with Macros in DBT
tags:
  - data-engineering
  - dbt
ready: true
---
In DBT, you might encounter situations where a column contains identical metadata across multiple models. To avoid repetition, you can create a "macro" within your documentation `.yaml` file. Here’s an example of how to do this:

```
common_columns:
	event_time: &EVENT_TIME
		name: EVENT_TIME
		data_type: timestamp_ltz
		description: Time when event was ingested
		tests:
			- dbt_expectations.expect_column_values_to_be_of_type:
				  column_type: timestamp

models:
	- name: stg_table
	  schema: STAGING_AREA_LAYER
	  columns:
	   - *EVENT_TIME
```

Defining the column in `common_columns` allows to easily use it in any model by calling `*column_name`