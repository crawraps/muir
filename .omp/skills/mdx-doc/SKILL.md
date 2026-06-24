---
name: mdx-doc
description: Template and checklist for writing component .mdx documentation with correct frontmatter, section order, and table formats
globs:
  - "apps/docs/docs/components/*.mdx"
  - "apps/docs/docs/utilities/*.mdx"
---

# MDX Documentation Procedure

## Frontmatter
```yaml
---
source: src/components/<name>
group: base|form|extra
variations:
  - form
extends:
  - button
---
```

Fields:
- `source` — required; path to component source directory (relative to the source package root, e.g. `packages/base/` for base components, `packages/extra/` for extra components)
- `group` — required; export group name (base, form, extra)
- `variations` — optional; list of component variants
- `extends` — optional; list of components this one extends

## Section order (mandatory)
0. Frontmatter
1. Import block (before title, no heading) — from `@muir/capacitor`
2. H1 title — component's exported name (spaced for multi-word)
3. One-line purpose — what it's for
4. Usage — simplest import + render, using actual source package names (`@muir/base`, `@muir/extra`, `@muir/form`)
5. Examples / Variants — live demos with inline JSX, no code blocks
6. Form Integration — (form variations only) complete code block
7. API — prop tables, mark required as `**required**`
8. Customization — CSS variable tables

## Import rules
- Live demo imports: from `@muir/capacitor` (the docs app dependency)
- Usage code blocks: from the actual source package (`@muir/base` for base components, `@muir/extra` for extra components, `@muir/form` for form wrappers)
- Never import from `@muir/base` directly in live demos

## API table rules
- Every prop has Type, Default, Description
- Required props: `**required**` in Default column
- No default and not required: `undefined`
- When extending native elements: state what's excluded
- Descriptions: terse noun phrases, no trailing periods

## Customization table rules
- Every variable has Default and Description
- Theme token defaults use `var(--md-sys-*)` or `var(--md-ref-*)`
- Dynamic defaults: `*variant-specific*` or `*scale-specific*`
- Descriptions: terse, no trailing periods
- Intro line: "Override these variables on the [Component] root to customize appearance."

## Demo styling
- Wrap demos in `<div>` with inline `style` for layout
- Use `display: 'flex'`, `gap`, `flexWrap`, `alignItems`, `maxWidth`, `margin: '1rem 0'`
- For vertical layouts: `flexDirection: 'column'`
- Add `maxWidth` on inputs to prevent full-width stretching

## Tone
- Direct and imperative ("Use a Button to...", not "You can use...")
- No hedging ("might", "could", "perhaps")
- No implementation details in component docs