---
description: Repository directory structure, FSD layer hierarchy, and naming conventions for all packages and the docs app
globs:
  - "packages/base/src/**"
  - "packages/extra/src/**"
  - "packages/form/src/**"
  - "packages/capacitor/src/**"
  - "packages/navigation/src/**"
  - "apps/docs/src/**"
  - "apps/docs/docs/**"
---

# File System — Monorepo Architecture

This is a **Turborepo + Bun workspaces** monorepo containing scoped UI library packages, a Capacitor aggregator, a navigation package, and a documentation/landing app.

## Repository Structure

```
muir/                           ← root workspace (name: "muir", private)
├── packages/
│   ├── base/                   ← Core UI library (name: "@muir/base")
│   │   ├── src/
│   │   │   ├── app/            ← Theme providers, global config
│   │   │   ├── components/     ← UI components (FSD slices)
│   │   │   └── shared/         ← Shared utilities (cx, atr, AnimeScope, etc.)
│   │   ├── rslib.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json        ← exports: ".", basic (alias for base)
│   │
│   ├── extra/                 ← Extra components (name: "@muir/extra")
│   │   ├── src/
│   │   │   ├── components/     ← snackbar, toggle-button, code
│   │   │   ├── shared/         ← smart-clsx.ts copy
│   │   │   ├── extra.ts
│   │   │   └── index.ts
│   │   ├── rslib.config.ts
│   │   └── package.json        ← depends on @muir/base
│   │
│   ├── form/                  ← Form wrappers (name: "@muir/form")
│   │   ├── src/
│   │   │   ├── components/form/ ← Form + FormXxx wrappers
│   │   │   ├── shared/         ← smart-clsx.ts copy
│   │   │   ├── form.ts
│   │   │   └── index.ts
│   │   ├── rslib.config.ts
│   │   └── package.json        ← depends on @muir/base, @muir/extra
│   │
│   ├── capacitor/             ← Aggregator (name: "@muir/capacitor")
│   │   ├── src/
│   │   │   ├── index.ts        ← Re-exports @muir/base, @muir/extra, @muir/form
│   │   │   ├── base.ts         ← Re-exports @muir/base
│   │   │   ├── basic.ts        ← Re-exports src/base (same as ./base)
│   │   │   ├── extra.ts        ← Re-exports @muir/extra
│   │   │   └── form.ts         ← Re-exports @muir/form
│   │   ├── rslib.config.ts
│   │   └── package.json        ← depends on @muir/base, @muir/extra, @muir/form
│   │
│   └── navigation/            ← Tab navigation (name: "@muir/navigation")
│       ├── src/
│       │   ├── model/          ← Types, hooks (directly at src/, no components/ wrapper)
│       │   ├── ui/             ← Tab UI components (directly at src/)
│       │   ├── shared/         ← smart-clsx.ts copy
│       │   └── index.ts
│       ├── rslib.config.ts
│       └── package.json        ← depends on wouter, keepalive-for-react
│
├── apps/
│   └── docs/                   ← Landing page & component docs (name: "muir-docs")
│       ├── src/                ← App source (FSD: app/pages/widgets/features/entities/shared)
│       ├── docs/               ← MDX documentation files
│       ├── rsbuild.config.ts   ← Aliases: src/, docs/, #shared
│       ├── capacitor.config.ts
│       └── package.json
│
├── scripts/
│   ├── babel-plugin-auto-clsx.js
│   └── babel-plugin-auto-animated.js
│
├── turbo.json                  ← Turborepo task pipeline
├── biome.json                  ← Shared lint/format config (2.3.14)
├── tsconfig.base.json          ← Shared TS config
├── .changeset/config.json      ← Changesets config (ignores muir-docs)
└── package.json                ← Root workspace manifest (name: "muir", private)
```

## Naming Rules

Use **kebab-case** wherever possible.

```
add-to-cart/
product-card.tsx
add-to-cart.tsx
```

---

# `@muir/base` (`packages/base/src/`) Rules

Self-contained core UI library with no app-specific code.

## Groups

| Entry | File | Contents |
|---|---|---|
| `@muir/base` | `src/index.ts` | Full package: app/theme-provider, all components, shared utilities |
| `@muir/base/basic` | `src/basic.ts` | Alias — re-exports `src/base.ts` (all base components) |

## Hierarchy

```
app          ← Theme providers, global config
components   ← UI component slices
shared       ← Utilities with no business meaning
```

## Component Slice Structure

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

## Shared

```
shared/
  smart-clsx.ts           ← cx factory
  attributify.ts           ← atr function
  anime-scope.ts          ← AnimeScope wrapper
  component-lifecycle.ts  ← useComponentDidUpdate
  animated-types.ts       ← AnimeScopeInit type
  index.ts                ← Barrel re-export
```

## Import Conventions

Inside `packages/base/src/`, use **`src/` alias** for cross-slice and **relative paths** within the same slice:

```tsx
// ✅ Cross-slice (src/ alias)
import { atr } from 'src/shared/attributify'
import { AnimeScope } from 'src/shared'

// ✅ Within-slice (relative)
import type { ButtonProps } from '../model/properties'
import { Animated } from './animation'

// ❌ Forbidden — no @/ aliases
import { atr } from '@/lib/shared/attributify'

// ❌ Forbidden — no package self-imports
import { atr } from '@muir/base/shared/attributify'
```

---

# `@muir/extra` (`packages/extra/src/`) Rules

Extra components extending the base library.

```
components/
  snackbar/
  toggle-button/
  code/
```

Uses **`@muir/base`** package imports for base components and utilities.

---

# `@muir/form` (`packages/form/src/`) Rules

Form wrappers using react-hook-form.

```
components/
  form/
    model/properties.ts
    ui/
      form.tsx
      switch.tsx          ← FormSwitch
      checkbox.tsx        ← FormCheckbox
      toggle-button.tsx   ← FormToggleButton
      text-input.tsx      ← FormTextInput
      slider.tsx           ← FormSlider
      radio-button.tsx    ← FormRadioButton
      ...
```

Depends on `@muir/base` and `@muir/extra`.

---

# `@muir/capacitor` (`packages/capacitor/src/`) Rules

Thin re-export aggregator. Each file re-exports from the source packages.

```ts
// src/index.ts
export * from '@muir/base'
export * from '@muir/extra'
export * from '@muir/form'

// src/base.ts
export * from '@muir/base'

// src/basic.ts (same as ./base)
export * from './base'

// src/extra.ts
export * from '@muir/extra'

// src/form.ts
export * from '@muir/form'
```

The capacitor package **must not contain logic** — only re-exports.

---

# `@muir/navigation` (`packages/navigation/src/`) Rules

Tab navigation system. Different structure — `model/` and `ui/` are directly at `src/` root, no `components/` wrapper.

```
src/
  model/
    types.ts
    resolve-active-tab.ts
    use-tab-memory.ts
    use-tab-navigation.ts
    use-tab-path.ts
    use-scroll-restore.ts
    use-tab-item-href.ts
    use-keep-alive-context.ts
  ui/
    tab-bar.tsx
    tab-item.tsx
    tab-provider.tsx
    tab-view.tsx
    style.module.css
  shared/
    smart-clsx.ts
  index.ts
```

Depends on `wouter` and `keepalive-for-react` (no workspace dependencies).

---

# `muir-docs` (`apps/docs/src/`) Rules

The landing page and documentation app. Uses Feature-Sliced Design.

## Import Conventions (Docs App)

```tsx
// ✅ From @muir/capacitor (for all re-exported components)
import { Switch, Text } from '@muir/capacitor'
import { Button, Icon } from '@muir/capacitor'
import { Code, CodeStyleProvider } from '@muir/capacitor'

// ✅ From @muir/navigation
import { TabProvider, TabView } from '@muir/navigation'
import { useTabPath } from '@muir/navigation'

// ✅ Absolute paths within the docs app
import { Navbar } from 'src/widgets/navbar'
import { Pane } from 'src/entities/pane'
import { DocsMDXProvider } from 'src/features/mdx-renderer'

// ❌ Forbidden — no @/ aliases
import { Navbar } from '@/widgets/navbar'
```

## FSD Layer Hierarchy

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
| `app` | Global config, providers, router, styles | `app/index.tsx`, `app/theme.json` |
| `pages` | Route-level screens | `pages/docs/ui/page.tsx` |
| `widgets` | Large UI blocks composed from features/entities | `widgets/navbar/`, `widgets/sidebar/` |
| `features` | User actions/business capabilities | `features/mdx-renderer/` |
| `entities` | Business domain models | `entities/pane/`, `entities/docs/`, `entities/code-block/` |
| `shared` | Reusable utilities, no business meaning | `shared/ui/theme-icon/`, `shared/lib/` |

### Composition

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

See `rule://documentation-components` for full rules.