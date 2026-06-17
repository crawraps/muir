<!-- Context: standards/docs | Priority: critical | Version: 2.0-cuil | Updated: 2026-04-27 -->

# Documentation Standards

## Quick Reference

**Golden Rule**: If users ask the same question twice, document it  
**Format**: Storybook 10 + MDX with interactive examples  
**Location**: `docs/*.mdx` for every component  

**Document** (✅ DO):
- Interactive examples (live component rendering in MDX)
- Short summary, usage code, API reference table
- Customization CSS variables list
- Peer dependencies and compatibility notes

**Don't Document** (❌ DON'T):
- Obvious code (self-explanatory prop passing)
- Internal implementation details (model logic, hook internals)
- Third-party library documentation (link instead)

**Principles**: Audience-focused, Show don't tell, Keep current

---

## Principles

**Audience-focused**:
- **Library users**: How to install, import, customize components
- **Contributors**: How to create new components, patterns to follow
- **Maintainers**: Architecture decisions, cross-component patterns

**Show, don't tell**: Live examples in Storybook, real use cases, expected output
**Keep current**: Update MDX when props change, remove outdated info, mark deprecations

---

## Component Documentation (MDX)

Every component in `lib/components/` must have a corresponding MDX story in `docs/`:

```markdown
<!-- docs/button.mdx -->
import { Button } from '@/lib';

# Button

Short summary (1-2 sentences): what the component does and when to use it.

## Usage

```tsx
import { Button } from 'cuil';

function App() {
  return <Button variant="filled" onClick={handleClick}>Submit</Button>;
}
```

## Interactive Example

<Button variant="filled">Filled Button</Button>
<Button variant="outlined">Outlined Button</Button>

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'filled' \| 'outlined' \| 'text'` | `'filled'` | Visual style variant |
| `disabled` | `boolean` | `false` | Disables interaction |
| `href` | `string` | — | Render as anchor link |
| `onClick` | `(e: MouseEvent) => void` | — | Click handler |

## Customization

Use these CSS variables to override styles:

| Variable | Default | Description |
|----------|---------|-------------|
| `--height` | `2.5rem` | Button height |
| `--shape` | `var(--md-sys-shape-corner-full)` | Border radius |
| `--gap` | `0.5rem` | Internal spacing |

```css
.my-button {
  --height: 3rem;
  --shape: 8px;
}
```

## Accessibility

- Keyboard focusable
- `role="button"` (or `role="link"` when `href` is provided)
- `aria-disabled` when disabled
```

---

## Component README Structure

```markdown
# Component Name
Brief description (1-2 sentences)

## Features
- Key feature 1
- Key feature 2

## Installation
```bash
bun add cuil
```

## Quick Start
```tsx
import { Component } from 'cuil';

function App() {
  return <Component />;
}
```

## Usage
[Detailed examples with variants]

## API Reference
[Props table]

## Customization
[CSS variables table]

## Accessibility
[ARIA roles, keyboard behavior]

## Contributing
[Link to CONTRIBUTING.md]

## License
[License type]
```

---

## What to Document

### ✅ DO
- **WHY** decisions were made (e.g., CSS variables customization layer)
- Complex component logic (controlled vs uncontrolled state)
- Non-obvious behavior (e.g., `href` + `onClick` conflict)
- Public APIs (props, CSS variables, exported utilities)
- Setup/installation (peer dependencies)
- Common use cases (form validation, modal stacking)
- Known limitations (browser quirks, form integration caveats)
- Workarounds (with explanation and code)
- Accessibility patterns (keyboard navigation, focus traps)
- Migration guides (breaking changes between versions)

### ❌ DON'T
- Obvious code (self-explanatory prop spreading)
- What code does internally (should be self-documenting)
- Internal helper functions (not exported)
- Redundant information (duplicated from other files)
- Outdated/incorrect info (update or remove)

---

## Code Comments

### Good
```tsx
// HACK: Safari ignores focus-visible on anchor elements, use :focus instead
// TODO: Remove when Safari 17+ support is minimum
// Calculate discount by tier (Bronze: 5%, Silver: 10%, Gold: 15%)
const discount = getDiscountByTier(customer.tier);
```

### Bad
```tsx
// Increment counter
counter++;

// Get button props
const props = useButtonProps(variant);
```

---

## Storybook Organization

```
docs/
├── button.mdx              # Component docs + interactive examples
├── form/
│   ├── validation.mdx      # Form patterns and examples
│   └── accessibility.mdx   # Accessibility guide
├── getting-started.mdx     # Installation, setup
├── customization.mdx     # CSS variables, theming
└── migration/
    ├── v2-to-v3.mdx      # Breaking changes guide
    └── v3-to-v4.mdx
```

---

## API Documentation Format

For component props:

```markdown
### <Button />

Clickable element that triggers an action.

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `variant` | `'filled' \| 'outlined' \| 'text'` | No | `'filled'` | Visual style |
| `disabled` | `boolean` | No | `false` | Disables interaction |
| `href` | `string` | No | — | Renders as anchor link |

**CSS Variables:**

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `--height` | `length` | `2.5rem` | Button height |
| `--shape` | `length` | `var(--md-sys-shape-corner-full)` | Border radius |

**Example:**
```tsx
<Button variant="filled" disabled={isLoading}>
  Submit
</Button>
```
```

---

## Best Practices

✅ Explain WHY, not just WHAT  
✅ Include working, interactive examples  
✅ Show expected output (rendered component)  
✅ Cover error handling and edge cases  
✅ Use consistent terminology (variant, not style or type)  
✅ Keep structure predictable (Summary → Usage → API → Customization)  
✅ Update when code changes  
✅ Document peer dependency versions  
✅ Include accessibility notes in every component  
✅ Add migration guides for breaking changes  

---

**Golden Rule**: If users ask the same question twice, document it.
