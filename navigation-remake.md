# navigation-remake - Work Plan

## TL;DR (For humans)

**What you'll get:** A cleaned-up, tested `@muir/navigation` package whose tab resolution, memory, and keepalive integration work correctly and efficiently, plus a docs app that uses the new helpers instead of duplicating logic.

**Why this approach:** I treated this as an open-ended "find the real problems and fix them" request. The biggest payoffs come from fixing the malformed public API, splitting the context so memory updates do not re-render every tab consumer, and stabilizing the keepalive child identity so cached tabs do not re-render needlessly. Everything else follows from those fixes.

**What it will NOT do:**
- It will not migrate away from wouter or keepalive-for-react.
- It will not redesign the docs app visually or change Capacitor native navigation.
- It will not re-export `@muir/navigation` through `muir-capacitor`; the docs app will keep its direct import with a documented exception.

**Effort:** Medium
**Risk:** Medium - the package currently relies on a private-by-naming `_cacheKey` field from `keepalive-for-react`, and the context split changes observable re-render timing.
**Decisions I made for you:**
- Keep wouter + keepalive-for-react; do not migrate.
- Keep using `_cacheKey` but add a fallback and regression tests rather than inventing an unsupported injection mechanism.
- Split the single `TabProvider` context into stable-metadata + state contexts to fix re-render thrash.
- Move `useScrollRestore` into the package and fix its chained-rAF bug.
- Add one small public helper, `useTabItemHref(tab)`, to remove duplication in the docs nav entry.

Your next move: approve the plan so the worker can start with `$start-work navigation-remake`, or ask for changes. Full execution detail follows below.

---

> TL;DR (machine): Medium effort, medium risk - refactor @muir/navigation for correctness, testability, and performance; add Rstest suite; fix docs integration without router/visual changes.

## Scope
### Must have
- Correct and deterministic public API for `@muir/navigation` (no duplicate exports).
- Correct tab resolution, memory persistence, and hook semantics (`useTabNavigation`, `useTabMemory`, `useIsTabActive`, `useTabPath`).
- Stable keepalive element identity in `TabView` with bounded cache size.
- Hardened scroll restoration hook inside the package.
- New `useTabItemHref(tab)` helper and docs app adoption to remove href duplication.
- Rstest regression suite for model logic and hooks.
- All workspace builds, lints, and typechecks pass.

### Must NOT have (guardrails, anti-slop, scope boundaries)
- No router migration (wouter stays).
- No visual redesign of docs app.
- No new public component props (only the `useTabItemHref` helper).
- No `muir-capacitor` re-export changes in this plan; docs keeps direct `@muir/navigation` imports with a documented FSD exception.
- No Capacitor native navigation changes.
- No Storybook/docs content rewrite.
- No major version bump; aim for patch/minor with a changeset noting the context-split behavior change.

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after for existing code, TDD for new helper (`useTabItemHref`) and regression tests.
- Framework: Rstest + happy-dom + Testing Library for package tests; Biome for lint; TypeScript via `bun run lint`/`bun run build`.
- Evidence: `.omo/evidence/task-<N>-navigation-remake.txt` (build/test/lint output captured).

## Execution strategy
### Parallel execution waves
- Wave 1 — Public API & tooling: tasks 1-4 can run in parallel.
- Wave 2 — Model correctness: tasks 5-6 depend on Wave 1.
- Wave 3 — Keepalive & UI: tasks 7-8 depend on Wave 2 context split.
- Wave 4 — Scroll restore & docs integration: tasks 9-10 depend on Wave 2/3.
- Wave 5 — Regression tests: tasks 11-12 depend on implementation work.

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | — | 2, 5, 8 | 2, 3, 4 |
| 2 | — | 5 | 1, 3, 4 |
| 3 | — | 5, 6 | 1, 2, 4 |
| 4 | — | 3 | 1, 2 |
| 5 | 1, 2, 3 | 6, 7, 8, 12 | 6 |
| 6 | 5 | 7, 8, 10 | 5 |
| 7 | 5 | 8, 10 | 8 |
| 8 | 5 | 10 | 7 |
| 9 | 1 | 10 | 7, 8 |
| 10 | 6, 9 | F3 | — |
| 11 | 3, 5, 6, 7 | F1, F2 | 12 |
| 12 | 5, 7, 11 | F1, F2 | 11 |

## Todos
> Implementation + Test = ONE todo. Never separate.
<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

### Wave 1 — Public API & tooling foundation

- [x] 1. Clean up `packages/navigation/src/index.ts` duplicate exports
  What to do / Must NOT do: Replace the triplicate re-exports with a single re-export per public symbol. Do not change any symbol names or remove exports that are currently consumed by docs app.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: 2, 5, 8
  References: `packages/navigation/src/index.ts:1-16`, `packages/navigation/dist/index.js:1-10`, `apps/docs/src/app/layouts/tab-layout/layout.tsx:1`, `apps/docs/src/widgets/navbar/ui/nav-entry.tsx:1-2`, `apps/docs/src/pages/docs/ui/page.tsx:1`, `apps/docs/src/widgets/sidebar/ui/sidebar.tsx:1-2`, `apps/docs/src/shared/lib/use-scroll-restore.ts:1`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation build` exits 0; `grep -c "export \* from './model/resolve-active-tab'" packages/navigation/src/index.ts` returns 1; `grep -c "export \* from './ui/tab-provider'" packages/navigation/src/index.ts` returns 1; `grep -c "export \* from './ui/tab-view'" packages/navigation/src/index.ts` returns 1.
  QA scenarios: happy — build succeeds and docs app still imports all needed symbols; failure — if a duplicate remains, the grep assertion fails. Evidence: `.omo/evidence/task-1-navigation-remake.txt` (build output).
  Commit: Y | fix(navigation): deduplicate public exports in src/index.ts

- [x] 2. Fix `smart-clsx` falsy class-name handling
  What to do / Must NOT do: Change `createSmartClsx` so `0` and empty string are passed through to `clsx` instead of being swallowed. Do not alter the first-arg-resolves-through-CSS-module contract.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: 5
  References: `packages/navigation/src/shared/smart-clsx.ts:1-28`, `packages/navigation/node_modules/clsx/package.json` (peer behavior)
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` passes a test where `createSmartClsx({ '0': 'hashed0' })('0', 'global')` equals `'hashed0 global'` and `createSmartClsx({})('')` equals `''`.
  QA scenarios: happy — numeric/empty string keys resolve correctly; failure — a class key `'0'` is dropped. Evidence: `.omo/evidence/task-2-navigation-remake.txt` (test output).
  Commit: Y | fix(navigation): preserve falsy class keys in smart-clsx

- [x] 3. Add Rstest tooling to `packages/navigation`
  What to do / Must NOT do: Add `rstest`, `@testing-library/react`, `happy-dom`, and a `test` script to `packages/navigation/package.json`. Add a `tests/helpers/wrapper.tsx` that wraps children with `wouter` `Router` and `TabProvider`. Do not add heavy E2E dependencies.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: 5, 6
  References: `packages/navigation/package.json:23-41`, `.opencode/context/core/standards/test-coverage.md:1-224`, `packages/navigation/rslib.config.ts:1-58`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` runs and exits 0 (it may report 0 tests before Wave 5). `grep -q '"rstest"' packages/navigation/package.json`. `grep -q '"test"' packages/navigation/package.json`.
  QA scenarios: happy — `bun run test` executes the runner; failure — missing dependency causes import error. Evidence: `.omo/evidence/task-3-navigation-remake.txt` (test output).
  Commit: Y | chore(navigation): add rstest test runner and shared wrapper

- [x] 4. Remove duplicate `keepalive-for-react` dev dependency
  What to do / Must NOT do: Delete `keepalive-for-react` from `devDependencies` in `packages/navigation/package.json` while keeping it in `peerDependencies`. Verify build still resolves types.
  Parallelization: Wave 1 | Blocked by: nothing | Blocks: 3
  References: `packages/navigation/package.json:16-36`, `packages/navigation/tsconfig.json:1-11`, `packages/navigation/env.d.ts:1-18`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation build` exits 0 and `bun run --cwd packages/navigation lint` exits 0 after removing the dev dep.
  QA scenarios: happy — build/typecheck pass with only peer dep; failure — TypeScript cannot resolve keepalive types. Evidence: `.omo/evidence/task-4-navigation-remake.txt` (build + lint output).
  Commit: Y | chore(navigation): remove redundant keepalive-for-react dev dependency

### Wave 2 — Model correctness & performance

- [x] 5. Refactor `TabProvider` into split contexts and memoize memory updates
  What to do / Must NOT do: Introduce two contexts: `TabNavigationMetadataContext` (stable `tabs`, `fallbackId`) and `TabNavigationStateContext` (`activeTab`, `memory`, `setMemory`). Keep the existing public `TabNavigationContext` export as the state context to avoid breaking consumers. Use a memoized selector or split contexts so `useTabMemory` for tab A does not re-render when tab B memory changes. Do not change hook names or return shapes.
  Parallelization: Wave 2 | Blocked by: 1, 2, 3 | Blocks: 6, 7, 8
  References: `packages/navigation/src/ui/tab-provider.tsx:1-57`, `packages/navigation/src/model/types.ts:68-82`, `packages/navigation/src/model/use-tab-navigation.ts:1-37`, `packages/navigation/src/model/use-tab-memory.ts:1-24`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` passes a test that counts render phases: updating memory for tab B does not cause a component using `useTabMemory('A')` to re-render. `bun run --cwd packages/navigation build` and `bun run --cwd apps/docs build` both exit 0.
  QA scenarios: happy — memory update is scoped to the affected tab; failure — every memory consumer re-renders. Evidence: `.omo/evidence/task-5-navigation-remake.txt` (test output + render counts).
  Commit: Y | refactor(navigation): split tab provider contexts for selective subscriptions

- [x] 6. Memoize `resolveActiveTab` and add `useTabItemHref` helper
  What to do / Must NOT do: Wrap `resolveActiveTab` so repeated calls with the same `tabs` and `location` return the same `TabMatch` object when safe. Add and export `useTabItemHref(tab)` that returns the remembered href for a tab (identical logic currently duplicated in `TabItem` and `NavEntry`). Refactor `TabItem` to use the helper. Do not break `TabItem` prop signature.
  Parallelization: Wave 2 | Blocked by: 5 | Blocks: 7, 8
  References: `packages/navigation/src/model/resolve-active-tab.ts:1-28`, `packages/navigation/src/ui/tab-item.tsx:1-29`, `packages/navigation/src/model/types.ts:117-125`, `apps/docs/src/widgets/navbar/ui/nav-entry.tsx:1-18`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` passes tests for `resolveActiveTab` memoization and `useTabItemHref` returning `tab.path` for non-persistent tabs and `memory.path` for persistent ones. `bun run --cwd apps/docs lint` exits 0.
  QA scenarios: happy — same input returns same object; href follows persistence rules; failure — href uses stale memory. Evidence: `.omo/evidence/task-6-navigation-remake.txt` (test output).
  Commit: Y | feat(navigation): add useTabItemHref helper and memoize tab resolution

### Wave 3 — Keepalive & UI polish

- [x] 7. Stabilize `TabView` element identity and CSS module naming
  What to do / Must NOT do: Memoize the rendered element in `TabView`: for `tab.component`, use `useMemo(() => <tab.component />, [tab.id])`; for `tab.element`, rely on stable `tabs` reference. Rename `tab-view.module.css` to `navigation.module.css` (or keep the name but merge `style.module.css` into it), update `tab-bar.tsx` and `tab-view.tsx` imports, and remove the now-unused `style.module.css`. Update the Babel `auto-clsx` plugin to skip `packages/navigation/src/model/**` files that have no sibling CSS module, or explicitly import `cx` only where needed in model files. Do not change the public `TabView` prop interface.
  Parallelization: Wave 3 | Blocked by: 5 | Blocks: 8
  References: `packages/navigation/src/ui/tab-view.tsx:1-31`, `packages/navigation/src/ui/tab-view.module.css:1-22`, `packages/navigation/src/ui/style.module.css:1-5`, `packages/navigation/src/ui/tab-bar.tsx:1-34`, `scripts/babel-plugin-auto-clsx.js:1-33`, `packages/navigation/env.d.ts:1-18`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` passes a test that renders `TabView` twice with the same `tab.id` and verifies the element identity passed to `KeepAlive` is stable. `bun run --cwd packages/navigation build` exits 0 and no `style.module.css` remains in `packages/navigation/src/ui/`.
  QA scenarios: happy — same `tab.id` yields same element object; CSS modules build correctly; failure — element identity changes between renders. Evidence: `.omo/evidence/task-7-navigation-remake.txt` (test output + build listing).
  Commit: Y | fix(navigation): memoize TabView children and consolidate CSS modules

- [x] 8. Remove unnecessary `TabBar` wrapper and improve semantics
  What to do / Must NOT do: Remove the `<span>` wrapper around each tab entry in `TabBar` so `renderItem` output is rendered directly under `<nav>`. Keep the `key` prop on the fragment/root returned by `renderItem` or default `TabItem`. Do not change the `TabBarProps` interface.
  Parallelization: Wave 3 | Blocked by: 5 | Blocks: 10
  References: `packages/navigation/src/ui/tab-bar.tsx:1-34`, `packages/navigation/src/ui/tab-item.tsx:1-29`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` passes a render test asserting that `TabBar` renders a `<nav>` with the expected number of children and no extra `<span>` wrappers. `bun run --cwd packages/navigation lint` exits 0.
  QA scenarios: happy — rendered DOM is flatter; failure — wrapper still present. Evidence: `.omo/evidence/task-8-navigation-remake.txt` (test output).
  Commit: Y | refactor(navigation): flatten TabBar DOM and remove span wrappers

### Wave 4 — Scroll restore & docs integration

- [x] 9. Move and harden `useScrollRestore` into `@muir/navigation`
  What to do / Must NOT do: Move `apps/docs/src/shared/lib/use-scroll-restore.ts` to `packages/navigation/src/model/use-scroll-restore.ts` (or `lib/`), fix the chained-rAF bug by restoring only once per activation and cancelling on cleanup, and re-export it from `packages/navigation/src/index.ts`. Delete the docs app copy and update docs imports to `@muir/navigation`. Keep the hook name unchanged.
  Parallelization: Wave 4 | Blocked by: 1 | Blocks: 10
  References: `apps/docs/src/shared/lib/use-scroll-restore.ts:1-56`, `packages/navigation/src/index.ts:1-16`, `packages/navigation/src/model/use-keep-alive-context.ts:1`, `apps/docs/src/pages/docs/ui/page.tsx:1-36`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` passes a test that mocks a scroll container and verifies `scrollTop` is restored when the keepalive active flag flips to true. `apps/docs/src/shared/lib/use-scroll-restore.ts` no longer exists. `bun run --cwd apps/docs lint` exits 0.
  QA scenarios: happy — scroll position is restored on tab reactivation; failure — chained rAF causes repeated scroll jumps. Evidence: `.omo/evidence/task-9-navigation-remake.txt` (test output).
  Commit: Y | refactor(navigation): move useScrollRestore into package and fix rAF scheduling

- [x] 10. Update docs app integration points
  What to do / Must NOT do: In `apps/docs/src/app/layouts/tab-layout/layout.tsx`, pass `max={tabs.length}` to `TabView` and add a code comment documenting the direct `@muir/navigation` FSD exception. In `apps/docs/src/widgets/navbar/ui/nav-entry.tsx`, replace inline href/active/memory logic with `useTabItemHref(tab)` and `useIsTabActive(tab.id)`. Do not change visual markup or `muir-capacitor` re-exports.
  Parallelization: Wave 4 | Blocked by: 6, 9 | Blocks: F3
  References: `apps/docs/src/app/layouts/tab-layout/layout.tsx:37-70`, `apps/docs/src/widgets/navbar/ui/nav-entry.tsx:1-18`, `.opencode/rules/file-structure.md:161-185`
  Acceptance criteria (agent-executable): `bun run --cwd apps/docs build` exits 0 and `bun run --cwd apps/docs lint` exits 0. A grep shows `useTabItemHref` in `apps/docs/src/widgets/navbar/ui/nav-entry.tsx` and `max={tabs.length}` in `apps/docs/src/app/layouts/tab-layout/layout.tsx`.
  QA scenarios: happy — docs builds and nav links still route to remembered paths; failure — build breaks or href logic regresses. Evidence: `.omo/evidence/task-10-navigation-remake.txt` (build + grep output).
  Commit: Y | refactor(docs): adopt navigation helpers and bound keepalive cache

### Wave 5 — Regression / integration tests

- [x] 11. Add model & hook regression tests
  What to do / Must NOT do: Add tests under `packages/navigation/tests/src/` mirroring the source structure: `resolve-active-tab.test.ts`, `use-tab-navigation.test.tsx`, `use-tab-memory.test.tsx`, `use-tab-path.test.tsx`, `tab-view.test.tsx`. Cover happy path, fallback, memory persistence, `_cacheKey` fallback, and stable element identity. Do not test third-party keepalive internals.
  Parallelization: Wave 5 | Blocked by: 3, 5, 6, 7 | Blocks: F1, F2
  References: `.opencode/context/core/standards/test-coverage.md:1-224`, `packages/navigation/src/model/resolve-active-tab.ts:1-28`, `packages/navigation/src/model/use-tab-navigation.ts:1-37`, `packages/navigation/src/model/use-tab-memory.ts:1-24`, `packages/navigation/src/model/use-tab-path.ts:1-30`, `packages/navigation/src/ui/tab-view.tsx:1-31`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` exits 0 with at least 12 passing tests and model files at 100% line coverage. `bun run --cwd packages/navigation lint` exits 0.
  QA scenarios: happy — all model/hook tests pass; failure — coverage below 100% for `resolve-active-tab.ts` or a hook regression is detected. Evidence: `.omo/evidence/task-11-navigation-remake.txt` (coverage report).
  Commit: Y | test(navigation): add regression tests for model logic and hooks

- [x] 12. Add combined provider integration test
  What to do / Must NOT do: Add a single integration test rendering `Router` > `TabProvider` > `TabView` with components using `useTabNavigation`, `useTabMemory`, `useIsTabActive`, and `useTabPath`, switching location and asserting correct values after each switch. Do not add E2E or browser tests.
  Parallelization: Wave 5 | Blocked by: 5, 7, 11 | Blocks: F1, F2
  References: `packages/navigation/tests/helpers/wrapper.tsx` (created in task 3), `packages/navigation/src/ui/tab-provider.tsx`, `packages/navigation/src/ui/tab-view.tsx`, `packages/navigation/src/index.ts`
  Acceptance criteria (agent-executable): `bun run --cwd packages/navigation test` passes the integration test. The test exercises at least two tab switches and one memory update.
  QA scenarios: happy — hooks behave correctly in combined rendering; failure — context wiring error causes one hook to throw or return stale data. Evidence: `.omo/evidence/task-12-navigation-remake.txt` (test output).
  Commit: Y | test(navigation): add combined provider integration test

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.

- [x] F1. Plan compliance audit
  What: Verify every finding from the draft is addressed by a todo and every todo acceptance criterion is satisfied.
  Tool/invocation: `grep -R "task-" .omo/evidence/ | wc -l` ≥ 12; read `bun run --cwd packages/navigation test` output; inspect `packages/navigation/src/index.ts` for duplicate exports.
  Pass: all evidence files exist, no orphan findings.

- [x] F2. Code quality review
  What: Run Biome check + TypeScript across the workspace.
  Tool/invocation: `bun run lint` from root; `bun run --cwd packages/navigation lint`; `bun run --cwd apps/docs lint`.
  Pass: all exit 0.

- [x] F3. Real manual QA
  What: Build and preview the docs app; verify navigation between Home/Docs/About tabs preserves remembered paths and scroll position.
  Tool/invocation: `bun run --cwd apps/docs build` then `bun run --cwd apps/docs preview`; use curl/Playwright to fetch `/docs/components/button`, click nav buttons, and assert URL returns to remembered path.
  Pass: no 404s, tab switches work, no console errors.

- [x] F4. Scope fidelity
  What: Confirm nothing from Must-NOT-have list was introduced.
  Tool/invocation: `grep -l "muir-capacitor.*navigation\|react-router\|@muir/navigation" apps/docs/src/**/*.tsx` only shows existing direct imports; no new visual style files; no new major-version changeset.
  Pass: scope boundaries respected.

## Commit strategy

### Atomic commits per wave
1. `fix(navigation): deduplicate public exports in src/index.ts`
2. `fix(navigation): preserve falsy class keys in smart-clsx`
3. `chore(navigation): add rstest test runner and shared wrapper`
4. `chore(navigation): remove redundant keepalive-for-react dev dependency`
5. `refactor(navigation): split tab provider contexts for selective subscriptions`
6. `feat(navigation): add useTabItemHref helper and memoize tab resolution`
7. `fix(navigation): memoize TabView children and consolidate CSS modules`
8. `refactor(navigation): flatten TabBar DOM and remove span wrappers`
9. `refactor(navigation): move useScrollRestore into package and fix rAF scheduling`
10. `refactor(docs): adopt navigation helpers and bound keepalive cache`
11. `test(navigation): add regression tests for model logic and hooks`
12. `test(navigation): add combined provider integration test`

### Final verification commit
13. `chore(navigation): changeset for context-split behavior` (if no major version bump).

## Success criteria
- `bun run --cwd packages/navigation build` exits 0.
- `bun run --cwd packages/navigation lint` exits 0.
- `bun run --cwd packages/navigation test` exits 0 with ≥ 14 passing tests and 100% line coverage on `src/model/resolve-active-tab.ts`.
- `bun run --cwd apps/docs build` exits 0.
- `bun run --cwd apps/docs lint` exits 0.
- No duplicate exports remain in `packages/navigation/src/index.ts`.
- Docs app `NavEntry` uses `useTabItemHref` and `useIsTabActive`; `TabLayout` passes `max={tabs.length}`.
- `useScrollRestore` is exported from `@muir/navigation` and the docs copy is deleted.
- A changeset is added describing the internal context split.
