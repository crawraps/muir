---
description: cx (smart-clsx) for CSS Module class resolution and atr (attributify) for custom attribute state management — usage patterns, behavior tables, and division of labor
globs:
  - "packages/base/src/**/*.tsx"
  - "packages/base/src/**/*.css"
  - "packages/extra/src/**/*.tsx"
  - "packages/form/src/**/*.tsx"
  - "packages/navigation/src/**/*.tsx"
---

## `cx` — Smart-clsx for CSS Modules

**Source**: `packages/base/src/shared/smart-clsx.ts`

Wraps `clsx` with CSS Modules support. The first argument resolves through the CSS Modules map; all subsequent arguments pass through to `clsx` as global class names.

### Factory Function

```ts
import clsx, { type ClassValue } from 'clsx'

export function createSmartClsx(styles: CSSModuleClasses) {
  function resolveComplexClassValue(value: ClassValue): ClassValue {
    if (Array.isArray(value)) return value.map(resolveComplexClassValue)
    if (typeof value === 'object' && value !== null)
      return Object.entries(value).reduce(
        (prev, [key, val]) => ({ ...prev, [styles[key]]: val }),
        {}
      )
    return value && styles[value?.toString()]
  }

  return (moduleClassNames: ClassValue, ...args: ClassValue[]): string => {
    return clsx(resolveComplexClassValue(moduleClassNames), args)
  }
}
```

### How It Works

1. `createSmartClsx(styles)` takes a CSS Modules classes object and returns a bound `cx` function.
2. The **first argument** to `cx(...)` is resolved against CSS Modules: string keys are looked up in the `styles` map; arrays/objects are recursively resolved.
3. **All subsequent arguments** (`...args`) are passed directly to `clsx` as global/unresolved class names.
4. Output: a space-separated string of resolved CSS class names.

### Auto-Import

The Babel plugin at `scripts/babel-plugin-auto-clsx.js` automatically injects `cx` in every `.tsx` file that uses it.

It detects if `cx` is referenced but not locally bound, then injects:

```js
import _auto_style from './style.module.css'
import { createSmartClsx as _createSmartClsx } from '#shared/smart-clsx'
const cx = _createSmartClsx(_auto_style)
```

- The `#shared` import alias resolves to `packages/base/src/shared/` (via rspack/rslib alias in `rslib.config.ts`)
- `cx` is declared globally in `env.d.ts` — no TypeScript complaints.
- If a file already has a local `cx` binding, the plugin skips injection.
- The plugin **always** expects `./style.module.css` (or `./public.module.css`) to exist alongside the `.tsx` file.

### Behavior Details

| Input | Result |
|---|---|
| `cx('nonexistent')` | `styles['nonexistent']` is `undefined` — silently dropped |
| `cx(null)` / `cx(undefined)` | Handled by `clsx` — skipped in output |
| `cx({ active: true })` | Resolves `active` through CSS Modules first |
| `cx(['root', { active: true }])` | Resolves each element recursively |

### Usage Patterns

```tsx
// Single modular class + consumer passthrough
<span className={cx('root', className)} />

// Multiple modular classes
<span className={cx('root track')}>

// Conditional modular classes (object)
<span className={cx({ active: isActive, error: hasError })}>

// Array form
<span className={cx(['root', { active: isActive }])}>

// Mixed: modular first arg + global class
<span className={cx('root', 'some-global-class', className)>
```

### Rules

- NEVER use string interpolation for classes: `` `root ${className}` ``
- NEVER use `cx` with conditional objects for boolean state — use `atr` + CSS attribute selectors instead
- Always let the Babel plugin handle `cx` auto-import
- First argument = CSS Module keys; remaining arguments = global class names

---

## `atr` — Attributify for JSX Custom Attributes

**Source**: `packages/base/src/shared/attributify.ts`

Converts primitive values to valid JSX custom attribute values, enabling CSS attribute selectors for component state.

```ts
export function attributify(
  value: string | number | boolean | null | undefined
): string | undefined {
  if (typeof value === 'boolean') return value ? '' : undefined
  if (value === null || value === undefined) return undefined
  return value.toString()
}

export const atr = attributify
```

### How It Works

| Input Type | Output | JSX Behavior |
|---|---|---|
| `true` | `""` | Attribute rendered with empty value: `<span is-disabled="">` |
| `false` | `undefined` | Attribute omitted entirely |
| `null` / `undefined` | `undefined` | Attribute omitted entirely |
| `string` | `value.toString()` | Passthrough |
| `number` | `value.toString()` | e.g. `atr(42)` → `"42"` |
| `""` (empty string) | `""` | Attribute rendered (differs from `atr(false)`) |

The key insight: `atr(true)` produces `""`, which JSX renders as `<span is-disabled="">`. CSS `[is-disabled]` matches this. `atr(false)` produces `undefined`, so the attribute is omitted entirely and the selector won't match.

### Import

Inside the @muir/base library:

```tsx
import { atr } from 'src/shared/attributify'
// or from the shared barrel export:
import { atr } from 'src/shared'
```

`atr` is **not** auto-imported by the Babel plugin. Import it manually.

In the docs app:

```tsx
import { atr } from '@muir/capacitor'
```

### Usage Patterns

```tsx
// Boolean state -> custom boolean attribute
<span is-disabled={atr(props.disabled)} is-error={atr(hasError)}>

// Data attributes with string/number values
<span data-variant={atr(variant)} data-count={atr(count)}>

// Combined with cx for structure (not state)
<span className={cx('root', className)} is-disabled={atr(props.disabled)}>
```

### CSS Integration — Attribute Selectors

```css
/* Boolean attribute presence selector */
.root {
  &[is-disabled] { opacity: 0.5; pointer-events: none; }
  &[is-error] { border-color: var(--error-color); }
}

/* Attribute with value */
.root[data-variant="primary"] { background: var(--md-sys-color-primary); }
```

### Rules

- Use `is-*` prefix for boolean state attributes
- Use `data-*` prefix for data/variant attributes
- ALWAYS use `atr` for boolean state instead of conditional `cx` class objects
- Match custom attributes in CSS with `[is-*]` attribute selectors
- Inside the library, import `atr` from `src/` aliases (`src/shared/attributify` or `src/shared`)
- In docs, import from `@muir/capacitor`

---

## Division of Labor: `cx` vs `atr`

| Concern | Tool | Mechanism |
|---|---|---|
| Structural classes (layout, spacing, typography) | `cx` | CSS Module keys → hashed selectors |
| Boolean state (disabled, error, active, checked) | `atr` | `is-*` attributes → CSS `[is-*]` selectors |
| Consumer class passthrough | `cx` | 2nd+ args = global classes |
| Native input state | CSS-only | `.input:checked + .track` sibling combinators |
| Variant/string values | `atr` | `data-variant={atr(variant)}` → `[data-variant="primary"]` |

**Key rule**: Never use `cx` conditional objects for boolean state. Always use `atr` with attribute selectors.

```tsx
// Correct — atr for state, cx for structure
<span
  className={cx('root', className)}
  is-disabled={atr(props.disabled)}
  is-error={atr(hasError)}
>

// Wrong — using cx for boolean state
<span className={cx(['root', { disabled: props.disabled, error: hasError }])}>
```