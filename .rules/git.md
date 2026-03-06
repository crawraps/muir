# Version Control Workflow — TypeScript Component Library

---

## Table of Contents

1. [Branch Strategy](#1-branch-strategy)
2. [Commit Convention](#2-commit-convention)
3. [Implementing New Features](#3-implementing-new-features)
4. [Fixing Bugs](#4-fixing-bugs)
5. [Releasing Versions](#5-releasing-versions)
6. [Hotfixes](#6-hotfixes)
7. [Pull Request Rules](#7-pull-request-rules)
8. [CI/CD Gates](#8-cicd-gates)
9. [AI Agent Rules](#9-ai-agent-rules)

---

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

---

## 3. Implementing New Features

### Step-by-step

```
1.  Pick up ticket from backlog
2.  git checkout develop && git pull origin develop
3.  git checkout -b feat/<ticket>-<slug>
4.  Implement (see checklist below)
5.  Open Draft PR early → mark Ready when done
6.  Pass all CI gates
7.  Get ≥1 approval
8.  Squash-merge into develop
9.  Delete remote branch
```

### Implementation checklist

- [ ] **Types** — Export all public props via named interfaces in `model/types.ts`
- [ ] **Component** — Implement in `lib/components/<name>/ui/<name>.tsx`
- [ ] **Index** — Re-export from `lib/components/<name>/index.ts` and the root `lib/index.ts`
- [ ] **Stories** — Create `<name>.stories.tsx` in `stories/` covering: default, all variants, edge cases, a11y story
- [ ] **Tests** — Write rstest unit tests in `tests/lib/components/<name>/ui/<name>.test.tsx`; target ≥80% branch coverage
- [ ] **Biome** — Run `bun run lint` before committing; zero lint errors/warnings
- [ ] **Tokens** — Use design tokens only; no hard-coded colours or spacing values
- [ ] **Accessibility** — At minimum: keyboard nav, ARIA roles/labels, colour contrast AA
- [ ] **Changelog** — Add entry to `CHANGELOG.md` under `[Unreleased]`

### File structure for a new component

```
lib/
  components/
    tooltip/
      ui/
        tooltip.tsx          ← component
        style.module.css     ← styles
      model/
        types.ts             ← prop interfaces
      index.ts               ← re-exports

tests/
  lib/
    components/
      tooltip/
        ui/
          tooltip.test.tsx   ← rstest tests

stories/
  tooltip.stories.tsx        ← Storybook stories
```

---

## 4. Fixing Bugs

### Step-by-step

```
1.  Confirm bug and identify affected component/version
2.  git checkout develop && git pull origin develop
3.  git checkout -b fix/<ticket>-<slug>
4.  Write a FAILING test that reproduces the bug (rstest)
5.  Fix the code until the test passes
6.  Run full test suite: bun run test
7.  Run Biome: bun biome-check
8.  Verify Storybook story still renders correctly
9.  Update CHANGELOG.md under [Unreleased] → Fixed
10. Open PR → squash-merge into develop
```

### Rules

- Never fix a bug without a corresponding test.
- Do **not** refactor unrelated code in a fix branch; open a separate `refactor/*` branch.
- If the bug exists in `main` and is critical, follow the [Hotfix](#6-hotfixes) flow instead.

---

## 5. Releasing Versions

Versioning follows [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

| Change | Version bump |
|---|---|
| Breaking change (`BREAKING CHANGE` footer or `!`) | MAJOR |
| New backward-compatible feature | MINOR |
| Backward-compatible bug fix | PATCH |

### Release flow

```
1.  git checkout develop && git pull origin develop
2.  git checkout -b release/vX.Y.Z
3.  Bump version:  bun run version <major|minor|patch>
4.  Update CHANGELOG.md: move [Unreleased] → [X.Y.Z] with date
5.  Commit: git commit -m "chore(release): vX.Y.Z"
6.  Open PR: release/vX.Y.Z → main
7.  After merge: git tag vX.Y.Z on main
8.  git push origin vX.Y.Z
9.  GitHub Actions publishes to npm and deploys Storybook
10. Back-merge main → develop:
      git checkout develop && git merge main && git push
```

### Tag format

```
v2.4.0
v2.4.0-beta.1   ← pre-releases
v2.4.0-rc.1
```

---

## 6. Hotfixes

For critical bugs discovered in production (`main`).

```
1.  git checkout main && git pull origin main
2.  git checkout -b hotfix/<ticket>-<slug>
3.  Fix + test + Biome check
4.  Update CHANGELOG.md under new patch version
5.  Bump patch version
6.  Commit: "fix(<scope>): <description>"
7.  PR: hotfix/* → main  (expedited review, 1 approval minimum)
8.  After merge: tag vX.Y.(Z+1) on main
9.  Back-merge main → develop immediately
```

---

## 7. Pull Request Rules

### PR title

Must be a valid Conventional Commit subject line — the squash-merge commit is derived from it.

```
feat(badge): add status variant
fix(input): correct placeholder colour in dark mode
```

### PR description template

```markdown
## Summary
<!-- What does this PR do? -->

## Type of change
- [ ] feat  - [ ] fix  - [ ] chore  - [ ] docs  - [ ] refactor

## Checklist
- [ ] Tests added / updated (rstest)
- [ ] Storybook stories added / updated
- [ ] Biome passes with zero errors
- [ ] CHANGELOG.md updated
- [ ] Breaking change documented (if applicable)

## Screenshots / Storybook link
<!-- Paste Storybook preview URL or screenshot -->
```

### Review requirements

| Branch target | Min approvals | Required checks |
|---|---|---|
| `develop` | 1 | CI full suite |
| `main` (release) | 2 | CI full suite + Storybook build |
| `main` (hotfix) | 1 | CI full suite |

### Merge strategy

- Feature / fix branches → **Squash and merge** into `develop`
- Release branches → **Merge commit** into `main` (preserves history)
- Hotfix branches → **Merge commit** into `main`

---

## 8. CI/CD Gates

All gates run via **GitHub Actions** on every push and PR.

### On pull_request

```yaml
jobs:
  lint:       bun biome-check                        # zero errors required
  typecheck:  bun type-check                         # zero errors required
  test:       bun run test                           # rstest, all tests green
  storybook:  bun run build:storybook                # builds without error
```

### On push to main

```yaml
jobs:
  publish-npm:      npm publish --access public
  deploy-storybook: chromatic --auto-accept-changes  # or static deploy
  create-release:   gh release create $TAG --generate-notes
```

### Branch protection rules (GitHub Settings)

- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require at least 1 (or 2) approving reviews
- Dismiss stale reviews on new push
- Restrict force-pushes to `main` and `develop`

---

## 9. AI Agent Rules

> These rules govern how an AI coding agent (e.g. Claude, Copilot Workspace, Cursor) MUST behave when operating in this repository.

---

### 9.1 Branch hygiene

- **Never** commit directly to `main` or `develop`.
- **Always** create a new branch with the correct prefix before making changes.
- Branch name must follow the pattern: `<type>/<ticket?>-<kebab-slug>`.
- If no ticket number is available, omit it: `feat/add-avatar-component`.

### 9.2 Commit discipline

- Every commit must be a valid Conventional Commit.
- **Never** bundle unrelated changes in a single commit.
- Commits must be atomic: one logical change per commit.
- Do **not** commit generated files (`.storybook/storybook-static/`, `dist/`, `coverage/`) unless they are part of a deliberate release commit.

### 9.3 Code quality gates (run before every commit)

```bash
# 1. Lint and format
bun biome-check
bun run format

# 2. Type-check
bun type-check

# 3. Tests
bun run test

# 4. Verify Storybook builds
bun run build:storybook
```

**All four must pass.** If any fails, fix before proceeding. Alternatively, run `bun all-check` to run typecheck and biome-check.

### 9.4 Test requirements

- Every new component **must** have corresponding tests in the `tests/lib/components/` directory, following the exact structure of the code (e.g. `tests/lib/components/button/ui/button.test.tsx`).
- Every bug fix **must** include a new test that fails before the fix and passes after.
- Do **not** delete or skip existing tests without explicit human instruction.

### 9.5 Storybook requirements

- Every new component **must** have a `*.stories.tsx` file inside the `stories/` directory.
- Stories must cover: default render, all prop variants, and at least one accessibility-focused story.
- Stories must use **args / controls** — avoid hard-coded static stories.

### 9.6 Design tokens

- **Never** use hard-coded colour values, spacing values, or typography values.
- All values must reference tokens from the design token system (e.g. `var(--color-primary-500)`).
- If a required token does not exist, add it to the tokens source file and document it.

### 9.7 TypeScript rules

- All public component props must be typed via exported interfaces in `model/types.ts`.
- **Never** use `any`. Use `unknown` with a type guard if the type is truly dynamic.
- Do not suppress TypeScript errors with `// @ts-ignore` or `// @ts-expect-error` without a comment explaining why.

### 9.8 Biome rules

- Biome is the single source of truth for linting and formatting. Do **not** add ESLint, Prettier, or other formatters.
- Do not edit `biome.json` without human approval.
- If Biome reports an error that cannot be auto-fixed, investigate and fix the root cause — do **not** add `// biome-ignore` suppressions without a comment.
- Naming rules: Use **kebab-case** for every file name.

### 9.9 Pull request behaviour

- Open a **Draft PR** as soon as a branch has its first commit.
- PR title must be a valid Conventional Commit subject line.
- Fill in every section of the PR description template.
- Mark as "Ready for Review" only after all CI checks pass.
- **Never** approve or merge your own PR — leave that to a human reviewer.

### 9.10 CHANGELOG maintenance

- Every change that affects the public API or user experience must have a `CHANGELOG.md` entry under `[Unreleased]`.
- Use the categories: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
- Do **not** edit entries for already-released versions.

### 9.11 Breaking changes

- If a change is breaking, the commit type must include `!` (e.g. `feat(tokens)!:`) **and** include a `BREAKING CHANGE:` footer.
- A migration guide must be added to `docs/migration/` before the PR is marked ready.
- Breaking changes require explicit human approval in the PR review.

### 9.12 Forbidden actions

| Action | Rule |
|---|---|
| Force-push to `main` / `develop` | ❌ Never |
| Merge without CI passing | ❌ Never |
| Publish to npm manually | ❌ Never — use the release flow |
| Edit `package.json` version directly without a release branch | ❌ Never |
| Remove or bypass branch protection | ❌ Never |
| Hard-code secrets or API keys | ❌ Never |

### 9.13 When in doubt

- Open an issue or leave a PR comment describing the ambiguity.
- Do **not** make assumptions that affect the public API — ask a human.
- If a CI check fails for an unclear reason, report it as a PR comment with the full error log before attempting a fix.

---

*Last updated: 2026-03 — maintained alongside the component library.*
