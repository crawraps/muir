---
name: changeset
description: Creates a changeset entry for versioning @muir/base, @muir/extra, @muir/form, @muir/capacitor, and @muir/navigation packages
globs:
  - ".changeset/**"
---

# Changeset Procedure

1. Run `bun run changeset`
2. Select affected packages (@muir/base, @muir/extra, @muir/form, @muir/capacitor, @muir/navigation — muir-docs is ignored)
3. Choose bump type:
   - `patch` — bug fix, no API change
   - `minor` — new feature, backward compatible
   - `major` — breaking change
4. Write a summary in Conventional Commit style
5. Run `bun run version-packages` to apply version bumps

## Breaking changes
Include migration notes in the changeset summary.

## Example
```markdown
---
"@muir/base": minor
"@muir/capacitor": minor
---

feat(switch): add controlled/uncontrolled modes with animation support
```