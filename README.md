<div align="center"><img width="128" height="128" alt="icon" src="https://github.com/user-attachments/assets/92ae87a2-18b5-455a-82de-63eeda6175f7" /></div>
<div align="center"><h1>muir</h1></div>
<div align="center">Material UI Expressive style components with a bit of Reimagination ✨</div>

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
