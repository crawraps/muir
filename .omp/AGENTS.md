# muir — React 19 Material Design 3 Component Library

Turborepo + Bun workspaces monorepo with 5 scoped packages.

## Packages

| Package | Directory | Name | Depends on |
|---|---|---|---|
| `base` | `packages/base/` | `@muir/base` | — (self-contained) |
| `extra` | `packages/extra/` | `@muir/extra` | `@muir/base` |
| `form` | `packages/form/` | `@muir/form` | `@muir/base`, `@muir/extra` |
| `capacitor` | `packages/capacitor/` | `@muir/capacitor` | `@muir/base`, `@muir/extra`, `@muir/form` |
| `navigation` | `packages/navigation/` | `@muir/navigation` | wouter, keepalive-for-react |
| docs | `apps/docs/` | `muir-docs` (private) | `@muir/capacitor`, `@muir/navigation` |

## Dependency Flow

```
@muir/base ← @muir/extra ← @muir/form
@muir/capacitor aggregates base + extra + form
@muir/navigation is standalone
muir-docs depends on @muir/capacitor + @muir/navigation
```

## Architecture
- `@muir/base`: FSD with `app > components > shared` layers. Uses `src/` alias for cross-slice imports and relative paths within slices. Core components: button, switch, checkbox, slider, text, text-input, radio-button, icon, surface, split, bottom-sheet, error-message.
- `@muir/extra`: Extra components (snackbar, toggle-button, code). Has own `shared/smart-clsx.ts`.
- `@muir/form`: Form wrappers (react-hook-form). Components: form, and FormXxx wrappers for base components.
- `@muir/capacitor`: Thin re-export aggregator. Exposes `./base`, `./basic` (= `./base`), `./form`, `./extra` subpaths.
- `@muir/navigation`: Tab navigation system. Different structure — `model/` and `ui/` directly at `src/` root, no `components/` wrapper.
- `muir-docs`: FSD with `app > pages > widgets > features > entities > shared`. Uses `@muir/capacitor` for components, `@muir/navigation` for nav, `src/` alias for internal paths.

## Stack
React 19.2, TypeScript 5.9 strict, Bun 1.3, Rslib (library build), Rsbuild (docs build), Rstest, Biome 2.3, Storybook 10, Changesets, anime.js 4

## Build
`turbo run build|dev|test|lint` — never `bun run build` or `bun run dev` directly (use turbo)

## Data attributes
All custom HTML data attributes use the `muir-` prefix (e.g. `muir-name='code'`)

## Rules
Read `rule://monorepo-architecture`, `rule://file-structure`, `rule://react-component-patterns` before editing components.
Read `rule://styling-tools` before working with CSS classes or state attributes.
Read `rule://build-commands` before running any build/test/lint commands.