<!-- Context: standards/intelligence-mgmt | Priority: high | Version: 1.0-cuil | Updated: 2026-04-27 -->

# Project Intelligence Management

## Purpose

How to create, update, and maintain project intelligence files for `cuil` so they remain accurate and useful.

---

## File Lifecycle

### Creation
- **Navigation**: Always create first when starting a new context directory
- **Technical Domain**: Create after tech stack is settled
- **Business Domain**: Create after project goals are defined
- **Decision Log**: Add entries as architectural choices are made
- **Living Notes**: Create once project is in active development
- **Rules**: Evolve alongside codebase conventions

### Updates
| Trigger | Files to Update |
|---------|----------------|
| React version bump | `technical-domain.md`, `decisions-log.md` |
| New component exported | `technical-domain.md`, `.opencode/rules/file-structure.md` |
| Build tool change | `technical-domain.md`, `decisions-log.md` |
| CI pipeline change | `.opencode/rules/workflow.md` |
| New lint rule | `.opencode/rules/best-practies.md` |
| Deprecation | `living-notes.md`, component docs |

### Deprecation
- Mark outdated sections with `⚠️ DEPRECATED: <reason>`
- Remove after 2 major versions or 6 months
- Never delete without checking if other files reference it

---

## Writing Guidelines

### Voice
- **Factual**: "The library exports three entry points" not "We decided to have three entry points"
- **Concise**: Prefer tables and lists over paragraphs
- **Scannable**: Use headers, bullet points, and code blocks

### Structure
```markdown
<!-- Context: <name> | Priority: <critical|high|medium> | Version: X.Y | Updated: YYYY-MM-DD -->

# Title

> **What**: One-line summary
> **Why**: Why this matters
> **Where**: File path reference

## Quick Reference
(Summary table or bullet list)

## Details
(Sections with code examples, architecture diagrams, tables)

## Related
- Link to related files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status: Current | MVI: <compliance info>
```

### Versioning
- Increment minor (X.Y → X.Y+1) for additions and clarifications
- Increment major (X.Y → X+1.0) for breaking changes to conventions
- Always update `Updated` date on any change

---

## MVI Compliance

**MVI = Minimum Viable Intelligence**

Every file should:
- [ ] Start with a frontmatter comment (context, priority, version, updated)
- [ ] Have a "Quick Reference" section in the first 20% of the file
- [ ] Include at least one code example if discussing code patterns
- [ ] Link to related files in a "Related" footer
- [ ] Stay within 200 lines maximum
- [ ] Use standardized headers and formatting

If a file exceeds 200 lines, consider splitting into multiple files with a navigation index.

---

## Review Checklist

Before finalizing a context file:

- [ ] Factually accurate (tested against codebase)
- [ ] Links to related files are valid
- [ ] Code examples compile or are syntactically correct
- [ ] No TODO items left unresolved
- [ ] Version and date updated
- [ ] Written for the target audience (developers, agents, stakeholders)

---

## Automation

**Not yet enforced**, but recommended:
- [ ] Check for dead links between context files
- [ ] Validate code examples with `tsc --noEmit`
- [ ] Ensure all TODOs in `living-notes.md` are tracked

---

## Related Files

- **Intelligence Overview**: `.opencode/context/core/standards/project-intelligence.md`
- **Navigation**: `.opencode/context/core/standards/navigation.md`
- **Technical Domain**: `.opencode/context/project-intelligence/technical-domain.md`
