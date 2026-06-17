<!-- Context: core/navigation | Priority: critical | Version: 1.0 | Updated: 2026-04-27 -->

# Core Standards & Project Navigation

**Purpose**: Unified navigation for `cuil` — React 19 component library with FSD architecture, Material Design 3, and Rslib/Rsbuild tooling.

---

## Loading Strategy

**For code implementation**:
1. Load `code-quality.md` (critical)
2. Load `security-patterns.md` (high)
3. Load project rules: `.opencode/rules/workflow.md`, `.opencode/rules/best-practies.md`, `.opencode/rules/file-structure.md`

**For testing**:
1. Load `test-coverage.md` (critical)
2. Load `code-quality.md` (high)
3. Load `.opencode/rules/tools.md` for Rstest conventions

**For documentation**:
1. Load `documentation.md` (critical)
2. Load `.opencode/rules/tools.md` for MDX/Storybook conventions

**For code review**:
1. Load `code-quality.md` (critical)
2. Load `security-patterns.md` (high)
3. Load `test-coverage.md` (high)
4. Load `.opencode/rules/git.md` for commit conventions

**For project onboarding/understanding**:
1. Load `project-intelligence.md` (high)
2. Load `.opencode/context/project-intelligence/navigation.md` for full project context
3. Load `.opencode/context/project-intelligence/technical-domain.md` for tech stack

---

## Standards Files (This Directory)

| File | Topic | Priority | Load When |
|------|-------|----------|-----------|
| `code-quality.md` | Code quality rules for React/TypeScript/FSD | ⭐⭐⭐⭐⭐ | Writing/reviewing code |
| `test-coverage.md` | Testing standards (Rstest, happy-dom, Testing Library) | ⭐⭐⭐⭐⭐ | Writing tests |
| `documentation.md` | Documentation rules (Storybook MDX, API tables) | ⭐⭐⭐⭐ | Writing docs |
| `security-patterns.md` | Security best practices for component libraries | ⭐⭐⭐⭐ | Security review, peer deps |
| `project-intelligence.md` | What and why — project context overview | ⭐⭐⭐⭐ | Onboarding, understanding |
| `project-intelligence-management.md` | How to manage intelligence files | ⭐⭐⭐ | Managing intelligence files |
| `code-analysis.md` | Analysis approaches for React/FSD codebases | ⭐⭐⭐ | Analyzing code, debugging |

## Project Rules (Reference, Not Standards)

| File | Topic |
|------|-------|
| `.opencode/rules/workflow.md` | Validation gates (`bun run lint/format/test`), CI rules |
| `.opencode/rules/file-structure.md` | FSD layer hierarchy, segment structure, import rules |
| `.opencode/rules/tools.md` | Tool usage: Biome, Rstest, Storybook MDX conventions |
| `.opencode/rules/git.md` | Branch strategy, conventional commits |
| `.opencode/rules/best-practies.md` | Code style: `smart-clsx`, `attributify`/`atr`, destructuring, hooks |

## Project Intelligence (Reference)

| File | Topic |
|------|-------|
| `.opencode/context/project-intelligence/navigation.md` | Project overview and quick routes |
| `.opencode/context/project-intelligence/technical-domain.md` | Tech stack, architecture, patterns |

---

## Related
- **Project Intelligence** → `.opencode/context/project-intelligence/navigation.md`
- **Project Rules** → `.opencode/rules/` directory
- **Development Principles** → `../development/principles/` (if exists)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: Aligned with cuil project conventions (2026-04-27)
