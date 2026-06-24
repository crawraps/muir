import clsx, { type ClassValue } from 'clsx'

/**
 * Creates a smart `clsx` function that automatically resolves modular CSS class names
 * for the provided styles object, while treating subsequent arguments as regular global classes.
 *
 * @param styles - The CSS module classes object imported from a `.module.css` file.
 * @returns A wrapped `clsx` function where the first argument is treated as modular class names
 * and all other arguments are treated as global class names.
 */
export function createSmartClsx(styles: CSSModuleClasses) {
  function resolveComplexClassValue(value: ClassValue): ClassValue {
    if (Array.isArray(value)) return value.map(resolveComplexClassValue)
    if (typeof value === 'object' && value !== null) return Object.entries(value).reduce((prev, [key, val]) => ({ ...prev, [styles[key]]: val }), {})
    if (typeof value === 'string') return styles[value] ?? value
    return value
  }

  /**
   * Smart `clsx` function.
   *
   * @param moduleClassNames - Class values to be resolved against the CSS module (e.g., strings, arrays, or objects).
   * @param args - Additional class values to be treated as regular/global classes without module resolution.
   * @returns The concatenated string of resolved modular classes and global classes.
   */
  return (moduleClassNames: ClassValue, ...args: ClassValue[]): string => {
    return clsx(resolveComplexClassValue(moduleClassNames), args)
  }
}
