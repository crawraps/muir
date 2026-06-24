# muir Project Instructions

When working in this monorepo:
1. Read relevant rules via `rule://` before editing — the rulebook has topic-specific guides
2. Use `turbo run` for all build/test/lint commands, never `bun run build` or `bun run dev` directly
3. Inside `packages/base/src/`: use `src/` alias for cross-slice, relative for within-slice. Function declarations for components, `atr` for state, `cx` for structure
4. Inside `apps/docs/`: import from `@muir/capacitor` for components, `@muir/navigation` for nav, `src/` for internal paths
5. After changes: run `turbo run lint && turbo run test` before yielding
6. Use `task` with the `component-builder` agent for new components, `doc-writer` for docs, `form-integrator` for form wrappers
7. Use `skill://new-component` for the full scaffolding procedure