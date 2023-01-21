# RCUH FIS Modernization - web-fis

## Branch & Domain:

| #   | Branch  | Domain                                |     Others     |
| --- | :------ | :------------------------------------ | :------------: |
| 1   | local   | http://fis.rcuh-fis-local.lms.me:6636 |                |
| 2   | local   | http://rcuh-fis-local.lms.me:7896     |  web-identity  |
| 3   | develop | https://webfis.dev.fis.lms.rcuh.com   | default branch |

## Install:

1. install dependencies

```
yarn
```

2. create `.env` file

3. start project

```
yarn start
```

4. install python, and [secrets baseline](https://github.com/Yelp/detect-secrets)

- An application for detecting and preventing secrets key before push commit

## How to fix secret-baseline

```
yarn fix-detect-secret

```

## Commit Message Format:

```
<type>(<scope>): <task name> | <short summary>
  │       │         │              │
  │       │         │              └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │         │
  │       │         └─⫸ Task name was assign for this commit
  │       │
  │       └─⫸ Commit Scope: animations|bazel|benchpress|common|compiler|compiler-cli|core|
  │                          elements|forms|http|language-service|localize|platform-browser|
  │                          platform-browser-dynamic|platform-server|router|service-worker|
  │                          upgrade|zone.js|packaging|changelog|dev-infra|docs-infra|migrations|
  │                          ngcc|ve|global|*
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `<task_name>` and `<scope>` field is optional.

### Commit Message Example

- `feat(check-in table): HDOAAQRP-672/Add to queue function`
- `style(pre check-in form): HDOAAQRP-645/update style Skeleton`
- `fix(check-in table): close toast when click on snackbar`
- `refactor(check-in table): Optimized component re-render`
- `ci: update buildspec -fix slack notification`

Or install extension: [Commit Message Editor](https://marketplace.visualstudio.com/items?itemName=adam-bender.commit-message-editor)
