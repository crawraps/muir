# Build & Run Commands

All commands are run from the **monorepo root** using `bun` and `turbo`. Never use `bunx` or `npmx`.

## Monorepo Commands

| Command | Description |
|---|---|
| `bun install` | Install all workspace dependencies |
| `turbo run build` | Build all packages (muir → muir-capacitor → docs) |
| `turbo run dev` | Start all dev servers in watch mode |
| `turbo run test` | Run tests across all packages |
| `turbo run lint` | Lint all packages |

## Package-Scoped Commands

| Command | Description |
|---|---|
| `turbo run build --filter=muir` | Build only the muir library |
| `turbo run build --filter=muir-capacitor` | Build only the capacitor wrapper |
| `turbo run dev --filter=docs` | Start only the docs dev server |

## Per-Package Commands (from package directory)

### muir (`packages/muir/`)

| Command | Description |
|---|---|
| `bun run build` | Build library with rslib |
| `bun run dev` | Watch mode build |
| `bun run test` | Run rstest tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run lint` | Biome check |

### muir-capacitor (`packages/muir-capacitor/`)

| Command | Description |
|---|---|
| `bun run build` | Build wrapper with rslib |
| `bun run dev` | Watch mode build |
| `bun run lint` | Biome check |

### docs (`apps/docs/`)

| Command | Description |
|---|---|
| `bun run dev` | Start rsbuild dev server |
| `bun run build` | Build docs app |
| `bun run preview` | Preview built docs |
| `bun run storybook` | Start Storybook |
| `bun run build:storybook` | Build Storybook |
| `bun run lint` | Biome check |

## Formatting

- Run `bun run format` to format code with Biome

## Tests

Tests directory must follow the structure of the source being tested.
For example, if you're writing tests for `src/components/button/ui/button.tsx`, your test file would be `tests/src/components/button/button.tsx`.

## Docs

Docs directory (`apps/docs/docs/`) contains `.mdx` files for every component and beyond. When writing docs, always add interactive examples (using component import inside .mdx), short summary, a usage code examples, api reference table, customization variables.

## Known Issues

- `muir-capacitor` DTS generation may fail when running `turbo run dev` in parallel (race condition finding muir/extra declarations). The JS build succeeds; only `.d.ts` generation is affected. Leave as-is.