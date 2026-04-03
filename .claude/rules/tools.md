# Tools

When running one of the following tools, you must use `bun`, no `bunx` or `npmx` allowed.

## Lint

- Run `bun run lint` to lint your code
- Run `bun run format` to format your code

## Rstest

Tests directory must follow the structure of a testing entity.
For example, if you're writing tests for `lib/components/button/ui/button.tsx`, your tests directory would be `tests/lib/components/button/ui/button`.

- Run `bun run test` to run tests
- Run `bun run test:watch` to run tests in watch mode

## Docs

Docs directory contains `.mdx` files for every component and beyond. When writing docs, always add interactive examples (using component import inside .mdx), short summary, a usage code examples, api reference table.
