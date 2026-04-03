# File system

There are two distinct parts of the application: library and landing page. Library is the core functionality this application provides. The landing page is a documentation landing page that users of the library will read to get full understanding of the library's public api.

The library's source code lives in lib/ directory of the project while the landing page is in src/ directory.

Each of these parts have to use Feature-Sliced Design system but with different uproaches.

# Common rules for both projects

## Use Segment Structure Inside Slices

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



## Public API Rule

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


## Naming Rules

Use **kebab-case** wherever it's possible.

Examples:

```
add-to-cart/
product-card.tsx
add-to-cart.tsx
```

## Reusability Rule

Before creating new code:

1. Check `shared`
2. Check `entities`
3. Then create new `feature`

Avoid duplication.


# Landing page (src/) rules

When importing something from "lib/", use highest level public api and absolute paths.

Wrong:
```
import { Button } from "@/lib/components/button"
```

Correct:
```
import { Button } from "@/lib"
```

## Follow the Layer Hierarchy Strictly

The project must be structured using the **Feature-Sliced Design layers**:

```
app
pages
widgets
features
entities
shared
```

### Dependency Rule

Higher layers may depend only on **lower layers**.

Forbidden:
* Importing from a **higher layer**
* Importing between unrelated slices in the same layer



## Always Place Code in the Correct Layer

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



### `widgets`

Large **UI blocks composed from features/entities**.

Examples:

* Header
* Sidebar
* ProductList
* DashboardPanel

Widgets should not contain complex business logic.



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



## Use Slice Isolation

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



## Avoid Business Logic in UI Components

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



## Prefer Composition

Pages should **compose widgets**, widgets compose **features**, features compose **entities**.

Example:

```
Page
 └ Widget
    └ Feature
       └ Entity
          └ Shared UI
```



## Do Not Create Cross-Layer Logic

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


## If Unsure Where Code Belongs

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

# Library (lib/) rules

This directory must be self-contained.

## Groups

The library should export several groups:
- `lib/index.ts` - this is for the full library including all components
- `lib/basic.ts` - this is for the basic components only
- `lib/form.ts` - this is for the form components that utilize `react-hook-form` library internally.

Each component would have it's groups documented.

## Follow the Hierarchy Strictly

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

## Always Place Code in the Correct Layer

When creating new code, choose the layer using these rules.

### `app`

Global application configuration.

Allowed contents:

* app providers
* global styles
* store initialization

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
