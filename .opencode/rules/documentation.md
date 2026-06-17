# Documentation Rules

Agnostic set of rules for writing documentation about any instrument — function, utility, hook, tool, class, module, or service.
For component `.mdx` docs, see `documentation-components.md`.

---

## Philosophy: "How to Use" Over "How It Works"

Documentation answers **"what can I do with this?"** before **"how does this work?"**

- Show the external contract, not the internal implementation
- Code examples show real usage, not abstract signatures
- The first example is the simplest possible working usage
- Edge cases and advanced features come **after** basic usage
- Implementation details are included only as concise reference, never as deep dives

---

## Structure

Every instrument doc follows this section order. Skip sections that don't apply.

1. **Title** — H1 with the instrument name
2. **One-line purpose** — What the instrument is for
4. **Usage** — Code examples showing how to USE the instrument in practice
5. **Behavior** — Edge cases and mapping tables (input → result)
6. **API / Signature** — The public interface: function signatures, parameters, return types
7. **Agent rules** — Numbered dos and don'ts for AI agents

There also should be a frontmatter section with the following info:

- **source** — File path (e.g. `src/shared/smart-clsx.ts`, `src/components/button`)
- **extends** — List of other instrument that this one extends

### When to skip sections

- No source? Skip it.
- No edge cases? Skip Behavior.
- No dos/don'ts? Skip Rules.
- Never skip Title, One-line purpose, Usage, or API.

---

## Frontmatter fields

### source

When the instrument has a single source file, link it:

```md
---
source: src/shared/smart-clsx.ts
---
```

Paths are relative to the package root (`packages/muir/` for the library).

### extends

When the instrument extends another instrument, list them:

```md
---
extends:
  - button
  - input
---
```

## Title

- H1 heading with the instrument name
- Match the exported name exactly (e.g., `# smart-clsx`, not `# Smart Clsx Utility`)

```md
# smart-clsx
```

---

## One-Line Purpose

One sentence. Describe what the instrument is **for**, not how it's built.

```md
# cx

Wraps `clsx` with CSS Modules support. The first argument resolves through the CSS Modules map; all subsequent arguments pass through as global class names.
```

Wrong:

```md
# cx

A function that takes a styles object and returns a bound clsx function that resolves class names against the CSS Modules map using a recursive resolver.
```

That's how it works, not what it's for.

---

## Usage

Code examples come **before** explanations. Organize by common scenarios, simplest first.

### Rules for usage examples

- The **first example** must be the most basic working usage
- Each example has a **code block** followed by a **one-line comment** explaining the pattern
- Show the common case first, then variations
- Use realistic values, not `foo`, `bar`, `baz`
- Import paths must match what consumers actually use (e.g., `import { Switch } from 'muir/basic'`)

```md
### Usage Patterns

\`\`\`tsx
// Single modular class + consumer passthrough
<span className={cx('root', className)} />

// Multiple modular classes
<span className={cx('root track')} />

// Conditional modular classes (object)
<span className={cx({ active: isActive, error: hasError })} />
\`\`\`
```

---

## Behavior

Present edge cases and input/output mappings as **tables**, not prose.

```md
### Behavior Details

| Input | Result |
|---|---|
| `cx('nonexistent')` | `styles['nonexistent']` is `undefined` — silently dropped |
| `cx(null)` / `cx(undefined)` | Handled by `clsx` — skipped in output |
| `cx({ active: true })` | Resolves `active` through CSS Modules first |
```

- **Never** write paragraphs to explain what a table can show
- If there are no edge cases, skip this section

---

## API

Document the public interface. What you can call, pass, or configure.

For functions:

```md
### Signature

\`\`\`ts
function createSmartClsx(styles: CSSModuleClasses): (moduleClassNames: ClassValue, ...args: ClassValue[]) => string
\`\`\`
```

For utilities with simple APIs, a signature is enough. For complex APIs, use a table:

```md
| Parameter | Type | Default | Description |
|---|---|---|---|
| `styles` | `CSSModuleClasses` | — | CSS Modules class map |
| `moduleClassNames` | `ClassValue` | **required** | First arg: resolved against CSS Modules |
| `args` | `ClassValue[]` | `[]` | Remaining args: passed to `clsx` as-is |
```

### Extending

If the instrument extends another instrument, provide a link to the parent instrument in the table:

```md
| Parameter | Type | Default | Description |
|---|---|---|---|
| `active` | `boolean` | **required** | controls whether the button is toggled |
| ... | ... | ... | extends [button](./button#API) |
```

---

## Agent rules

Numbered dos and don'ts for an AI agents primarily. Concise. Absolute.

```md
### Rules

1. Never use string interpolation for classes: `` `root ${className}` ``
2. Never use `cx` with conditional objects for boolean state — use `atr` instead
3. Always let the Babel plugin handle `cx` auto-import
4. First argument = CSS Module keys; remaining arguments = global class names
```

- Use `never`, `always`, `must` for absolute rules
- Keep each rule to a single line
- Show wrong examples only when the wrong pattern is a **common mistake**

---

## Division of Labor (When Applicable)

When multiple instruments serve related but different concerns, add a comparison table:

```md
| Concern | Tool | Mechanism |
|---|---|---|
| Structural classes | `cx` | CSS Module keys → hashed selectors |
| Boolean state | `atr` | `is-*` attributes → CSS `[is-*]` selectors |
```

Only include this when there's a real risk of confusion between instruments (not the example case).

---

## Tone

- Direct and imperative ("Use `atr` for boolean state", not "You can use `atr` for boolean state")
- No hedging ("might", "could", "perhaps")
- No tutorials or walkthroughs — this is reference documentation
- Technical terms are fine — the audience is developers using this project

---

## Anti-Patterns

- Writing paragraphs when a table communicates faster
- Showing implementation code (internals) before usage examples
- Starting with architecture or design rationale
- Using abstract examples (`foo`, `bar`) when realistic ones are possible
- Explaining how something works internally when the external contract is enough
- Duplicating information across sections — each point appears once