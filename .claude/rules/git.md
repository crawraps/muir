# Version control workflow

## 1. Branch Strategy

The repository follows a **trunk-based development** model with short-lived feature branches.

```
main                  ← stable, always releasable
  └── develop         ← integration branch (optional for larger teams)
        ├── feat/<ticket>-<slug>
        ├── fix/<ticket>-<slug>
        ├── chore/<slug>
        └── docs/<slug>
```

| Branch prefix | Purpose | Base branch | Merges into |
|---|---|---|---|
| `main` | Production-ready code | — | — |
| `develop` | Pre-release integration | `main` | `main` |
| `feat/*` | New components / features | `develop` | `develop` |
| `fix/*` | Bug fixes | `develop` | `develop` |
| `hotfix/*` | Critical production patches | `main` | `main` + `develop` |
| `chore/*` | Tooling, deps, config | `develop` | `develop` |
| `docs/*` | Documentation only | `develop` | `develop` |
| `release/*` | Release preparation | `develop` | `main` + `develop` |


---

## 2. Commit Convention

All commits **must** follow [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<scope>): <short summary>

[optional body]

[optional footer: BREAKING CHANGE / closes #issue]
```

### Allowed types

| Type | When to use |
|---|---|
| `feat` | New component or user-visible capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change (Biome auto-fixes count here) |
| `refactor` | Code change without feature/fix |
| `test` | Adding or updating rstest tests |
| `chore` | Build, tooling, dependency updates |
| `perf` | Performance improvement |
| `ci` | GitHub Actions / CI config |
| `revert` | Reverts a previous commit |

### Scope

Use the component or subsystem name: `button`, `tokens`, `storybook`, `biome`, `ci`, etc.

### Examples

```
feat(tooltip): add controlled/uncontrolled modes
fix(button): resolve focus ring missing in Safari
test(modal): add rstest snapshot for open/close states
chore(deps): bump biome to 1.9.0
ci: add Storybook publish step on merge to main
```

### Breaking changes

```
feat(tokens)!: rename color scale from 100–900 to 10–90

BREAKING CHANGE: consumers must update all token references.
Migration guide: docs/migration/v3.md
```

