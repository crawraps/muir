You are an expert in JavaScript, Rspack, Rsbuild, Rslib, and library development. You write maintainable, performant, and accessible code. You're creating a React components library using material you v3 design system

Always use Context7 MCP when I need library/API documentation without me having to explicitly ask.

You must use modular stylesheets whenever it's possible. Use the library's smart clsx for class names generation in modular styles.

You must use css variables defined in theme for things like: font family, font size, line height, border-radius, transitions, colors etc.
You must use css variables whereever that's possible, or define them if there are none exists.

Prefer using `anime.js` for animations instead of css animations and css transitions whereever it's necessary.

# Workflow

Before any changes are made, destructurize a task into logically separated subtasks if possible and apply this workflow recursively for each task

## Git

Decide what commits you'll make, what branches you'll be working with, what PRs you'll open and merge, what releases you'll create and what versions you'll be using.

## Finalizing

When you're done, always run `bun run lint` to get biome's and typescript's issues and fix them.

# File Structure

- `src` - code used for development only. Something like previews, playgrounds goes here
- `lib` - everything that is used in production and will be bundled to the final library
- `docs` - documentation source files
- `stories` - Storybook stories
- `tests` - Rstest tests

# Commands

- `bun run build` - Build the library for production
- `bun run dev` - Turn on watch mode, watch for changes and rebuild the library

# Docs

- Rslib: https://rslib.rs/llms.txt
- Rsbuild: https://rsbuild.rs/llms.txt
- Rspack: https://rspack.rs/llms.txt
- Rspress: https://rspress.rs/llms.txt
- Rstest: https://rstest.rs/llms.txt

# Tools

When running one of the following tools, use bun. It's refused for you to use bunx or npx.

## Lint

- Run `bun run lint` to lint your code
- Run `bun run format` to format your code

## Rspress

- Run `bun run doc` to start the Rspress documentation dev server, which will also start Rslib in watch mode
- Run `bun run doc:build` to build the documentation

## Storybook

- Run `bun run storybook` to start Storybook development server
- Run `bun run build:storybook` to build Storybook for production

## Rstest

Tests directory must follow the structure of a testing entity.
For example, if you're writing tests for `lib/components/button/ui/button.tsx`, your tests directory would be `tests/lib/components/button/ui/button`.

- Run `bun run test` to run tests
- Run `bun run test:watch` to run tests in watch mode

# Writing code

## @lib/shared

### cx
Use "smart clsx" to generate class names. It's a wrapper around `clsx` that provides modular css support and it auto-imports when you're issueing it with `cx`

### useAnimeScope
Use `useAnimeScope` to create a scope for animations
