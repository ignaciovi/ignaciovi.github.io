---
title: Macros
ready: true
tags:
  - data-engineering
  - dbt
publish: true
---
In DBT macros, the snippet:

```python
{% if not execute %} 
    {{ return(False) }} 
{% endif %}
```


exits the macro early if it is only being compiled and not executed in the database.
The `execute` statement  indicates whether the code is being executed in the actual database.
Avoiding code execution during compilation is often done to prevent unnecessary database load, speed up the compile process, and avoid errors when database access isn’t required.
