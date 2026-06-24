# muir Sticky Rules

Never run `bun run build` or `bun run dev` directly — use `turbo run build` / `turbo run dev`.
Never add a workspace dependency from `@muir/base` to another workspace package — `@muir/base` must remain self-contained.
Never import from `@muir/base` directly in the docs app when a re-export exists via `@muir/capacitor` — use `@muir/capacitor`.
Never use `@/` aliases — use `src/` alias or relative paths.
Never use arrow functions or `const` for component declarations — use `function` declarations.
Never deep-import from a slice subfolder — always go through `index.ts`.
Always use `atr` for boolean state attributes instead of conditional `cx` class objects.
Always use `cx` for structural classes.