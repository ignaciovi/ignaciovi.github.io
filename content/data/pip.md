---
title: PIP tips
date: 2024-12-30
ready: true
publish: true
---
```
pip install -I -r requirements.txt
```

- `-I` ignores any previously installed packages and forces the installation of the requested versions of the packages in the requirements file.
- `-r` tells `pip` to read the list of dependencies from the file `unit_tests/requirements.txt`
