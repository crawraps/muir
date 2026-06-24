---
description: Block direct @muir/base imports in the docs app when a re-export exists via @muir/capacitor
scope:
  - "tool:edit(apps/docs/src/**)"
  - "tool:edit(apps/docs/docs/**)"
astCondition:
  - "import { $$$IMPORTS } from \"@muir/base\""
  - "import { $$$IMPORTS } from '@muir/base'"
  - "import { $$$IMPORTS } from \"@muir/extra\""
  - "import { $$$IMPORTS } from '@muir/extra'"
  - "import { $$$IMPORTS } from \"@muir/form\""
  - "import { $$$IMPORTS } from '@muir/form'"
---

# Enforce @muir/capacitor Imports in Docs

Inside `apps/docs/`, component imports should come from `@muir/capacitor` (the aggregator), not from individual packages like `@muir/base`, `@muir/extra`, or `@muir/form` directly.

## Correct
```tsx
import { Switch, Text } from '@muir/capacitor'
import { Button, Icon } from '@muir/capacitor'
import { Code, CodeStyleProvider } from '@muir/capacitor'
import { TabProvider, TabView } from '@muir/navigation'
```

## Forbidden in docs app source
```tsx
import { Switch } from '@muir/base'
import { ToggleButton } from '@muir/extra'
import { Form } from '@muir/form'
```

Note: This rule does not apply to `.mdx` documentation code blocks, which intentionally show the actual source package names.