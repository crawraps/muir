<!-- Context: standards/security | Priority: high | Version: 2.0-cuil | Updated: 2026-04-27 -->

# Security Patterns for Component Libraries

## Quick Reference

**Scope**: Client-side component library (`cuil`) — no server, no auth, no secrets  
**Concerns**: Peer dependency validation, prop sanitization, CSS isolation, XSS prevention  

**ALWAYS**: Validate peer dependency versions, sanitize dynamic props, avoid `dangerouslySetInnerHTML`  
**NEVER**: Expose internal variables in CSS, trust unvalidated `href` values, skip peer dep checks  

---

## 1. Component Props & XSS Prevention

**Strict Typing**:
- All component props must use strict TypeScript interfaces (no `any`)
- Never pass unvalidated strings into `dangerouslySetInnerHTML`
- Never interpolate user input directly into component children without sanitization

```tsx
// ✅ Correct: Strict interface, no raw HTML
interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'filled' | 'outlined' | 'text';
}

// ❌ Forbidden: any allows unsafe values
interface UnsafeProps {
  html: any;
}
```

**Link Validation**:
- When `href` is used, validate it's a safe URL (not `javascript:`)
- Prefer relative URLs or validated external URLs

```tsx
function isSafeUrl(href: string): boolean {
  if (!href) return true;
  try {
    const url = new URL(href, window.location.origin);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}
```

---

## 2. CSS Variable Isolation

**Customization Layer Security**:
- CSS variables are the public customization API
- Internal variables must be prefixed or scoped to prevent leakage
- Never expose internal state via CSS custom properties that could be manipulated externally

```css
/* ✅ Correct: Clear public/private separation */
.button {
  /* Public API — user can override */
  --height: 2.5rem;
  --shape: var(--md-sys-shape-corner-full);
  --gap: 0.5rem;

  /* Internal implementation */
  display: flex;
  align-items: center;
}

.button:hover {
  /* Internal state, not a variable */
  background-color: var(--md-sys-color-primary-hover);
}
```

**No Global Style Pollution**:
- Use CSS Modules to scope styles to components
- Avoid global selectors (`*`, `body`, `html`) in component styles

---

## 3. Peer Dependency Validation

**Why**: As a library, `cuil` depends on peer deps (`react`, `react-dom`, `react-hook-form`, `yup`, `animejs`). Version mismatches can cause runtime errors.

```json
// package.json peerDependencies
"peerDependencies": {
  "react": "^>=19.0.0 <20.0.0",
  "react-dom": "^>=19.0.0 <20.0.0"
}
```

**Rules**:
- Document minimum supported peer dep versions in `docs/`
- Use `peerDependenciesMeta` for optional peers (e.g., `react-hook-form` for `cuil/form`)
- Test peer dep minimums in CI (Rstest with matrix)

---

## 4. Input Sanitization Helpers

**`attributify` Utility**:
- Use `atr` (exported from `lib/shared/attributify`) for custom boolean attributes
- This avoids class-injection attacks by using attributes instead of concatenated class names

```tsx
import { atr } from '@/lib/shared/attributify';

// ✅ Correct: Attribute-based, safe
function Badge({ highlight, ...props }: BadgeProps) {
  return <span is-highlight={atr(highlight)} ... />;
}

// ❌ Forbidden: Concatenating classes with user input
function Badge({ variant }) {
  return <span className={`badge-${variant}`} ... />;
}
```

**`clsx` via `smart-clsx`**:
- `cx` is auto-imported in every `.tsx` file
- Use only for combining known, hardcoded class names from CSS Modules
- Never pass user input directly to `cx` without validation

---

## 5. Animation Safety

**`anime.js` Scope**:
- Use `lib/shared/anime-scope` for modular selectors
- Never select elements by raw class names that could collide with user classes
- Scope anime.js targets to component-specific selectors

```tsx
// ✅ Correct: Scoped selector
import { animeScope } from '@/lib/shared/anime-scope';

const scope = animeScope('modal');
anime({ targets: scope.get('.backdrop'), opacity: [0, 1] });

// ❌ Forbidden: Global selector, collision risk
anime({ targets: '.backdrop', opacity: [0, 1] });
```

---

## 6. Form Security

**`react-hook-form` Integration** (`cuil/form`):
- Always use resolvers (`yup`, `zod`) for schema validation
- Never trust client-side validation alone (backend must re-validate)
- Sanitize form field names to prevent DOM attribute injection

```tsx
// ✅ Correct: Schema validation with yup
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
});

function ContactForm() {
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema)
  });
  // ...
}
```

---

## 7. File System & Build Safety

**No Path Traversal**:
- `cuil` doesn't serve files, but build tools (Rsbuild/Rslib) must validate paths
- Ensure `public/` and `static/` directories don't expose source files

**Dependency Pinning**:
- Pin dev dependencies in `bun.lockb` for reproducible builds
- Regularly audit with `bun audit` for known vulnerabilities
- Keep peer deps flexible but within tested ranges

---

## Best Practices Summary

✅ Strict TypeScript interfaces — no `any`  
✅ Validate `href` and dynamic URLs  
✅ Use `atr` for boolean attributes (avoids class injection)  
✅ Scope anime.js selectors to component  
✅ CSS Modules prevent global pollution  
✅ Peer dep version ranges documented  
✅ Form validation via schema resolvers  
✅ Avoid `dangerouslySetInnerHTML`  

❌ Never concatenate user input into class names  
❌ Never expose internal CSS variables as public API  
❌ Never use global anime.js selectors  
❌ Never skip peer dep version checks on breaking React releases  
