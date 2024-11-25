---
title: Testing tips
ready: true
deployed: true
tags:
  - data-engineering
  - dbt
---

In some occasions, we have NULL data in DEV environment that is not supposed to be NULL in PROD environment. In these cases, when we want to run a test in one environment but omit it in another (so it doesn't keep failing), we can add the following property to our test

```
- name: my_table
    description: My description
    data_tests:
        - not_null:
            enabled: "{{ env_var('ENV') == 'prod' }}"

```


Add this to run test only on a given environment
