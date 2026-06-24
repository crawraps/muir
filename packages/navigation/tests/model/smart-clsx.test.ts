import { describe, expect, test } from '@rstest/core'
import { createSmartClsx } from '../../src/shared/smart-clsx'

describe('createSmartClsx', () => {
  test('preserves falsy string keys (0 and empty string)', () => {
    const styles = { '0': 'hashed0', active: 'hashed-active', root: 'hashed-root' }
    const clsx = createSmartClsx(styles)

    expect(clsx('0', 'global')).toBe('hashed0 global')

    const emptyClsx = createSmartClsx({})
    expect(emptyClsx('')).toBe('')
  })

  test('resolves object with active: true to hashed class', () => {
    const styles = { active: 'hashed-active' }
    const clsx = createSmartClsx(styles)
    expect(clsx({ active: true })).toBe('hashed-active')
  })

  test('resolves array with string and object', () => {
    const styles = { root: 'hashed-root', active: 'hashed-active' }
    const clsx = createSmartClsx(styles)
    expect(clsx(['root', { active: false }])).toBe('hashed-root')
  })

  test('handles multiple global classes', () => {
    const styles = { active: 'hashed-active' }
    const clsx = createSmartClsx(styles)
    expect(clsx({ active: true }, 'global1', 'global2')).toBe('hashed-active global1 global2')
  })

  test('handles nested arrays', () => {
    const styles = { a: 'hashed-a', b: 'hashed-b' }
    const clsx = createSmartClsx(styles)
    expect(clsx([['a', 'b'], 'c'])).toBe('hashed-a hashed-b c')
  })

  test('passes unresolvable string keys through as global classes', () => {
    const styles = {}
    const clsx = createSmartClsx(styles)
    expect(clsx('unknown-key', 'global')).toBe('unknown-key global')
  })
})
