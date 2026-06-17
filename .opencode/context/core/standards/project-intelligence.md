<!-- Context: standards/intelligence | Priority: high | Version: 1.0-cuil | Updated: 2026-04-27 -->

# Project Intelligence

> **What**: Living documentation that bridges business domain and technical implementation for `cuil`.
> **Why**: Quick project understanding and onboarding for developers, agents, and stakeholders.
> **Where**: `.opencode/context/project-intelligence/` (dedicated folder) and `.opencode/rules/` (process conventions)

## Quick Reference

| What You Need | File | Description |
|---------------|------|-------------|
| Understand the "why" | `business-domain.md` | Problem, users, value (create if missing) |
| Understand the "how" | `technical-domain.md` | Stack, architecture, FSD patterns |
| See the connection | `business-tech-bridge.md` | Business → technical mapping (create if missing) |
| Know the context | `decisions-log.md` | Why decisions were made (create if missing) |
| Current state | `living-notes.md` | Active issues, debt, questions (create if missing) |
| Process rules | `.opencode/rules/*.md` | Workflow, file structure, tools, git, best practices |

## Why This Exists

Projects fail when:
- Business intent is lost in code
- Technical decisions aren't documented with context
- New members spend weeks instead of hours understanding the project
- Context lives only in people's heads (who leave)

This ensures **business and technical domains speak the same language**.

## Structure

```
.opencode/context/
├── project-intelligence/              # Project-specific context
│   ├── navigation.md                  # Quick overview & routes
│   ├── technical-domain.md            # Stack, architecture, decisions
│   ├── business-domain.md             # Business context, problems solved
│   ├── business-tech-bridge.md        # How business needs → solutions
│   ├── decisions-log.md               # Decisions with rationale
│   └── living-notes.md                # Active issues, technical debt
├── core/
│   └── standards/                     # Universal standards (this directory)
│       ├── code-quality.md
│       ├── test-coverage.md
│       ├── documentation.md
│       ├── security-patterns.md
│       ├── navigation.md
│       ├── project-intelligence.md    # This file
│       └── project-intelligence-management.md
└── rules/                             # Process conventions
    ├── workflow.md
    ├── file-structure.md
    ├── tools.md
    ├── git.md
    └── best-practies.md
```

## Onboarding Checklist

For new team members or agents:

- [ ] Read `.opencode/context/project-intelligence/navigation.md`
- [ ] Read `.opencode/context/project-intelligence/technical-domain.md` to understand the "how"
- [ ] Read `.opencode/context/core/standards/code-quality.md` for coding standards
- [ ] Review `.opencode/rules/workflow.md` for validation gates
- [ ] Review `.opencode/rules/file-structure.md` for FSD conventions
- [ ] Review `.opencode/rules/best-practies.md` for code style
- [ ] Check `.opencode/rules/git.md` for branch and commit conventions
- [ ] Explore codebase with this context loaded

## How to Keep This Alive

| Trigger | Action |
|---------|--------|
| Business direction shifts | Update `business-domain.md` |
| New technical decision | Add to `decisions-log.md` |
| New issues or debt | Update `living-notes.md` |
| Feature launch | Update `business-tech-bridge.md` |
| Stack changes | Update `technical-domain.md` |
| Rules change | Update `.opencode/rules/*.md` |

**Full Management Guide**: See `.opencode/context/core/standards/project-intelligence-management.md`

## Integration with Context System

- **Lazy Loading**: Load project intelligence first when joining a project
- **Layering**: Then load standards and specific context as needed
- **Reference**: See `.opencode/context/core/standards/navigation.md` for loading order

## Related Files

- **Management Guide**: `.opencode/context/core/standards/project-intelligence-management.md`
- **Loading Order**: `.opencode/context/core/standards/navigation.md`
- **Standards Index**: `.opencode/context/core/standards/navigation.md`
