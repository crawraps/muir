---
description: Component .mdx documentation rules
globs:
  - "apps/docs/docs/components/*.mdx"
---

Rules for writing `.mdx` documentation for React components in this project. These rules build on top of `documentation.md` (general rules) and add component-library-specific conventions.

---

## Location

Component docs live in `apps/docs/docs/components/<component-name>.mdx`.

Utility docs live in `apps/docs/docs/utilities/<utility-name>.mdx`.

---

## Frontmatter

Every `.mdx` file starts with a frontmatter.

```mdx
---
source: src/components/toggle-button
group: extra
variations:
  - form
extends:
  - button
---
```

- `source` - required field; path to the component source directory (relative to the source package root, e.g. `packages/base/` for base components, `packages/extra/` for extra components)
- `group` - required field; name of the export group this component belongs to
- `variations` - optional field; list of component's variants
- `extends` - optional field; list of components this component extends

## Imports

Import the live component from the `@muir/capacitor` package:

```mdx
import { Switch } from '@muir/capacitor';
import { Text } from '@muir/capacitor';
```

- Use `@muir/capacitor` package imports for all live demos
- Import every component used in live demos
- **Never** import from `@muir/base` directly in the docs app — the docs app depends on `@muir/capacitor`

---

## Section Order

Every component doc **must** follow this exact section order. Skip only sections that genuinely don't apply.

0. **Frontmatter**
1. **Import block** (before title, no heading)
2. **H1 title** — Component name (e.g., `# Switch`, `# Toggle Button`)
3. **One-line purpose** — What it's for (e.g., "Toggle input for on/off states")
4. **Usage** — Simplest import + render code block
5. **Examples / Variants** — Live demos grouped by variant or feature
6. **Form Integration** — (form variations only) `Form` usage with code block
7. **API** — Prop tables
8. **Customization** — CSS variable table

---

## H1 Title

Match the component's exported name. Use spaced names for multi-word components:

```mdx
# Toggle Button
```

Not:

```mdx
# ToggleButton
# toggle-button
```

---

## Usage Section

Always the first content section. Shows the **simplest possible** import and render:

```mdx
## Usage

\`\`\`jsx
import { Switch } from '@muir/base';
import { Text } from '@muir/base';

<Text type="label"><Switch /> Enable notifications</Text>
\`\`\`
```

- Use the **actual source package name** (`@muir/base`, `@muir/extra`, `@muir/form`) in usage code blocks — these are what consumers will write
- Show import + render, nothing else
- If the component belongs to a specific export group, use that group:
  - Base components: `import { Switch } from '@muir/base'`
  - Form wrappers: `import { Form, FormCheckbox } from '@muir/form'`
  - Extra components: `import { ToggleButton } from '@muir/extra'`
  - General (via capacitor): `import { Button } from '@muir/capacitor'`

Note: usage code blocks show the actual source package name (`@muir/base`, `@muir/extra`, `@muir/form`), while the live demo import block at the top of the `.mdx` file uses `@muir/capacitor` (the docs app dependency).

---

## Examples / Variants

Each major variant or feature gets its own ### heading with:

1. A one-sentence description
2. A **live demo** (JSX rendered inline in the `.mdx`)
3. No code block for the demo — the user already saw the usage pattern

```mdx
### Filled

High-emphasis action.

<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', margin: '1rem 0' }}>
  <Button variant="filled">Filled</Button>
  <Button variant="filled" disabled>Disabled</Button>
</div>
```

### Demo styling

- Wrap demos in a `<div>` with inline `style` for layout
- Use `display: 'flex'`, `gap`, `flexWrap`, `alignItems`, `maxWidth`, `margin: '1rem 0'`
- For vertical layouts, use `flexDirection: 'column'`
- Add `maxWidth` on inputs and forms to prevent full-width stretching

### Example grouping

- Group related variants under a single `###` heading
- Show all states (default, disabled, error) in one demo when relevant
- For controlled/uncontrolled modes, show a code block if behavior differs from native

---

## Form Integration

Required for components with form variations.

Show the `Form` variant with a complete code block:

```mdx
## Form Integration

\`\`\`jsx
import { Form, FormCheckbox } from '@muir/form';
import { Text } from '@muir/base';

<Form defaultValues={{ agree: false }} onSubmit={handleSubmit}>
  <Text type="label"><FormCheckbox name="agree" /> I agree</Text>
</Form>
\`\`\`
```

- Always show import from `@muir/form`
- Use `defaultValues` in the example, not `schema` (unless schema validation is the focus)
- Include a visible submit action or note about `onSubmit`

---

## API Section

### Single component

```mdx
## API

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `error` | `ReactNode` | `undefined` | Error message. |
| `showError` | `boolean` | `false` | Renders the error message below the switch. |
| `disabled` | `boolean` | `false` | Disables the switch. |
| ... | ... | ... | extends [input](./input) |
```

### Component + Form variant

When a component has a `Form` variant, add a sub-heading:

```mdx
## API

### Switch

Extends native `<input>` props except `type` and `children`.

| Prop | ... |

### FormSwitch

Extends `Switch` props except `name`, `value`, `defaultValue`, `checked`, `defaultChecked`, `onChange`, and `onBlur`.

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `name` | `string` | **required** | Field name for react-hook-form registration. |
```

### Table rules

- **Every prop** must have Type, Default, and Description
- Mark required props as `**required**` in the Default column (not `—` or "required")
- For props with no default value that aren't required, use `undefined`
- When extending native elements, state what's excluded: `Extends native <input> props except 'type' and 'children'`
- When extending another component, state what's excluded: `Extends Switch props except 'name', 'value', 'defaultValue', 'checked', 'defaultChecked', 'onChange', and 'onBlur'`
- Keep descriptions to one short sentence, no period at the end

### Component relationship note

If a component extends another project component (e.g., ToggleButton extends Button), add a note:

```mdx
> `toggled` is also accepted as an alias for `checked` for backward compatibility.
```

---

## Customization Section

Lists CSS custom properties that users can override.

```mdx
## Customization

Override these variables on the Switch root to customize appearance.

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `--track-width` | `3.25rem` | Width of the track. |
| `--track-height` | `2rem` | Height of the track. |
| `--checked-track-color` | `var(--md-sys-color-primary)` | Track color when on. |
```

### Customization table rules

- **Every variable** must have a Default value and Description
- Default values that reference theme tokens use `var(--md-sys-*)` or `var(--md-ref-*)`
- When default is dynamic per variant, write `*variant-specific*` in italics
- When default is scale-specific (depends on type/size), write `*scale-specific*`
- Descriptions are short, no period
- The intro line says "Override these variables on the [Component] root to customize appearance."

### Inheriting from another component

When a component's customization extends another component's variables:

```mdx
Extends [Button variables](./button#customization).
```

---

## What Goes in Live Demos vs Code Blocks

| Content | Format |
|---|---|
| Import + basic render | `jsx` code block in **Usage** |
| Variant showcases | Live JSX in **Examples** (no code block) |
| Controlled state patterns | `jsx` code block in **Examples** |
| Form integration | `jsx` code block in **Form Integration** |
| API reference | Table |
| CSS customization | Table |

---

## cx and atr in Docs

When documentation needs to show how a component applies state styling:

- Use `cx` for structural classes (layout, spacing)
- Use `atr` for boolean/state attributes (disabled, error, checked)
- Reference `rule://styling-tools` for the division of labor

Never show internal CSS class names in component docs. Customization is done through CSS variables, not through class overrides.

---

## Tone

- Direct and imperative ("Use a Button to trigger an action", not "You can use a Button to trigger an action")
- No hedging language
- No implementation details in component docs — those belong in rule files, not user-facing docs
- Descriptions in tables are terse noun phrases, no trailing periods
