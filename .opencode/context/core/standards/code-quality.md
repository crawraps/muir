<!-- Context: standards/code | Priority: critical | Version: 2.0-cuil | Updated: 2026-04-27 -->

# Code Quality Standards

## Quick Reference

**Core Philosophy**: Modularity, Type Safety, Explicitness  
**Golden Rule**: If you can't easily test it, refactor it  
**Tech Stack**: React 19 + TypeScript 5.9 (strict), Bun, FSD architecture, Biome  

**Critical Patterns** (use these):
- TypeScript strict mode with explicit interfaces (no `any`)
- Functional components with function declarations
- CSS Modules with `smart-clsx` (`cx`) auto-import
- Public API via `index.ts` only; never deep-import
- Business logic in `model/`, not `ui/`
- Peer dependency validation for external APIs

**Anti-Patterns** (avoid these):
- Mutation, side effects, global state  
- Deep relative imports outside slice scope  
- Direct slice-to-slice imports (cross-layer coupling)  
- `bun run build` / `bun run dev` for validation  
- CSS-in-JS or non-modular stylesheets  

---

## Core Philosophy

**Modular**: Everything is a slice — small, focused, reusable  
**Type-Safe**: Strict TypeScript, explicit interfaces, no implicit `any`  
**Explicit**: Dependencies declared, imports absolute, logic separated from UI

## Principles

### Feature-Sliced Design (FSD)
- **Hierarchy**: `app > components > shared` (library) or `app > pages > widgets > features > entities > shared` (landing)
- **Dependency Rule**: Higher layers import only from lower layers
- **Segment Structure**: `ui/` (components), `model/` (logic), `api/` (requests), `lib/` (helpers), `config/` (configuration)
- **Public API Rule**: Expose only via `index.ts`; never deep-import `ui/` or `model/` files

### Functional Components
- Use `function` declarations, not arrow functions:
  ```tsx
  // ✅ Correct
  function Button({ variant = 'filled', ...props }: ButtonProps) {
    return <button ... />
  }

  // ❌ Forbidden
  const Button = ({ variant, ...props }) => <button ... />
  ```

### Props Handling
- Destructure props **only** if necessary; prefer `props` argument when passing through:
  ```tsx
  // ✅ Correct
  function Component({ foo = "default", ...props }) {
    const result = useCustomHook(props)
    return <NextedComponent many={props.many}>{children}</NextedComponent>
  }

  // ❌ Forbidden
  function Component({ foo, many, different, props, children }) {
    const result = useCustomHook({ foo, many, different })
    return <NextedComponent many={many}>{children}</NextedComponent>
  }
  ```

### Custom Hooks
- Create logically and semantically separated hooks, each doing **one thing**:
  ```ts
  // ✅ Correct: separated concerns
  function useFormValidation(schema) { ... }
  function useFormSubmit(handler) { ... }

  // ❌ Forbidden: monolithic hook
  function useFormLogic(schema, handler, initialValues, options) { ... }
  ```

### Immutability
- Never mutate state directly; create new data:
  ```ts
  // ✅ Correct
  const newItems = [...items, item];
  const updatedUser = { ...user, name: 'New Name' };

  // ❌ Forbidden
  items.push(item);
  user.name = 'New Name';
  ```

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `button.tsx`, `style.module.css` |
| Components | PascalCase | `Button`, `TextInput` |
| Functions | camelCase | `useLogin`, `atr` |
| Constants | UPPER_SNAKE_CASE | `BUTTON_VARIANTS` |
| CSS Modules | `style.module.css` | `lib/components/button/ui/style.module.css` |
| Library Groups | kebab-case | `basic`, `form`, `extra` |

## Error Handling

- Validate at boundaries (input props, API responses)
- Return early with explicit conditions:
  ```ts
  // ✅ Correct
  function processData(data: unknown) {
    if (!data) return { success: false, error: 'No data provided' };
    // ...process
  }

  // ❌ Forbidden: deep nesting
  function processData(data: unknown) {
    if (data) {
      if (data.items) {
        // ...
      }
    }
  }
  ```

## Import Rules

- **Absolute paths** (`@/...`) for cross-slice imports
- **Relative paths** (`../`) only within the same slice
- **Forbidden**: deep relative paths like `../../../shared/attributify`
- **Library imports**: Use highest-level public API
  ```ts
  // ✅ Correct
  import { Button } from '@/lib';

  // ❌ Forbidden
  import { Button } from '@/lib/components/button';
  ```

## Styling Rules

- Always use **CSS Modules** (`style.module.css`)
- By default each `.tsx` has `cx` auto-imported from `smart-clsx`
- Define CSS variables on the component root node for customization:
  ```css
  .button {
    --height: 2.5rem;
    --shape: var(--md-sys-shape-corner-full);
    --gap: 0.5rem;
    /* user-overridable */
  }
  ```
- Use theme variables for fonts, colors, border-radius, transitions
- Use CSS nesting and media queries

## Custom Attributes
- Use custom JSX attributes instead of class names for boolean flags:
  ```tsx
  // ✅ Correct
  function Component({ variant = "default", ...props }) {
    const [flag, setFlag] = useState(true)
    return <div className={cx('div')} is-flag={atr(flag)} variant={variant}>{children}</div>
  }

  // ❌ Forbidden
  function Component({ variant, ...props }) {
    const [flag] = useState(true)
    return <div className={cx(['div', `variant-${variant}`, { [styles.active]: flag }])}>{children}</div>
  }
  ```

## Validation Gates

Every change must pass:
1. `bun run format`  (Biome)
2. `bun run lint`     (Biome)
3. `bun run test`     (Rstest)

**Do NOT run**: `bun run build` or `bun run dev`

## Composition Hierarchy

```
Page (route entry, no logic)
  └ Widget (large UI block)
      └ Feature (user action, business capability)
          └ Entity (domain model)
              └ Shared UI (reusable component)
                  └ Model (logic, hooks)
```

## Anti-Patterns

❌ **Mutation**: Modifying data in place  
❌ **Side effects**: Fetching inside pure components  
❌ **Deep nesting**: Use early returns  
❌ **God modules**: Split into focused slices  
❌ **Cross-layer imports**: `features/login` → `features/register`  
❌ **Deep imports**: `import { Button } from '@/lib/components/button/ui'`  
❌ **Non-modular styles**: Inline styles, global CSS (except CSS variables layer)  

## Best Practices

✅ TypeScript strict mode  
✅ Function declarations for components  
✅ Minimal prop destructuring  
✅ CSS Modules with `cx` for classes  
✅ Custom attributes (`attributify`/`atr`) for state  
✅ Explicit dependencies (absolute imports)  
✅ Validate at boundaries  
✅ Self-documenting, small functions  
✅ Test in isolation (Rstest)  
✅ `bun run format && bun run lint && bun run test` before completing  

---

**Golden Rule**: If you can't easily test it, refactor it.
