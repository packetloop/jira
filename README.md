# JIRA + Git flow + Gitlab Integration

## Configuration:

Set following ENV vars (add these tou your `.bashrc`)

```bash
export JIRA_URL=url
export JIRA_TOKEN=user:pass
export GITLAB_URL=url
export GITLAB_TOKEN=token
export GITLAB_PING_FRONTEND="@list @of @users @to @ping @on @each @review"
export GITLAB_PING_DEFAULT="$GITLAB_PING_FRONTEND"
```

## Usage

```bash
jira start AB-1234
# do your commits, push
jira review AB-1234
```

## How it works:

#### `start AB-1234`
1. Make a call to jira to resolve ticket summary: `Awesome feature`
2. Dasherize it, create a new branch and switch to it: `feature/AB-1234-Awesome-feature`

#### `review AB-1234`
1. Make a call to jira to resolve ticket summary: `Awesome feature`
2. Take your token and submit merge request `feature/AB-1234-Awesome-feature` --> `develop`
3. Ping default user group (put `GITLAB_PING_DEFAULT` to merge request description).
To ping `GITLAB_PING_FRONTEND` group, use `review AB-1234 frontend`
