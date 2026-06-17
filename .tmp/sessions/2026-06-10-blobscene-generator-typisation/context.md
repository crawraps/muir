# Task Context: BlobScene Generator Typisation

Session ID: 2026-06-10-blobscene-generator-typisation
Created: 2026-06-10T00:00:00Z
Status: in_progress

## Current Request
Typise the blobscene generator script and update all properties according to generator requirements. Do not touch styles or UI.

## Context Files (Standards to Follow)
- .opencode/context/core/standards/code-quality.md
- .opencode/rules/react-slice.md

## Reference Files (Source Material to Look At)
- src/widgets/blob-scene/model/generator.ts (target of rewrite)
- src/widgets/blob-scene/model/properties.ts (target of update)
- src/widgets/blob-scene/ui/blob-scene.tsx (consumer — read only)
- src/widgets/blob-scene/ui/animation.tsx (consumer — read only)
- src/widgets/blob-scene/ui/style.module.css (read only)
- src/widgets/blob-scene/index.ts (read only)
- env.d.ts (auto-imports)
- lib/shared/anime-scope.ts (reference)

## External Docs Fetched
None — purely internal refactor using project conventions.

## Components
- **generator.ts**: Convert to pure TypeScript with explicit types, seedable PRNG, no jQuery.
- **properties.ts**: Add `smooth` prop, ensure semantic mapping with generator config.

## Constraints
- DO NOT modify styles (style.module.css, animation.tsx, blob-scene.tsx, index.ts)
- Scope: only `model/generator.ts` and `model/properties.ts`
- No `any`, strict TypeScript
- Functional, no mutation
- Match project JSDoc style (`@docs`, `@default`)
- Generator should remain a pure function returning an SVG path string (or `{ path: string }`)

## Exit Criteria
- [ ] `model/generator.ts` is fully TypeScript-typed (no `any`, all function signatures explicit)
- [ ] Generator no longer references jQuery (`$`)
- [ ] Generator exposes a pure function whose signature aligns with `BlobSceneProps`
- [ ] `model/properties.ts` is updated so all generator inputs are exposed as documented props
- [ ] `bun run format && bun run lint && bun run test` all pass
