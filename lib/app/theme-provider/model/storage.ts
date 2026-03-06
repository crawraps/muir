import type { Theme } from './types'

export function getSavedThemeLocal(): Theme | null {
  try {
    const themeJSON = localStorage.getItem('theme')
    const theme: Theme = themeJSON ? JSON.parse(themeJSON) : null

    if (!theme) return null
    return theme
  } catch (error) {
    console.error('Error retrieving theme from localStorage:', error)
  }

  return null
}

export function setSavedThemeLocal(theme: Theme): void {
  try {
    localStorage.setItem('theme', JSON.stringify(theme))
  } catch (error) {
    console.error('Error saving theme to localStorage:', error)
  }
}

export async function getSavedThemeShared(): Promise<Theme | null> {
  // biome-ignore lint/suspicious/noExplicitAny: window.cookieStore is not in standard types
  const cookieStore = (window as any).cookieStore || null
  if (!cookieStore) return null

  try {
    const cookie = await cookieStore.get('pref-theme-name')
    if (!cookie) return null

    const theme: Theme = JSON.parse(cookie.value)

    if (!theme) return null
    return theme
  } catch (error) {
    console.error('Error retrieving theme from cookies:', error)
  }

  return null
}

export async function setSavedThemeShared(theme: Theme): Promise<void> {
  // biome-ignore lint/suspicious/noExplicitAny: window.cookieStore is not in standard types
  const cookieStore = (window as any).cookieStore || null
  if (!cookieStore) return

  try {
    await cookieStore.set({
      domain: window.location.hostname,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      name: 'pref-theme-name',
      sameSite: 'none',
      value: JSON.stringify(theme),
    })
  } catch (error) {
    console.error('Error saving theme to cookies:', error)
  }
}
