<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.0 | Updated: 2026-06-17 -->

# Technical Domain

**Purpose**: Tech stack, architecture, and development patterns for `muir`, a React 19 component library built with FSD and Material Design 3.
**Last Updated**: 2026-06-17

## Quick Reference
**Update Triggers**: Tech stack changes | New component patterns | Tooling updates
**Audience**: Developers, AI agents

## Monorepo Architecture

This is a **Turborepo + Bun workspaces** monorepo with three packages:

| Package | Directory | Purpose | Publishable |
|---|---|---|---|
| `muir` | `packages/muir/` | Core UI library | Yes |
| `muir-capacitor` | `packages/muir-capacitor/` | Capacitor wrapper (re-exports muir) | Yes |
| `muir-docs` | `apps/docs/` | Landing page & component docs | No (private) |

### Dependency Graph

```
muir ← muir-capacitor ← muir-docs
```

- `muir` has no workspace dependencies
- `muir-capacitor` depends on `muir` (`workspace:*`)
- `muir-docs` depends on `muir-capacitor` (`workspace:*`)

### Key Config

| File | Purpose |
|---|---|
| `turbo.json` | Task pipeline (build, dev, test, lint) |
| `biome.json` | Shared lint/format config |
| `tsconfig.base.json` | Shared TS config |
| `.changeset/config.json` | Versioning (ignores `muir-docs`) |
| `scripts/babel-plugin-auto-clsx.js` | Auto-imports `cx` in `.tsx` files |
| `scripts/babel-plugin-auto-animated.js` | Auto-imports animation helpers |

### Build Tools

| Package | Builder | Output |
|---|---|---|
| `muir` | rslib | ESM (`dist/`), `bundle: false`, `dts: true` |
| `muir-capacitor` | rslib | ESM (`dist/`), `bundle: false`, `dts: true` |
| `muir-docs` | rsbuild | Static app (`dist/`), HMR dev server |

### Known Issues

- `muir-capacitor` DTS generation may fail in parallel dev mode (race condition finding `muir/extra` declarations). JS output succeeds. Leave as-is.

## Primary Stack

| Layer | Technology | Version | Rationale |
|---|---|---|---|
| Framework | React | 19.2 | Peer dep; MD3 component library |
| Language | TypeScript | 5.9 strict | Type safety, strict mode |
| Runtime | Bun | 1.3.10 | Fast scripts, lockfile |
| Build | Rslib / Rsbuild | 0.19 / 1.7 | ESM library + dev/docs |
| Monorepo | Turborepo | 2.x | Task pipeline, caching |
| Testing | Rstest + happy-dom | 0.8 / 20.6 | Testing Library adapter |
| Lint | Biome | 2.3 | Fast format + check |
| Docs | Storybook + MDX | 10.2 | Component docs |
| Versioning | Changesets | — | Workspace versioning |

## Code Patterns

### Library Export Groups
The library exposes four public entry points via `muir`:

```typescript
// muir (packages/muir/src/index.ts) — full library
export * from './app/theme-provider'
export * from './components'
export * from './shared'

// muir/basic (packages/muir/src/basic.ts) — basic UI only
export * from './components/button'
export * from './components/checkbox'
// ... etc

// muir/form (packages/muir/src/form.ts) — react-hook-form wrappers
export * from './components/form'

// muir/extra (packages/muir/src/extra.ts) — extra components
export * from './components/toggle-button'
```

`muir-capacitor` mirrors the same four entry points by re-exporting from `muir`.

### Component Structure (FSD)
Each component is self-contained with segments:

```typescript
// src/components/button/index.ts — public API
export type { ButtonProps } from './model/types'
export { default as Button } from './ui/button'

// src/components/button/ui/button.tsx
function Button({ variant = 'filled', ...props }: ButtonProps) {
  return createElement(isAnchor ? 'a' : 'button', { ... })
}
```

### Customization Layer
Always define CSS variables on the component root node for plain values so users can customize without editing internal variables.

```css
.button {
  --height: 2.5rem;
  --shape: var(--md-sys-shape-corner-full);
  --gap: 0.5rem;
  /* user-overridable */
}
```

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Files | kebab-case | `button.tsx`, `user-profile.tsx` |
| Components | PascalCase | `Button`, `TextInput` |
| Functions | camelCase | `useLogin`, `atr` |
| CSS Modules | `style.module.css` | `src/components/button/ui/style.module.css` |
| Data attributes | `muir-*` | `muir-name='code'` |
| CSS class prefixes | `muir-` | `muir-surface-grain-*` |
| Library groups | kebab-case | `basic`, `form`, `extra` |

## Code Standards

- TypeScript strict mode with no unchecked errors
- Feature-Sliced Design hierarchy: `app > components > shared`
- Public API only via `index.ts` in each slice; never deep-import
- Never import from higher layers or cross-slice directly
- Business logic lives in `model/`, not `ui/`
- Prefer composition: Page → Widget → Feature → Entity → Shared
- All changes require `bun run format`, `bun run lint`, and `bun run test`
- Never run `bun run build` or `bun run dev` directly — use `turbo run build` / `turbo run dev`
- Inside `muir` library: use **relative imports only** (no `@/` aliases, no self-package imports)
- Inside `muir-capacitor`: use **package name imports** (`muir`, `muir/basic`, etc.)
- Inside `muir-docs`: use **`muir-capacitor` package imports** and **`src/` absolute paths**

## Security Requirements

- Validate all peer dependency versions (`react`, `react-hook-form`, `yup`, `zod`, `animejs`)
- Component props typed with strict interfaces (no `any`)
- CSS variable isolation prevents style leakage
- Input sanitization via `atr`/`clsx` helpers

## Codebase References

**Implementation**: `packages/muir/src/components/*/ui/*.tsx` — component renderers with MD3 tokens
**Types**: `packages/muir/src/components/*/model/types.ts` — strict prop interfaces
**Styles**: `packages/muir/src/components/*/ui/style.module.css` — CSS variable customization layer
**Exports**: `packages/muir/src/index.ts`, `packages/muir/src/basic.ts`, `packages/muir/src/form.ts`, `packages/muir/src/extra.ts`
**Capacitor re-exports**: `packages/muir-capacitor/src/index.ts`, `basic.ts`, `form.ts`, `extra.ts`
**Docs**: `apps/docs/docs/components/*.mdx` — MDX component documentation
**Config**: `package.json` (peer deps, ESM exports), `tsconfig.json`, `turbo.json`

## Related Files

- Architecture: `.opencode/rules/file-structure.md`
- File Structure: `.opencode/rules/file-structure.md`
- Tools: `.opencode/rules/tools.md`
- Git: `.opencode/rules/git.md`
- Build & Run: `.opencode/rules/scripts.md`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Size: 118 lines (limit: 200 per @mvi_compliance)
Status: ✅ MVI compliant