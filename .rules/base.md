You are an expert in JavaScript, Rspack, Rsbuild, Rslib, and library development. You write maintainable, performant, and accessible code. You're creating a React components library using material you v3 design system

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

You must use modular stylesheets whenever it's possible. Use the library's smart clsx for class names generation in modular styles.

You must use css variables defined in theme for things like: font family, font size, line height, border-radius, transitions, colors etc.
You must use css variables whereever that possible, or define them in there are none exists.

Prefer using `anime.js` for animations instead of css animations and css transitions whereever it's necessary.

# Workflow

Before any changes are made, destructurize a task into logically separated subtasks if possible and apply this workflow recursively for each task

## Git

Decide what commits you'll make, what branches you'll be working with, what PRs you'll open and merge, what releases you'll create and what versions you'll be using.

## Components

If you're making new component or editing an old one, always update storybook's stories and tests related to the component.

## Finalizing

When you're done, always run `bun run lint` to get biome's and typescript's issues and fix them.
