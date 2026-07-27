<div align="center"><img width="128" height="128" alt="logo" src="https://github.com/user-attachments/assets/1db85821-4358-411a-9b6a-9c081bba7f20" /></div>
<div align="center"><h1>𝚖𝚞𝚒𝚛</h1></div>
<div align="center">Material UI Expressive style components with a bit of Reimagination ✨</div>

<div>*currently in pre-alpha</div>

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
