# Task Context: BlobScene Widget

Session ID: 2026-06-08-blob-scene
Created: 2026-06-08
Status: in_progress

## Current Request

Create a `BlobScene` feature widget for the preview/documentation site. The widget should:
1. Display different blobs on a scene
2. Support animated parameters:
   - `roughness` (0-1): controls how uneven the blob surface is (0 = round, 1 = jagged)
   - `vertices` (number): controls the number of initial vertices in the SVG polygon
3. Accept a `blob` prop that defines which blob is currently shown
4. Animate transitions when the parameters change

## Context Files (Standards to Follow)

- `.opencode/context/core/standards/code-quality.md` — TypeScript strict, function declarations, CSS Modules, no `any`
- `.opencode/context/core/standards/navigation.md` — Project navigation
- `.opencode/rules/react-slice.md` — FSD segment structure, `atr` for booleans, `AnimeScope` pattern
- `.opencode/rules/file-structure.md` — Landing page FSD layers (app > pages > widgets > features > entities > shared)
- `.opencode/rules/tools.md` — `cx` (smart-clsx) and `atr` (attributify) usage
- `.opencode/rules/documentation-components.md` — MDX doc structure for widgets

## Reference Files (Source Material to Look At)

- `lib/shared/anime-scope.ts` — `AnimeScope` wrapper (re-exported via `@/lib/shared`)
- `lib/shared/component-lifecycle.ts` — `useComponentDidUpdate` hook
- `lib/components/slider/ui/animation.tsx` — Example of value-driven animation
- `lib/components/slider/ui/slider.tsx` — Composition pattern with `<Animated>` wrapper
- `lib/components/switch/ui/animation.tsx` — More complex `AnimeScope` example
- `lib/components/surface/ui/surface.tsx` — SVG filter usage pattern
- `lib/components/button/ui/button.tsx` — Function declaration, minimal destructuring pattern
- `src/widgets/sidebar/model/types.ts` — Site widget `model/types.ts` pattern
- `src/widgets/docs-pane/index.ts` — Site widget public API pattern
- `docs/components/surface.mdx` — MDX doc with live examples
- `docs/components/slider.mdx` — MDX doc with API table and CSS variables
- `src/entity/docs/api/docs.ts` — How MDX files are auto-discovered

## External Docs Fetched

- `.tmp/external-context/animejs/svg-morph-waapi-spring.md` — Anime.js v4 SVG `points` animation, `svg.morphTo()`, `createSpring`, and `waapi.animate` references

## Components

1. `BlobScene` widget (primary):
   - Renders an SVG `<polygon>` that morphs on parameter change
   - Props: `blob` (preset name), `roughness` (0-1), `vertices` (count), `size` (px), `seed` (override)
   - Smoothly animates between different point configurations

2. Procedural blob generator:
   - `generateBlobPoints(vertices, roughness, size, seed)` — returns SVG points string
   - Uses deterministic PRNG seeded by the blob name

3. (Optional) `BlobScene.mdx` documentation entry

## Constraints

- Site widget → use `src/widgets/blob-scene/` with `ui/`, `model/`, `index.ts`
- Import from `@/lib` (highest level) for shared utilities like `AnimeScope`, `useComponentDidUpdate`
- Use `cx` (auto-imported) and `atr` (manual import from `@/lib/shared/attributify`)
- Function declaration, not arrow function
- CSS Modules with `style.module.css` next to `.tsx`
- Public API via `index.ts`
- Avoid over-engineering: simple string tween on `points` attribute since same vertex count produces smooth morph; if vertex count changes, regenerate without animation (acceptable for docs demo)
- No `any`; explicit types
- Use `useComponentDidUpdate` for controlled animation on prop changes (matches slider/switch patterns)

## Exit Criteria

- [ ] Widget renders an animated SVG blob in a React 19/TypeScript FSD slice
- [ ] `blob` prop switches the current blob with smooth animation
- [ ] `roughness` prop (0-1) animates the blob's unevenness
- [ ] `vertices` prop animates changes in the polygon point count (gracefully handles count mismatch)
- [ ] `bun run format && bun run lint && bun run test` all pass
- [ ] Pattern follows project conventions (function declaration, minimal destructuring, cx + atr, CSS Modules, public API)
