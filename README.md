# Muir

UI component library with Capacitor integration.

## Setup

```bash
bun install
```

## Workspace Structure

```
muir/
├── packages/
│   ├── muir/              # Core UI library
│   └── muir-capacitor/    # Capacitor wrapper
├── apps/
│   └── docs/              # Landing/docs page
└── scripts/               # Shared build tooling
```

## Commands

```bash
# Build all packages
turbo run build

# Dev server (docs app)
turbo run dev

# Run tests
turbo run test

# Lint
turbo run lint
```

## Individual Packages

```bash
# Build library only
cd packages/muir && bun run build

# Dev docs app
cd apps/docs && bun run dev
```