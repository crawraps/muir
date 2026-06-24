---
"@muir/navigation": minor
---

Split `TabProvider` into separate metadata and state contexts for selective re-rendering. Consumers that only read metadata (tab definitions, paths) no longer re-render when tab memory changes. This is an internal refactor with no API removals, but components that imported `useTabNavigation` and consumed `memory` will now need to use `useTabState` for memory/state or `useTabMetadata` for read-only tab info.

New exports:
- `useTabMetadata()` — read-only access to tab definitions
- `useTabState()` — access to memory and dispatch
- `useTabItemHref(tab)` — resolved href for a nav entry

Moved exports:
- `useScrollRestore` now exported from `@muir/navigation` directly (was previously only in docs app)

Behavior changes:
- `useTabNavigation()` still works but only exposes metadata (tab definitions). Use `useTabState()` for memory.
- `memoizedResolveActiveTab` is now exported for advanced use.