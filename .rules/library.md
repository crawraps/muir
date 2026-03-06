---
paths:
  - "lib/**/*"
---

# Rules for Lib Feature-Sliced Design

The following rules are specifically for the application (components library landing page), so use them only inside `@lib` directory.

You cannot import anything from any other directory than `@lib`, it should be self-contained.

## 1. Follow the Hierarchy Strictly

The project must be structured using the following hierarchy:

```
app
components
shared (optional)
```

It's kinda looks like Feature Sliced Design but for components library.

### Dependency Rule

Higher layers may depend only on **lower layers**.

Allowed direction:

```
app → components → shared
```

Forbidden:

* Importing from a **higher layer**
* Importing between unrelated slices in the same layer

# Always Place Code in the Correct Layer

When creating new code, choose the layer using these rules.

### `app`

Global application configuration.

Allowed contents:

* app providers
* router
* global styles
* store initialization
* app entry

### `components`

Components may contain:

```
ui/
model/
api/
lib/
```

### `shared`

Reusable code with **no business meaning**.
Shared must **never depend on other layers**.

# Use Segment Structure Inside Slices

Each slice must be structured using **segments**.

Recommended segments:

```
ui      – everything related to the graphic interface (e.g. styles, components layouting). Primarily here should be .tsx and .css files
model   – state, hooks, business logic. There should be no .tsx files, only .ts
api     – requests, etc. (not appliable for UI components in components library)
lib     – helper functions
config  – configuration
```

# Public API Rule

Each slice must expose a **public API via `index.ts`**.

Example:

```
components/login/index.ts
```

```ts
export { LoginForm } from "./ui/LoginForm"
export { useLogin } from "./model/useLogin"
```

Other layers **must import only through the public API**.

Correct:

```ts
import { LoginForm } from "@/components/login"
```

Forbidden:

```ts
import { LoginForm } from "@/components/login/ui/LoginForm"
```

> a layer and `@lib` directory itself should have an `index.ts` file, exposing public api for end users. E.g. each component

# Avoid Business Logic in UI Components

UI components should:

* render UI
* call hooks

Business logic must live in:

```
model/
lib/
```

# Naming Rules

Use **kebab-case** for every file name.

Examples:

```
add-to-cart
user-profile
product-card
```

Prefer `export default` for ui components and regular `export` for everything else.

# Reusability Rule

1. Check `shared`

Avoid duplication.
