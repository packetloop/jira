# JIRA + Git flow + Gitlab Integration

## Installation

Hopefully you have nodejs installed already.

```bash
npm install -g packetloop/jira
```

## Configuration:

Set following ENV vars (add these to your `.bashrc` and change whatever needed)

```bash
export JIRA_URL=url
export JIRA_TOKEN=user:pass
export GITLAB_URL=url
export GITLAB_TOKEN=token
export GITLAB_PING_FRONTEND="@list @of @users @to @ping @on @each @review"
#export GITLAB_PING_DEFAULT="$GITLAB_PING_FRONTEND"
export GITLAB_PING_DEFAULT="Hello, @everyone!"
```

## Usage

```bash
jira start AB-1234

# do something, commit, push. This will set description to $GITLAB_PING_FRONTEND
jira review AB-1234

# you can specify GITLAB_PING_FRONTEND group this way
jira review AB-1234 frontend

# to simply fetch JIRA summary
jira summary AB-1234
```

There is a little dynamic contextual help on available commands and their basic syntax

```bash
23:54 $ jira
Usage:
  review:
    jira review <issue key> [<ping group>]
  start:
    jira start <issue key>
  summary:
    jira summary <issue key>

23:59 $ jira summary
[Error: Issue key must be specified]
Usage
  jira summary <issue key>
```

## How it works:

#### `start AB-1234`
1. Make a call to jira to resolve ticket summary: `Awesome feature`
2. Dasherize it, create a new branch and switch to it: `feature/AB-1234-Awesome-feature`

#### `review AB-1234`
1. Make a call to jira to resolve ticket summary: `Awesome feature`
2. Get origin url from GIT and extract project namespace `group/project`
3. Search GITLAB for project ID by namespace
4. Take your token and submit merge request `feature/AB-1234-Awesome-feature` --> `develop`
5. Ping default user group (put `GITLAB_PING_DEFAULT` to merge request description).
To ping `GITLAB_PING_FRONTEND` group, use `review AB-1234 frontend`
