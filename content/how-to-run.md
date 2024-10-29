# Syncing with forked repo

```
# Navigate to your forked repository
cd path/to/your/forked-repo

# Add the original repo as the "upstream" remote
git remote add upstream https://github.com/original-owner/original-repo.git
```

```
git fetch upstream
```

```
# Switch to your main branch (often `main` or `master`)
git checkout v4

# Merge changes from the upstream main branch
git merge upstream/v4
```

Then,

```
npm i
```

We need node_modules folder in the repo and that creates it

Go to root of repo, ignaciovi.github.io and then run 

```
npx quartz build --serve
```

To see locally