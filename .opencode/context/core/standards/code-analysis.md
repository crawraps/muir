<!-- Context: standards/analysis | Priority: high | Version: 2.0-cuil | Updated: 2026-04-27 -->

# Analysis Guidelines for React/FSD Codebases

## Quick Reference

**Process**: Context → Gather → Patterns → Impact → Recommendations  
**Report Format**: Context, Findings, Patterns, Issues (🔴🟡🔵), Recommendations, Trade-offs, Next Steps  
**Be**: Thorough, Objective, Specific, Actionable  
**Checklist**: Context stated, Evidence gathered, Patterns identified, Issues prioritized, Recommendations specific, Trade-offs considered  

---

## Purpose

Framework for analyzing React 19 + FSD code, patterns, and technical issues systematically in the `cuil` library.

---

## When to Use

Reference this when:
- Analyzing component patterns across `lib/components/`
- Investigating bugs in `model/` hooks or `ui/` rendering
- Evaluating FSD layer violations (`app → components → shared`)
- Assessing code quality against Biome/Rstest validation
- Researching Material Design 3 token usage or CSS variable conventions

---

## Analysis Process

### 1. Understand Context
- What component or slice are we analyzing and why?
- What's the goal? (bug fix, refactor, new component, performance)
- What's the scope? (single component, full slice, cross-slice)
- What constraints exist? (peer deps, MD3 tokens, CSS variable API)

### 2. Gather Information
- Read relevant `ui/*.tsx`, `model/*.ts`, `index.ts` files
- Check `docs/*.mdx` for expected behavior
- Search for similar components using FSD patterns
- Review related `tests/` for coverage gaps
- Examime dependencies (`react`, `react-hook-form`, `animejs` usage)

### 3. Identify Patterns
- What's consistent across `lib/components/*/`? (segment structure, `style.module.css`, `index.ts`)
- What FSD conventions are followed? (layer imports, public API rule)
- What's inconsistent or unusual? (deep imports, cross-slice coupling)
- Are MD3 tokens used consistently?
- Is the customization layer (CSS variables) present on every component?

### 4. Assess Impact
- What breaks if we change this? (public API consumers, `basic.ts`/`form.ts`/`extra.ts` exports)
- What are the trade-offs? (bundle size, peer dep compatibility, CSS variable naming)
- What are the risks? (breaking changes, accessibility regressions)

### 5. Provide Recommendations
- What should be done and why?
- What are alternatives?
- What's the priority (P0/P1/P2)?
- Which validation gates must pass? (`bun run lint`, `bun run test`)

---

## Analysis Report Format

```markdown
## Analysis: {Topic}

**Context:** What we're analyzing and why (e.g., "Button component hover state inconsistency")

**Findings:**
- {Key finding 1}
- {Key finding 2}
- {Key finding 3}

**Patterns Observed:**
- {Pattern 1}: {Description}
- {Pattern 2}: {Description}

**Issues Identified:**
- 🔴 Critical: {Issue requiring immediate attention}
- 🟡 Warning: {Issue to address soon}
- 🔵 Suggestion: {Nice-to-have improvement}

**Recommendations:**
1. {Recommendation 1} - {Why}
2. {Recommendation 2} - {Why}

**Trade-offs:**
- {Approach A}: {Pros/Cons}
- {Approach B}: {Pros/Cons}

**Next Steps:**
- [ ] {Action 1}
- [ ] {Action 2}

**Validation:**
- [ ] `bun run lint` passes
- [ ] `bun run test` passes
- [ ] `bun run format` passes
```

---

## Common Analysis Types

### Component Analysis
- FSD segment structure (`ui/`, `model/`, `index.ts`)
- Public API surface (exports from `index.ts`)
- CSS variable customization layer present?
- `smart-clsx` (`cx`) usage correct?
- Accessibility (`role`, `aria-*`, keyboard)
- Peer dependency usage (React 19 features, `react-hook-form` integration)

### FSD Layer Analysis
- Import direction violations (`components` → `app`? `shared` → `components`?)
- Cross-slice imports within same layer
- Deep imports instead of public API (`index.ts`)
- Missing `model/` for business logic
- Logic present in `ui/` instead of `model/`

### Bug Investigation
- Reproduce with minimal Rstest case
- Identify root cause in `model/` or `ui/`
- Assess impact: which entry points affected? (`basic`, `form`, `extra`)
- Propose fix with rationale
- Consider edge cases (controlled/uncontrolled, SSR, animation states)

### Performance Analysis
- Bundle size impact (Rslib output)
- CSS variable computation overhead
- Animation performance (`anime.js` vs CSS transitions)
- Re-render patterns (React 19 compiler optimization)
- Peer dependency duplication risks

### Documentation Completeness
- `docs/*.mdx` exists for every exported component?
- Interactive examples present?
- API reference table includes all props?
- Customization CSS variables documented?
- Accessibility section present?

---

## Best Practices

### Be Thorough
- Check multiple component examples (`Button`, `Checkbox`, `Modal`)
- Consider edge cases (empty children, controlled vs uncontrolled)
- Look for exceptions to patterns (why is this slice different?)
- Verify assumptions with `tests/` coverage

### Be Objective
- Base conclusions on evidence (code snapshots, Biome output, Rstest results)
- Avoid assumptions about user behavior
- Consider multiple perspectives (consumer, contributor, maintainer)
- Acknowledge limitations (peer dep version constraints)

### Be Specific
- Provide concrete file paths (`lib/components/button/ui/button.tsx`)
- Include line number references when possible
- Show code snippets with ✅ and ❌ markers
- Quantify when possible (bundle size in kb, test coverage %)

### Be Actionable
- Clear recommendations with priority
- Link to relevant standards (`code-quality.md`, `file-structure.md`)
- Include validation steps (`bun run lint`, `bun run test`)
- Suggest next steps with assignee if applicable

---

## FSD-Specific Checklist

When analyzing any slice or component, verify:

- [ ] `index.ts` exports public API only
- [ ] `ui/` contains no business logic (moved to `model/`)
- [ ] Imports use absolute paths for cross-slice (`@/lib/components/*`)
- [ ] No imports from higher FSD layers
- [ ] CSS variables defined on component root for customization
- [ ] `style.module.css` present in `ui/`
- [ ] Component uses function declaration (not arrow function)
- [ ] Props destructured minimally (prefer `...props`)
- [ ] Custom attributes (`attributify`/`atr`) over class name concatenation

---

**Process**: Context → Gather → Patterns → Impact → Recommendations.
