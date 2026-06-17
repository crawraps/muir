# Component Rules

Common rules and patterns derived from the Switch, Checkbox, and Button components.

---

## 1. FSD Segment Structure

Every component follows the segment structure `model/types.ts` + `ui/` + `index.ts`.

| Segment | Purpose | Content |
|---|---|---|
| `model/types.ts` | Business logic layer | Strict TypeScript interfaces only |
| `ui/*.tsx` | UI layer | Component renderers, animation wrappers |
| `ui/style.module.css` | Styling | CSS Modules with customization variables |
| `index.ts` | Public API | Re-exports types and default component |

**Never** deep-import from `ui/` or `model/` — always go through `index.ts`.

---

## 2. Function Declarations for Components

Always use `function` declarations, never arrow functions or `const`.

```tsx
// ✅ Correct
function Switch({ error, className, ref, ...props }: SwitchProps) { ... }
export default Switch

// ❌ Forbidden
const Switch = ({ error, ...props }: SwitchProps) => { ... }
```

---

## 3. Minimal Destructuring, Spread-Through Props

Destructure only what the component body needs; pass the rest through with `...props`.

```tsx
// ✅ Correct
function Switch({ error, className, ref, ...props }: SwitchProps) {
  const hasError = error !== undefined && error !== null && error !== false
  return <input {...props} aria-invalid={hasError || undefined} ... />
}

// ❌ Forbidden
function Switch({ checked, disabled, onChange, error, className, ref, name, id, ...rest }) { ... }
```

---

## 4. Custom Boolean Attributes via `attributify`

Use `attributify` (aliased as `atr`) for boolean state attributes instead of CSS class toggles.

```tsx
// ✅ Correct
<span is-disabled={atr(props.disabled)} is-error={atr(hasError)}>

// ❌ Forbidden
<span className={cx(['root', { disabled: props.disabled, error: hasError }])}>
```

The `is-*` custom attributes are matched in CSS with `[is-disabled]`, `[is-error]` attribute selectors — no additional CSS classes needed.

---

## 5. CSS Modules Customization Layer

Define CSS variables on the **component root** (`.root`) for all plain values. Users can override these variables without editing internal CSS.

```css
.root {
  /* Sizing */
  --track-height: 1.75em;
  --thumb-size: calc(var(--track-height) * 0.675);

  /* Colors — reference theme variables */
  --track-color: var(--md-sys-color-surface-container-high);
  --checked-track-color: var(--md-sys-color-primary);
  --error-color: var(--md-sys-color-error);

  /* MD3 tokens */
  --track-border-radius: var(--md-sys-shape-corner-full);
  --transition-duration: var(--md-sys-motion-expressive-default-effects-duration);
}
```

Sub-classes reference their parent's variables — never redefine theme tokens deeper in the tree.

---

## 6. Visually Hidden Native Input Pattern

Accessible components (toggles, checkboxes, switches) wrap a **visually hidden** native `<input>` for semantics and accessibility, paired with a visible styled element.

```css
.input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
```

The CSS sibling combinator (`.input:checked + .track`) provides styling hooks for checked/focused states.

---

## 7. Props Interface Pattern

Extend the native HTML element's props with `Omit` to restrict/override, then add custom props.

```ts
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  ref?: React.Ref<HTMLInputElement>       // Explicit ref
  error?: React.ReactNode                  // Custom prop
  showIcon?: boolean                       // Custom prop with JSDoc default
}
```

Conventions:
- `Omit<..., 'type' | 'children'>` to prevent misuse of the `type` attribute
- `ref` as an explicit named prop (React 19 pattern)
- JSDoc with `@docs` tag for Storybook documentation
- `@default` annotation in JSDoc for default values

---

## 8. Animation Isolation via `AnimeScope`

Complex animations are isolated in a separate `animation.tsx` file using the `AnimeScope` wrapper from `@/lib/shared`.

```tsx
// animation.tsx
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

Dual-mode animation:
- **Controlled** (`checked` is defined): `useComponentDidUpdate` triggers animation on prop change
- **Uncontrolled** (`checked` is `undefined`): direct DOM `change` event listener

---

## 9. CSS State via Sibling Combinator

Use `.input:checked + .track` and `.input:focus-visible + .track` selectors to style based on native input state.

```css
.input:checked + .track { /* checked styles */ }
.input:focus-visible + .track { /* focus ring */ }
```

This couples visual state to the underlying input's state, ensuring CSS-only transitions work even before JavaScript animations kick in.

---

## 10. Error State Pattern

Error state is computed from the `error` prop using a truthiness check, then applied via `is-error` custom attribute.

```tsx
const hasError = error !== undefined && error !== null && error !== false
<span is-error={atr(hasError)}>
```

```css
.root {
  &[is-error] {
    --track-border-color: var(--error-color);
    --checked-track-color: var(--error-color);
  }
}
```

The `aria-invalid` attribute is set conditionally:

```tsx
<input aria-invalid={hasError || undefined} />
```

---

## 11. Component Composition Pattern

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

## 12. Import Conventions

Absolute paths for cross-slice imports, relative paths within the same component.

```tsx
// ✅ Cross-slice (absolute)
import { atr } from '@/lib/shared/attributify'
import { AnimeScope, useComponentDidUpdate } from '@/lib/shared'

// ✅ Within-slice (relative)
import type { SwitchProps } from '../model/types'
import { Animated } from './animation'

// ❌ Forbidden
import { atr } from '@/lib/shared/attributify'
```

---

## 13. Public API Export Pattern

`index.ts` exports types as named exports and the component as a default re-export.

```ts
export type { SwitchProps } from './model/types'
export { default as Switch } from './ui/switch'
```

Consumers import from the component's public API:

```ts
import { Switch, type SwitchProps } from '@/lib/components/switch'
// or from the library top-level:
import { Switch } from '@/lib'
```

---

## 14. `cx` Auto-Import (smart-clsx)

The `cx` function is auto-imported in every `.tsx` file. It maps class name strings to CSS Module lookups — never use string concatenation or array-based conditional classes for boolean state.

```tsx
// ✅ Correct — cx maps to CSS Modules
<span className={cx('root', className)}>

// ❌ Forbidden
<span className={`root ${className}`}>
<span className={cx(['root', { active: isActive }])}>  {/* use attributify instead */}
```

---

## 15. Theme Token Usage in CSS

All design tokens reference Material Design 3 theme variables (`--md-sys-*` and `--md-ref-*`).

| Token Type | Prefix | Example |
|---|---|---|
| Color | `--md-sys-color-` | `--md-sys-color-primary` |
| Shape | `--md-sys-shape-` | `--md-sys-shape-corner-full` |
| Motion | `--md-sys-motion-` | `--md-sys-motion-expressive-default-effects-duration` |
| Typescale | `--md-sys-typescale-` | `--md-sys-typescale-body-small-size` |
| Typeface | `--md-ref-typeface-` | `--md-ref-typeface-plain` |

Custom component variables (`--track-height`, `--thumb-size`) are defined as **calc** expressions derived from theme tokens, enabling user customization.

---

## 16. Ref Forwarding (React 19 Pattern)

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