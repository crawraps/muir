import clsx, { type ClassValue } from 'clsx'

export function createSmartClsx(styles: CSSModuleClasses) {
  function resolveComplexClassValue(value: ClassValue): ClassValue {
    if (Array.isArray(value)) return value.map(resolveComplexClassValue)
    if (typeof value === 'object' && value !== null) return Object.entries(value).reduce((prev, [key, val]) => ({ ...prev, [styles[key]]: val }), {})
    return value && styles[value?.toString()]
  }

  return (moduleClassNames: ClassValue, ...args: ClassValue[]): string => {
    return clsx(resolveComplexClassValue(moduleClassNames), args)
  }
}
