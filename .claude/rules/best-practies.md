# Best practice

There are a bunch of tools preconfigured and available for use in this repository.
Each of them must be used in the way described below.

## Context7

Use Context7 MCP when you need library/API documentation, setup or configuration steps without me having to explicitly ask.

## Styling

### Modularity

Use modular stylesheets whenever it's possible.

### Smart clsx

There is a "smart-clsx" function available. It's a wrapper around `clsx` that provides CSS Modules support.
By default each `.tsx` file has `cx` function auto-imported: this is a "smart-clsx" instance that's utilizing `./style.module.css` stylesheet.
The documentation of this function is available in `./docs/utilities/smart-clsx.mdx`.

### CSS Variables

You must use css variables defined in theme for things like: font family, font size, line height, border-radius, transitions, colors etc.
You must use css variables whereever that possible, or define them in there are none exist.

## Auto-imports

There are several commonly used imports that are auto-imported and must not be imported manually.
The list of imports is available in `auto-imports.d.ts` and it's being generated dynamically.

## Animations

Use `anime.js` for animations instead of css animations. Utilize `lib/shared/anime-scope` for modular selectors.
Some simple transitions still could be created using css transitions.
Use defined in theme animation variables for both anime.js animations and css transitions.
