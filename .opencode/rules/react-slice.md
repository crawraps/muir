# React Slice

## FSD Segment Structure

Every component follows the segment structure `model/types.ts` + `ui/` + `index.ts`.

| Segment | Purpose | Content |
|---|---|---|
| `model/` | Data model | Schemas, interfaces, stores, and business logic. |
| `ui/` | Visual segment | UI components, date formatters, styles, etc. |
| `api/` | Backend interactions | Request functions, data types, mappers, etc. |
| `lib/` | Library code | Library code that other modules on this slice need. |
| `index.ts` | Public API | Re-exports types and default component |

**Never** deep-import from a subfolder of a layer — always go through `index.ts`.

### Typical files

- `model/properties.ts` - React nodes properties
- `model/types.ts` - React nodes types
- `ui/public.module.css` - Public API for component styling; usually auto-imported
- `ui/style.module.css` - Modular stylesheet; usually auto-imported
- `ui/animation.tsx` - Animation wrapper; usually auto-imported

### Naming conventions

Separate code into files based on its purpose as a business logic domain.

---

## Function Declarations for Components

Always use `function` declarations, never arrow functions or `const`.

```tsx
// ✅ Correct
function Switch({ error, className, ref, ...props }: SwitchProps) { ... }
export default Switch

// ❌ Forbidden
const Switch = ({ error, ...props }: SwitchProps) => { ... }
```

---

## Minimal Destructuring, Spread-Through Props

Destructure only most significant props; pass the rest through with `...props`.

```tsx
// ✅ Correct
function Switch({ error, ...props }: SwitchProps) {
  const hasError = error !== undefined && error !== null && error !== false
  return <input {...props} aria-invalid={hasError || undefined} ... />
}

// ❌ Forbidden
function Switch({ checked, disabled, onChange, error, className, ref, name, id, ...rest }) { ... }
```

---

## Custom attributes instead of classes

Use `attributify` (aliased as `atr`) for attributes instead of CSS class toggles.

```tsx
// ✅ Correct
<span is-disabled={atr(props.disabled)} data-error={atr(errorMessage)}>

// ❌ Forbidden
<span className={cx(['root', { disabled: props.disabled, error: errorMessage }])}>
```

The custom attributes are matched in CSS with `[is-disabled]`, `[data-error="..."]` attribute selectors — no additional CSS classes needed.

Read more about `attributify` usage in .opencode/rules/tools.md

## CSS Modules Customization Layer

Define CSS variables in `ui/public.css` file on the component root element (e.g. `.root`) for all plain values. Users can override these variables without editing internal CSS.

```css
.root {
  /* Sizing */
  --track-height: 1.75em;
  --thumb-size: calc(var(--track-height) * 0.675);
  --track-border-radius: var(--md-sys-shape-corner-full);

  /* Colors — reference theme variables */
  --track-color: var(--md-sys-color-surface-container-high);
  --checked-track-color: var(--md-sys-color-primary);
  --error-color: var(--md-sys-color-error);

  /* Animations */
  --transition-easing: var(--md-sys-motion-expressive-default-effects-curve);
  --transition-duration: var(--md-sys-motion-expressive-default-effects-duration);
}
```

```tsx
import styling from './public.module.css'

export default function Component({ children }) {
  return <div className={cx('root', styling.root)} >{children}</div>
}
```

Sub-classes reference their parent's variables — never redefine theme tokens deeper in the tree.

---

## Public API Export Pattern

`index.ts` defines public API and re-exports different parts of the slice. Some typical re-exports are:
  - `./model/props.ts`
  - `./ui/component-name.tsx`

```ts
export type { SwitchProps } from './model/properties'
export { default as Switch } from './ui/switch'
```

Consumers import from the component's public API:

```ts
// Within muir library — relative imports
import { Switch, type SwitchProps } from './components/switch'
// or from the higher-level barrel exports:
import { Switch } from './basic'

// In muir-capacitor — package name imports
export * from 'muir/basic'

// In docs app — muir-capacitor package imports
import { Switch } from 'muir-capacitor/basic'
```

---

## Props Interface Pattern

Only if extending some native HTML element, extend it props with `Omit` to restrict/override, then add custom props.

```ts
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  ref?: React.Ref<HTMLInputElement>       // Explicit ref
  error?: React.ReactNode                  // Custom prop
  /**
  * Component documentation
  */
  showIcon?: boolean                       // Custom prop with JSDoc default
}
```

Conventions:
- `Omit<..., 'type' | 'children'>` to prevent misuse of the `type` attribute
- `ref` as an explicit named prop (React 19 pattern)
- JSDoc with `@docs` tag for Storybook documentation
- `@default` annotation in JSDoc for default values

---

## Animation Isolation via `AnimeScope`

Complex animations are isolated in a separate `animation.tsx` file using the `AnimeScope` wrapper from the shared layer.

```tsx
// animation.tsx example
const init: AnimeScopeInit = (scope, theme) => {
  // 1. Query DOM elements via scope.root.querySelector
  // 2. Define spring/easing from theme
  // 3. Register named methods with scope.add('methodName', ...)
  // 4. Optionally add event listeners
}

export function Animated({ checked, children }) {
  const ref = useRef<Scope>(null)

  // Controlled mode: respond to prop changes
  useComponentDidUpdate(() => {
    if (checked === true) ref.current?.methods.check(showIcon)
    else if (checked === false) ref.current?.methods.uncheck(showIcon)
  }, [checked])

  // Uncontrolled mode: use DOM listeners
  useEffect(() => {
    if (checked !== undefined) return  // Only for uncontrolled
    ref.current?.methods.listen()
    return () => ref.current?.methods.stopListen()
  }, [])

  return <AnimeScope init={init} ref={ref}>{children}</AnimeScope>
}
```

In this example dual-mode animation is used:
- **Controlled** (`checked` is defined): `useComponentDidUpdate` triggers animation on prop change
- **Uncontrolled** (`checked` is `undefined`): direct DOM `change` event listener

---

## Component Composition Pattern

The animation wrapper (`Animated`) renders children (the visual element) via composition, not by building the DOM itself.

```tsx
<Animated checked={props.checked} showIcon={props.showIcon ?? false}>
  <span className={cx('root', className)} ...>
    {/* visual markup */}
  </span>
</Animated>
```

This keeps animation logic separate from visual structure and makes both testable in isolation.

---

## Import Conventions

### Inside `packages/muir/src/` (the library)

Use **relative paths**. No aliases.

```tsx
// ✅ Cross-slice (relative)
import { atr } from '../../shared/attributify'
import { AnimeScope, useComponentDidUpdate } from '../../shared'

// ✅ Within-slice (relative)
import type { SwitchProps } from '../model/types'
import { Animated } from './animation'

// ❌ Forbidden — no aliases
import { atr } from '@/lib/shared/attributify'

// ❌ Forbidden — no package self-imports inside the library
import { atr } from 'muir/shared'
```

### Inside `packages/muir-capacitor/src/` (the wrapper)

Use **package name imports** from `muir`.

```tsx
// ✅ Correct
export * from 'muir'
export * from 'muir/basic'
export * from 'muir/form'
export * from 'muir/extra'
```

### Inside `apps/docs/src/` (the docs app)

Use **`muir-capacitor` package imports**.

```tsx
// ✅ Correct
import { Switch } from 'muir-capacitor/basic'
import { Form, FormCheckbox } from 'muir-capacitor/form'

// ❌ Forbidden — never import from muir directly in docs
import { Switch } from 'muir/basic'

// ❌ Forbidden — no @/ aliases
import { NavBar } from '@/widgets/navbar'
```

For app-internal imports, use **`src/` absolute paths**:

```tsx
// ✅ Correct
import { NavBar } from 'src/widgets/navbar'

// ❌ Forbidden
import { NavBar } from '@/widgets/navbar'
```

---

## Theme Token Usage in CSS

All design tokens reference Material Design 3 theme variables (`--md-sys-*` and `--md-ref-*`).

| Token Type | Prefix | Example |
|---|---|---|
| Color | `--md-sys-color-` | `--md-sys-color-primary` |
| Shape | `--md-sys-shape-` | `--md-sys-shape-corner-full` |
| Motion | `--md-sys-motion-` | `--md-sys-motion-expressive-default-effects-duration` |
| Typescale | `--md-sys-typescale-` | `--md-sys-typescale-body-small-size` |
| Typeface | `--md-ref-typeface-` | `--md-ref-typeface-plain` |


---

## Ref Forwarding (React 19 Pattern)

The `ref` prop is declared explicitly in the interface (React 19 style, no `forwardRef`):

```ts
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  ref?: React.Ref<HTMLInputElement>
}
```

And destructured directly in the component signature:

```tsx
function Switch({ error, className, ref, ...props }: SwitchProps) {
  return <input ... ref={ref} type='checkbox' />
}
```