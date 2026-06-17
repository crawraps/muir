# Monorepo Architecture

This project is a **Turborepo + Bun workspaces** monorepo. Understanding the package boundaries and dependency flow is critical.

## Packages

| Package | Directory | Type | Publishable |
|---|---|---|---|
| `muir` | `packages/muir/` | Library | Yes |
| `muir-capacitor` | `packages/muir-capacitor/` | Library (wrapper) | Yes |
| `muir-docs` | `apps/docs/` | App (private) | No |

## Dependency Flow

```
muir ← muir-capacitor ← muir-docs
```

- `muir` has **no** workspace dependencies — it is self-contained
- `muir-capacitor` depends on `muir` via `"muir": "workspace:*"`
- `muir-docs` depends on `muir-capacitor` via `"muir-capacitor": "workspace:*"`

**Never** add a workspace dependency from `muir` to another workspace package. `muir` must remain dependency-free.

## Import Rules

### Inside `packages/muir/src/` (the library)

Use **relative imports only**. No aliases, no package self-imports.

```tsx
// ✅ Cross-slice within library
import { atr } from '../../shared/attributify'
import { AnimeScope } from '../../shared'

// ✅ Within-slice
import type { ButtonProps } from '../model/properties'
import { Animated } from './animation'

// ❌ Forbidden
import { atr } from '@/lib/shared/attributify'
import { Switch } from 'muir/basic'
```

The `#shared` import alias (`#shared/smart-clsx`) is used **only** by the Babel plugin (`scripts/babel-plugin-auto-clsx.js`) — it resolves via rspack/rslib config, not in TypeScript.

### Inside `packages/muir-capacitor/src/` (the wrapper)

Use **package name imports** from `muir`.

```ts
// ✅ Correct
export * from 'muir'
export * from 'muir/basic'
export * from 'muir/form'
export * from 'muir/extra'
```

`muir-capacitor` is a thin re-export layer. It **must not** contain logic — only re-exports.

### Inside `apps/docs/src/` and `apps/docs/docs/` (the docs app)

Use **`muir-capacitor` package imports** and **`src/` absolute paths**.

```tsx
// ✅ From muir-capacitor
import { Switch } from 'muir-capacitor/basic'
import { Form } from 'muir-capacitor/form'

// ✅ App-internal absolute paths
import { NavBar } from 'src/widgets/navbar'
import { MDXRenderer } from 'src/features/mdx-renderer'

// ❌ Never import from muir directly in docs
import { Switch } from 'muir/basic'

// ❌ Never use @/ aliases
import { NavBar } from '@/widgets/navbar'
```

MDX doc files also use `muir-capacitor` for live demos, but usage code blocks show `muir` imports (the published package name that consumers will use).

## Build Pipeline

Turborepo manages build order via `turbo.json`:

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "test": { "dependsOn": ["build"] },
    "lint": { "outputs": [] }
  }
}
```

- `muir` builds first (no dependencies)
- `muir-capacitor` builds after `muir` (has `^build` dependency)
- `muir-docs` builds after `muir-capacitor`
- `dev` task has no `dependsOn` — runs all watches in parallel

## Changesets

Versioning is managed with Changesets. The config (`.changeset/config.json`) ignores `muir-docs` since it's a private app.

To create a changeset:
```bash
bun run changeset
```

To version packages:
```bash
bun run version-packages
```

## Data Attributes

All custom HTML data attributes use the `muir-` prefix:

```tsx
<span muir-name='code'>
```

```css
.code[muir-name='code'] { ... }
```

CSS class name prefixes for generated classes use `muir-`:

```css
.muir-surface-grain-0-5-0-1 { ... }
```

## Output Directory

All packages output to `dist/`:

| Package | Builder | Output |
|---|---|---|
| `muir` | rslib | `packages/muir/dist/` |
| `muir-capacitor` | rslib | `packages/muir-capacitor/dist/` |
| `muir-docs` | rsbuild | `apps/docs/dist/` |

Never configure an alternative output directory like `dist-app/`.