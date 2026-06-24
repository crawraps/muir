---
name: new-component
description: Step-by-step procedure for scaffolding a new muir component with all FSD segments, exports, docs, and stories
globs:
  - "packages/base/src/components/**"
  - "packages/extra/src/components/**"
---

# New Component Scaffold

Procedure for creating a new muir component slice:

## 1. Create slice directory
`packages/base/src/components/<kebab-name>/`

## 2. Create segments
- `model/properties.ts` — Props interface extending native HTML element with Omit
- `ui/<Name>.tsx` — Component renderer (function declaration, minimal destructuring)
- `ui/style.module.css` — Internal styles with `.root` class
- `ui/public.module.css` — Public customization variables on root element
- `index.ts` — Public API re-exports

## 3. Component template
```tsx
import { atr } from 'src/shared/attributify'
import { AnimeScope } from 'src/shared'
import styling from './public.module.css'

export interface ComponentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  ref?: React.Ref<HTMLDivElement>
  error?: React.ReactNode
}

function Component({ error, className, ref, ...props }: ComponentProps) {
  return (
    <div className={cx('root', styling.root, className)} is-error={atr(error)} ref={ref} {...props} />
  )
}

export default Component
```

## 4. CSS template
```css
.root {
  --height: 2.5rem;
  --shape: var(--md-sys-shape-corner-full);
  --gap: 0.5rem;
  --color: var(--md-sys-color-primary);
}
```

## 5. Public API (index.ts)
```ts
export type { ComponentProps } from './model/properties'
export { default as Component } from './ui/component'
```

## 6. Wire exports
Add to the appropriate barrel file:
- Basic components: `packages/base/src/base.ts`
- Form wrappers: `packages/form/src/form.ts`
- Extra components: `packages/extra/src/extra.ts`

## 7. Re-export in capacitor
Add to `packages/capacitor/src/<group>.ts`

## 8. Create docs
`apps/docs/docs/components/<name>.mdx` with frontmatter and all sections (see `skill://mdx-doc`)

## 9. Create story
`apps/docs/stories/<name>.stories.tsx`

## 10. Validate
Run `turbo run lint` and `turbo run test`