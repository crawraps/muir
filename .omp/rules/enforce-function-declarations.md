---
description: Block arrow function and const component declarations — use function declarations
scope:
  - "tool:edit(packages/base/src/components/**/*.tsx)"
  - "tool:edit(packages/extra/src/components/**/*.tsx)"
  - "tool:edit(packages/form/src/components/**/*.tsx)"
astCondition:
  - "const $NAME = ($$$ARGS) => $BODY"
  - "const $NAME = function($$$ARGS) { $$$BODY }"
---

# Enforce Function Declarations for Components

Always use `function` declarations for React components, never arrow functions or `const`.

## Correct
```tsx
function Switch({ error, className, ref, ...props }: SwitchProps) { ... }
export default Switch
```

## Forbidden
```tsx
const Switch = ({ error, ...props }: SwitchProps) => { ... }
const Switch = function({ error, ...props }: SwitchProps) { ... }
```

This rule triggers via TTSR when an edit or write tool produces a `const`-assigned arrow function or function expression in a component `.tsx` file.