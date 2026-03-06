---
paths:
  - "src/**/*"
---

# Rules for Feature-Sliced Design (FSD)

The following rules are specifically for the application (components library landing page), so use them only in `@lib` directory.

## 1. Follow the Layer Hierarchy Strictly

The project must be structured using the **Feature-Sliced Design layers**:

```
app
processes (optional)
pages
widgets
features
entities
shared
```

### Dependency Rule

Higher layers may depend only on **lower layers**.

Allowed direction:

```
app → processes → pages → widgets → features → entities → shared
```

Forbidden:

* Importing from a **higher layer**
* Importing between unrelated slices in the same layer

Example of forbidden import:

```ts
features/auth → pages/login ❌
entities/user → features/cart ❌
```

Example of valid import:

```ts
features/cart → entities/product ✅
pages/home → widgets/product-list ✅
```

---

# 2. Always Place Code in the Correct Layer

When creating new code, choose the layer using these rules.

### `app`

Global application configuration.

Allowed contents:

* app providers
* router
* global styles
* store initialization
* app entry

Example:

```
app/
  providers/
  router/
  styles/
  index.tsx
```

---

### `pages`

Represents **route-level screens**.

Pages:

* compose widgets and features
* should contain **almost no business logic**

Example:

```
pages/product-page
pages/profile-page
```

---

### `widgets`

Large **UI blocks composed from features/entities**.

Examples:

* Header
* Sidebar
* ProductList
* DashboardPanel

Widgets should not contain complex business logic.

---

### `features`

Features represent **user actions or business capabilities**.

Examples:

```
features/add-to-cart
features/login
features/update-profile
features/create-post
```

Features may include:

```
ui/
model/
api/
lib/
config/
```

Example:

```
features/add-to-cart/
  ui/AddToCartButton.tsx
  model/useAddToCart.ts
  api/addToCart.ts
```

---

### `entities`

Entities represent **business domain models**.

Examples:

```
entities/user
entities/product
entities/order
```

Entities may contain:

```
ui/
model/
api/
lib/
```

Example:

```
entities/user/
  model/user.types.ts
  model/user.store.ts
  ui/UserAvatar.tsx
```

Entities **must not contain feature logic**.

---

### `shared`

Reusable code with **no business meaning**.

Examples:

```
shared/ui
shared/lib
shared/api
shared/config
shared/types
shared/utils
```

Examples of shared components:

```
Button
Modal
Input
Loader
```

Shared must **never depend on other layers**.

---

# 3. Use Slice Isolation

Inside a layer, organize code into **slices**.

Example:

```
features/
  login/
  add-to-cart/
  search-product/
```

Rules:

* Slices must be **independent**
* Slices must not import from other slices directly
* Communication must happen through **entities or shared**

Example:

❌ Forbidden:

```
features/login → features/register
```

✅ Correct:

```
features/login → entities/user
```

---

# 4. Use Segment Structure Inside Slices

Each slice must be structured using **segments**.

Recommended segments:

```
ui      – React components
model   – state, hooks, business logic
api     – requests
lib     – helper functions
config  – configuration
```

Example:

```
features/login/
  ui/LoginForm.tsx
  model/useLogin.ts
  api/login.ts
  lib/validation.ts
```

---

# 5. Public API Rule

Each slice must expose a **public API via `index.ts`**.

Example:

```
features/login/index.ts
```

```ts
export { LoginForm } from "./ui/LoginForm"
export { useLogin } from "./model/useLogin"
```

Other layers **must import only through the public API**.

Correct:

```ts
import { LoginForm } from "@/features/login"
```

Forbidden:

```ts
import { LoginForm } from "@/features/login/ui/LoginForm"
```

---

# 6. Avoid Business Logic in UI Components

UI components should:

* render UI
* call hooks

Business logic must live in:

```
model/
lib/
```

Example:

Correct:

```ts
const { login } = useLogin()
```

Wrong:

```ts
fetch("/login") inside component ❌
```

---

# 7. Prefer Composition

Pages should **compose widgets**, widgets compose **features**, features compose **entities**.

Example:

```
Page
 └ Widget
    └ Feature
       └ Entity
          └ Shared UI
```

---

# 8. Naming Rules

Use **kebab-case** for slices.

Examples:

```
add-to-cart
user-profile
product-card
```

Component naming:

```
ProductCard.tsx
LoginForm.tsx
UserAvatar.tsx
```

Hooks:

```
useLogin.ts
useCart.ts
```

---

# 9. Do Not Create Cross-Layer Logic

Never mix responsibilities.

Example of forbidden code:

```
entities/user/login.ts ❌
```

Login is a **feature**, not an entity.

Correct:

```
features/login
```

---

# 10. Reusability Rule

Before creating new code:

1. Check `shared`
2. Check `entities`
3. Then create new `feature`

Avoid duplication.

---

# 12. If Unsure Where Code Belongs

Use this decision flow:

```
Is it global configuration?
→ app

Is it a route?
→ pages

Is it a large UI block?
→ widgets

Is it a user action/business feature?
→ features

Is it a domain model?
→ entities

Is it reusable utility/UI?
→ shared
```

---

✅ If you want, I can also give you a **much better version specifically optimized for AI coding agents (Cursor / Claude Code / GPT Code Interpreter)** that:

* **prevents architecture violations automatically**
* includes **import validation rules**
* includes **auto folder generation**
* works extremely well with **React + TypeScript projects**.
