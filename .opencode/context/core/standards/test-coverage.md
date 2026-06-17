<!-- Context: standards/tests | Priority: critical | Version: 2.0-cuil | Updated: 2026-04-27 -->

# Testing Standards

## Quick Reference

**Golden Rule**: If you can't test it easily, refactor it  
**Runner**: Rstest (0.8) + happy-dom (20.6) + Testing Library  
**File Structure**: Tests in `tests/lib/{component}/{name}.tsx` — e.g. `tests/lib/button/button.tsx`  
**Test Wrapper**: Use shared `Wrapper` from `tests/helpers/wrapper.tsx` — provides `ThemeProvider` context  
**Imports**: Use barrel `@/lib` for all component and provider imports  

**Test** (✅ DO):
- Happy path, edge cases, error cases
- `model/` logic, `ui/` component rendering, public APIs

**Don't Test** (❌ DON'T):
- Third-party library internals (React, anime.js, react-hook-form)
- Simple CSS class application (covered by integration)
- Private utility details already tested via public API

**Coverage**: Critical (100%), High (90%+), Medium (80%+)

**Commands**:
- `bun run test`      → run suite
- `bun run test:watch` → watch mode

---

## Principles

**Test behavior, not implementation**: Focus on what the component/model does, not how it's structured internally  
**Keep tests simple**: One conceptual assertion per test, clear names, minimal setup  
**Independent tests**: No shared global state, run in any order  
**Fast and reliable**: Quick execution, no flaky tests, deterministic with happy-dom

---

## Test File Structure (AAA Pattern)

```ts
// Example: tests/lib/button/button.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/lib'
import { Wrapper } from '../../helpers/wrapper'

describe('Button', () => {
  test('renders with default variant', () => {
    // Arrange - Set up props/environment
    const props = { children: 'Click me' };

    // Act - Render or execute
    render(<Button {...props} />, { wrapper: Wrapper });

    // Assert - Verify DOM or output
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('applies disabled state correctly', () => {
    render(<Button disabled>Submit</Button>, { wrapper: Wrapper });
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## Directory Mirroring Rule

Tests must follow the structure of the tested entity:

```
lib/components/button/ui/button.tsx    → tests/lib/button/button.tsx
lib/components/form/model/useForm.ts   → tests/lib/form/useForm.ts
src/widgets/header/ui/header.tsx       → tests/src/widgets/header/ui/header/index.test.tsx
```

Why? Ensures 1:1 mapping between source and tests for discoverability.

---

## What to Test

### ✅ DO Test
- **Happy path**: Normal component usage, default props
- **Edge cases**: Empty arrays, zero values, `null`/`undefined` props
- **Error cases**: Invalid prop combinations, failed state transitions
- **Business logic**: `model/` functions, custom hooks, transformations
- **Public APIs**: Component render output, exported utilities
- **Accessibility**: `role`, `aria-*`, keyboard interactions
- **Customization layer**: CSS variables applied correctly

### ❌ DON'T Test
- Third-party library internals (React rendering pipeline, anime.js timelines)
- Framework boilerplate (JSX transform, module resolution)
- Simple getters/setters (auto-generated accessors)
- Private implementation details (internal helper not exported)
- CSS pixel-perfect rendering (use visual regression, not unit tests)

---

## Coverage Goals

| Priority | Target | Examples |
|----------|--------|----------|
| Critical | 100% | `model/` logic, data transformations, custom hooks |
| High     | 90%+ | Component rendering, public API surfaces, form validation |
| Medium   | 80%+ | Utility functions, `lib/` helpers, `config/` |
| Low      | Optional | Storybook stories, demo pages, `.mdx` documentation |

---

## Testing Pure Functions

```ts
// lib/components/counter/model/calculate.ts
function calculateTotal(items: Array<{ price: number; quantity: number }>) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// tests/lib/counter/calculate.ts
describe('calculateTotal', () => {
  test('returns sum of item prices with quantities', () => {
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 }
    ];
    expect(calculateTotal(items)).toBe(250);
  });

  test('returns 0 for empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('handles zero quantity', () => {
    expect(calculateTotal([{ price: 100, quantity: 0 }])).toBe(0);
  });
});
```

---

## Testing React Components (Rstest + Testing Library)

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Checkbox } from '@/lib'
import { Wrapper } from '../../helpers/wrapper'

describe('Checkbox', () => {
  test('toggles checked state on click', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange}>Accept terms</Checkbox>, { wrapper: Wrapper });

    fireEvent.click(screen.getByRole('checkbox'));

    expect(handleChange).toHaveBeenCalledWith(true);
  });

  test('respects controlled checked prop', () => {
    const { rerender } = render(<Checkbox checked={false} />, { wrapper: Wrapper });
    expect(screen.getByRole('checkbox')).not.toBeChecked();

    rerender(<Checkbox checked={true} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
```

---

## Testing Custom Hooks

```ts
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/lib'
import { Wrapper } from '../../helpers/wrapper'

describe('useCounter', () => {
  test('increments count', () => {
    const { result } = renderHook(() => useCounter(0), { wrapper: Wrapper });

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

---

## Test Naming

```ts
// ✅ Good: Descriptive, clear expectation
test('calculateDiscount returns 10% off for premium users', () => {});
test('validateEmail returns false for invalid format', () => {});
test('Button throws error when both href and onClick are provided', () => {});

// ❌ Bad: Vague, unclear
test('it works', () => {});
test('test user', () => {});
```

---

## Best Practices

✅ Test one thing per test (conceptually)  
✅ Use descriptive test names  
✅ Keep tests independent (no shared `let` state)  
✅ Mock external dependencies (anime.js, API calls)  
✅ Test edge cases and errors  
✅ Make tests readable (avoid complex setup in `beforeAll`)  
✅ Run tests frequently (`bun run test:watch` during dev)  
✅ Fix failing tests immediately before continuing  
✅ Prefer `screen` queries over rendered container  
✅ Use `fireEvent` for user interactions, `userEvent` for complex flows  

---

**Golden Rule**: If you can't test it easily, refactor it.
