export function copy(text: string) {
  navigator.clipboard.writeText(text)
}

export function handleCopyButtonClick(ev: React.MouseEvent<HTMLButtonElement>) {
  ev.preventDefault()
  const code = ev.currentTarget.closest('[muir-name="code"]')?.querySelector('code')
  if (code) {
    copy(code.textContent ?? '')
  } else {
    throw new Error('Code element not found')
  }
}
