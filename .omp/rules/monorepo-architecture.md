---
description: Turborepo + Bun workspaces package boundaries, dependency flow, and import rules for @muir/base, @muir/extra, @muir/form, @muir/capacitor, @muir/navigation, and muir-docs
globs:
  - "packages/*/package.json"
  - "packages/*/src/**"
  - "apps/*/src/**"
  - "turbo.json"
  - ".changeset/config.json"
---

# Monorepo Architecture

This project is a **Turborepo + Bun workspaces** monorepo with 5 scoped packages. Understanding the package boundaries and dependency flow is critical.

## Packages

|Package|Directory|npm name|Type|Publishable|
|---|---|---|---|---|
|base|`packages/base/`|`@muir/base`|Library (core UI)|Yes|
|extra|`packages/extra/`|`@muir/extra`|Library (extra components)|Yes|
|form|`packages/form/`|`@muir/form`|Library (form wrappers)|Yes|
|capacitor|`packages/capacitor/`|`@muir/capacitor`|Library (aggregator)|Yes|
|navigation|`packages/navigation/`|`@muir/navigation`|Library (tab nav)|Yes|
|docs|`apps/docs/`|`muir-docs`|App (private)|No|

## Dependency Flow

```
@muir/base ← @muir/extra ← @muir/form
@muir/capacitor aggregates @muir/base + @muir/extra + @muir/form
@muir/navigation is standalone (depends on wouter, keepalive-for-react)
muir-docs depends on @muir/capacitor + @muir/navigation
```

- `@muir/base` has **no** workspace dependencies — it is self-contained
- `@muir/extra` depends on `@muir/base` via `"@muir/base": "workspace:*"`
- `@muir/form` depends on `@muir/base` and `@muir/extra`
- `@muir/capacitor` depends on `@muir/base`, `@muir/extra`, and `@muir/form`
- `@muir/navigation` has no workspace dependencies

**Never** add a workspace dependency from `@muir/base` to another workspace package. `@muir/base` must remain self-contained.

## Entry Points

### @muir/base

|Entry|File|Contents|
|---|---|---|
|`@muir/base`|`src/index.ts`|Full package: app/theme-provider, base (all components), shared utilities|
|`@muir/base/basic`|`src/basic.ts`|Alias for `src/base.ts` — all base components|

### @muir/extra

|Entry|File|Contents|
|---|---|---|
|`@muir/extra`|`src/index.ts` → `src/extra.ts`|snackbar, toggle-button, code|

### @muir/form

|Entry|File|Contents|
|---|---|---|
|`@muir/form`|`src/index.ts` → `src/form.ts`|Form component + FormXxx wrappers|

### @muir/capacitor

|Entry|File|Contents|
|---|---|---|
|`@muir/capacitor`|`src/index.ts`|Re-exports @muir/base, @muir/extra, @muir/form|
|`@muir/capacitor/base`|`src/base.ts`|Re-exports @muir/base|
|`@muir/capacitor/basic`|`src/basic.ts`|Re-exports src/base (same as ./base)|
|`@muir/capacitor/extra`|`src/extra.ts`|Re-exports @muir/extra|
|`@muir/capacitor/form`|`src/form.ts`|Re-exports @muir/form|

### @muir/navigation

|Entry|File|Contents|
|---|---|---|
|`@muir/navigation`|`src/index.ts`|Tab system: types, hooks, and UI components|
|`@muir/navigation/model/*`|Subpath|Individual model exports|
|`@muir/navigation/ui/*`|Subpath|Individual UI exports|
|`@muir/navigation/shared/*`|Subpath|Shared utilities|

## Import Rules

### Inside `packages/base/src/` (the core library)

Use **`src/` alias** for cross-slice imports and **relative paths** within the same slice.

```tsx
// ✅ Cross-slice (src/ alias)
import { atr } from 'src/shared/attributify'
import { AnimeScope, useComponentDidUpdate } from 'src/shared'

// ✅ Within-slice (relative)
import type { ButtonProps } from '../model/properties'
import { Animated } from './animation'

// ❌ Forbidden — no @/ aliases
import { atr } from '@/lib/shared/attributify'

// ❌ Forbidden — no package self-imports
import { atr } from '@muir/base/shared/attributify'
```

The `#shared` import alias (`#shared/smart-clsx`) is used **only** by the Babel plugin (`scripts/babel-plugin-auto-clsx.js`) — it resolves via rspack/rslib config, not in TypeScript.

### Inside `packages/extra/src/` and `packages/form/src/`

Use **package name imports** from `@muir/base` for base components.

```tsx
// ✅ Correct
import { Button } from '@muir/base'
import { atr } from '@muir/base'
```

Each package has its own `shared/smart-clsx.ts` copy for the `cx` Babel plugin.

### Inside `packages/capacitor/src/` (the aggregator)

Use **package name imports** from the source packages.

```ts
// src/index.ts
export * from '@muir/base'
export * from '@muir/extra'
export * from '@muir/form'

// src/base.ts
export * from '@muir/base'

// src/extra.ts
export * from '@muir/extra'

// src/form.ts
export * from '@muir/form'
```

`@muir/capacitor` is a thin re-export layer. It **must not contain logic** — only re-exports.

### Inside `packages/navigation/src/` (navigation)

Structure differs from base: `model/` and `ui/` are directly under `src/`, no `components/` wrapper.

```tsx
// ✅ Within package (relative)
import { useTabPath } from '../model/use-tab-path'
import { TabBar } from './tab-bar'
```

### Inside `apps/docs/src/` and `apps/docs/docs/` (the docs app)

Use **`@muir/capacitor`** for component imports, **`@muir/navigation`** for navigation, and **`src/` absolute paths** for app-internal imports.

```tsx
// ✅ From @muir/capacitor
import { Switch, Text } from '@muir/capacitor'
import { Button, Icon } from '@muir/capacitor'

// ✅ From @muir/navigation
import { TabProvider, TabView } from '@muir/navigation'
import { useTabPath } from '@muir/navigation'

// ✅ App-internal absolute paths
import { Navbar } from 'src/widgets/navbar'
import { Pane } from 'src/entities/pane'

// ❌ Never use @/ aliases
import { Navbar } from '@/widgets/navbar'
```

In `.mdx` documentation files, live demo imports use `@muir/capacitor`, while usage code blocks show the actual source package (`@muir/base`, `@muir/extra`, `@muir/form`).

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

- `@muir/base` builds first (no workspace dependencies)
- `@muir/extra` builds after `@muir/base`
- `@muir/form` builds after `@muir/base` and `@muir/extra`
- `@muir/capacitor` builds after all three
- `@muir/navigation` builds independently (parallel with base)
- `muir-docs` builds after `@muir/capacitor` and `@muir/navigation`
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

## Output Directory

All packages output to `dist/`:

|Package|Builder|Output|
|---|---|---|
|`@muir/base`|rslib|`packages/base/dist/`|
|`@muir/extra`|rslib|`packages/extra/dist/`|
|`@muir/form`|rslib|`packages/form/dist/`|
|`@muir/capacitor`|rslib|`packages/capacitor/dist/`|
|`@muir/navigation`|rslib|`packages/navigation/dist/`|
|`muir-docs`|rsbuild|`apps/docs/dist/`|