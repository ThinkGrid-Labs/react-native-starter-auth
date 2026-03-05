# Contributing to @think-grid-labs/react-native-starter-auth

Thank you for your interest in contributing! This guide will help you get started.

## Development setup

```bash
# Clone the repo
git clone https://github.com/ThinkGrid-Labs/react-native-starter-auth.git
cd react-native-starter-auth

# Install dependencies (also installs lefthook git hooks)
yarn install

# Run the example app
cd example
yarn install
yarn ios
# or
yarn android
```

## Commit convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/).
Commits are linted automatically via `lefthook` + `commitlint`.

| Type | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance, tooling, dependencies |
| `refactor:` | Code change that is neither a fix nor a feature |
| `perf:` | Performance improvement |

**Breaking changes** — add `!` after the type or add a `BREAKING CHANGE:` footer:
```
feat!: remove deprecated login callback API
```

## Scripts

```bash
yarn lint           # ESLint
yarn lint:fix       # ESLint with auto-fix
yarn format         # Prettier format
yarn format:check   # Prettier check (CI)
yarn type-check     # TypeScript check
yarn test           # Jest
yarn validate       # All of the above
```

## Pull requests

1. Fork the repo and create a branch from `main`
2. Write tests for your changes
3. Make sure `yarn validate` passes
4. Open a PR — the CI will run automatically

## Releasing (maintainers only)

Releases are automated via `release-it` on push to `main`.
The GitHub Actions release workflow handles versioning, changelog, git tags, and npm publish.

To do a manual release locally:
```bash
yarn release
```

This requires `NPM_TOKEN` and `GITHUB_TOKEN` set in your environment.
