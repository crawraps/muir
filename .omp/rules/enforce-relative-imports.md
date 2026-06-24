---
description: Block @/ alias imports inside @muir/base — use src/ alias or relative paths
condition: "from\s+['\"]@/"
scope:
  - "tool:edit(packages/base/src/**)"
  - "tool:write(packages/base/src/**)"
astCondition:
  - "import { $$$IMPORTS } from \"@/$PATH\""
  - "import { $$$IMPORTS } from '@/$PATH'"
---

# Enforce Relative Imports in @muir/base

Inside `packages/base/src/`, use the `src/` alias for cross-slice imports and relative paths within the same slice. No `@/` aliases, no package self-imports.

## Correct
```tsx
import { atr } from 'src/shared/attributify'
import { AnimeScope } from 'src/shared'
import type { ButtonProps } from '../model/properties'
import { Animated } from './animation'
```

## Forbidden
```tsx
import { atr } from '@/lib/shared/attributify'
import { Switch } from '@muir/base'
```

This rule triggers via TTSR when an edit or write tool produces an `@/`-prefixed import inside the base library source.