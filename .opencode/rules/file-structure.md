# File System — Monorepo Architecture

This is a **Turborepo + Bun workspaces** monorepo containing a UI library, a Capacitor wrapper, and a documentation/landing app.

## Repository Structure

```
muir/                           ← root workspace (name: "muir")
├── packages/
│   ├── muir/                   ← Core UI library (name: "muir")
│   │   ├── src/
│   │   │   ├── app/            ← Theme providers, global config
│   │   │   ├── components/     ← UI components (FSD slices)
│   │   │   └── shared/         ← Shared utilities (cx, atr, AnimeScope, etc.)
│   │   ├── rslib.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json        ← exports: ".", "./basic", "./form", "./extra"
│   │
│   └── muir-capacitor/         ← Capacitor wrapper (name: "muir-capacitor")
│       ├── src/
│       │   ├── index.ts        ← Re-exports muir (full)
│       │   ├── basic.ts        ← Re-exports muir/basic
│       │   ├── form.ts         ← Re-exports muir/form
│       │   └── extra.ts        ← Re-exports muir/extra
│       ├── rslib.config.ts
│       ├── tsconfig.json
│       └── package.json        ← same export map as muir
│
├── apps/
│   └── docs/                   ← Landing page & component docs (name: "muir-docs")
│       ├── src/                ← App source (FSD: app/pages/widgets/features/entities/shared)
│       ├── docs/               ← MDX documentation files
│       ├── stories/            ← Storybook stories
│       ├── .storybook/
│       ├── rsbuild.config.ts
│       ├── capacitor.config.ts
│       └── package.json
│
├── scripts/
│   ├── babel-plugin-auto-clsx.js
│   └── babel-plugin-auto-animated.js
│
├── turbo.json                  ← Turborepo task pipeline
├── biome.json                  ← Shared lint/format config
├── tsconfig.base.json          ← Shared TS config
├── .changeset/config.json      ← Changesets config (ignores muir-docs)
└── package.json                ← Root workspace manifest
```

## Naming Rules

Use **kebab-case** wherever possible.

```
add-to-cart/
product-card.tsx
add-to-cart.tsx
```

---

# Library (`packages/muir/src/`) Rules

This directory is self-contained — the core UI library with no app-specific code.

## Groups

The library exports several entry points:

| Entry | File | Contents |
|---|---|---|
| `muir` | `src/index.ts` | Full library (all components, shared, app) |
| `muir/basic` | `src/basic.ts` | Basic UI components only |
| `muir/form` | `src/form.ts` | Form wrappers (react-hook-form) |
| `muir/extra` | `src/extra.ts` | Extra components extending basics |

## Hierarchy

```
app          ← Theme providers, global config
components   ← UI component slices
shared       ← Utilities with no business meaning
```

## Layers

### `app`

Global configuration: theme providers, style initialization.

### `components`

Component slices, each self-contained:

```
components/
  button/
    index.ts           ← Public API re-export
    model/
      properties.ts    ← Props interface
    ui/
      button.tsx        ← Component renderer
      animation.tsx     ← AnimeScope wrapper
      public.module.css ← Customization layer
      style.module.css  ← Internal styles
```

### `shared`

Reusable code with **no business meaning**. Never depends on other layers.

```
shared/
  smart-clsx.ts
  attributify.ts
  anime-scope.ts
  ...
```

## Import Conventions (Library Internal)

Inside `packages/muir/src/`, use **relative paths**:

```tsx
// ✅ Within-slice (relative)
import type { ButtonProps } from '../model/properties'
import { Animated } from './animation'

// ✅ Cross-slice within library (relative from src/)
import { atr } from '../../shared/attributify'
import { AnimeScope, useComponentDidUpdate } from '../../shared'

// ❌ Forbidden — no aliases
import { atr } from '@/lib/shared/attributify'

// ❌ Forbidden — no package-name self-imports
import { atr } from 'muir/shared/attributify'
```

---

# Capacitor Wrapper (`packages/muir-capacitor/src/`) Rules

Thin re-export layer. Each file re-exports from the `muir` package by sub-path.

```ts
// src/index.ts
export * from 'muir'
// src/basic.ts
export * from 'muir/basic'
// src/form.ts
export * from 'muir/form'
// src/extra.ts
export * from 'muir/extra'
```

The Capacitor wrapper **must not contain logic** — only re-exports. This ensures the native app gets the same API as the web library.

---

# Docs App (`apps/docs/src/`) Rules

The landing page and documentation app. Uses Feature-Sliced Design.

## Import Conventions (Docs App)

```tsx
// ✅ From the Capacitor package (published API)
import { Switch } from 'muir-capacitor/basic'
import { Form, FormCheckbox } from 'muir-capacitor/form'
import { SnackbarProvider } from 'muir-capacitor/extra'
import { createSmartClsx } from 'muir-capacitor'

// ✅ Absolute paths within the docs app
import { NavBar } from 'src/widgets/navbar'

// ✅ MDX docs imports
import { Button } from 'muir-capacitor/basic'

// ❌ Forbidden — never import from muir directly in docs
import { Button } from 'muir/basic'

// ❌ Forbidden — no @/ aliases
import { NavBar } from '@/widgets/navbar'
```

## Follow the Layer Hierarchy Strictly

```
app
pages
widgets
features
entities
shared
```

### Dependency Rule

Higher layers may depend only on **lower layers**.

Forbidden:
* Importing from a **higher layer**
* Importing between unrelated slices in the same layer

### Layer Descriptions

| Layer | Purpose | Example |
|---|---|---|
| `app` | Global config, providers, router, styles | `app/providers/`, `app/index.tsx` |
| `pages` | Route-level screens | `pages/docs/ui/page.tsx` |
| `widgets` | Large UI blocks composed from features/entities | `widgets/navbar/`, `widgets/sidebar/` |
| `features` | User actions/business capabilities | `features/mdx-renderer/` |
| `entities` | Business domain models | `entities/pane/`, `entities/code-block/` |
| `shared` | Reusable utilities, no business meaning | `shared/ui/theme-icon/` |

### Reusability Rule

Before creating new code:
1. Check `shared`
2. Check `entities`
3. Then create new `feature`

### Composition

Pages compose widgets, widgets compose features, features compose entities:

```
Page
  └ Widget
      └ Feature
          └ Entity
              └ Shared UI
```

---

# MDX Documentation (`apps/docs/docs/`) Rules

Component docs live in `docs/components/<component-name>.mdx`.
Utility docs live in `docs/utilities/<utility-name>.mdx`.

See `.opencode/rules/documentation-components.md` for full rules.