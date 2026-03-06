Do not import React from 'react' where it's not necessary

## File Structure

- `src` - code used for development only. Something like previews, playgrounds goes here
- `lib` - everything that is used in production and will be bundled to the final library
- `docs` - documentation source files
- `stories` - Storybook stories
- `tests` - Rstest tests

## Commands

- `bun run build` - Build the library for production
- `bun run dev` - Turn on watch mode, watch for changes and rebuild the library

## Docs

- Rslib: https://rslib.rs/llms.txt
- Rsbuild: https://rsbuild.rs/llms.txt
- Rspack: https://rspack.rs/llms.txt
- Rspress: https://rspress.rs/llms.txt
- Rstest: https://rstest.rs/llms.txt

## Tools

### Lint

- Run `bun run lint` to lint your code
- Run `bun run format` to format your code

### Rspress

- Run `bun run doc` to start the Rspress documentation dev server, which will also start Rslib in watch mode
- Run `bun run doc:build` to build the documentation

### Storybook

- Run `bun run storybook` to start Storybook development server
- Run `bun run build:storybook` to build Storybook for production

### Rstest

Tests directory must follow the structure of a testing entity.
For example, if you're writing tests for `lib/components/button/ui/button.tsx`, your tests directory would be `tests/lib/components/button/ui/button`.

- Run `bun run test` to run tests
- Run `bun run test:watch` to run tests in watch mode
