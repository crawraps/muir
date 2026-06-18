import type { TextProps } from './properties'

const TAG_MAP: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  label: 'label',
  title: 'span',
  display: 'span',
  anchor: 'a',
}

const SCALE_MAP: Record<string, string> = {
  h1: 'headline',
  h2: 'headline',
  h3: 'headline',
  h4: 'title',
  h5: 'title',
  h6: 'title',
  body: 'body',
  label: 'label',
  title: 'title',
  display: 'display',
  anchor: 'body',
}

const HEADING_SIZE_MAP: Record<string, string> = {
  h1: 'large',
  h2: 'medium',
  h3: 'small',
  h4: 'large',
  h5: 'medium',
  h6: 'small',
}

export function useText({ type, size }: Pick<TextProps, 'type' | 'size'>) {
  const tag = TAG_MAP[type]
  const scale = SCALE_MAP[type]
  const resolvedSize = size ?? HEADING_SIZE_MAP[type] ?? 'medium'

  return { tag, scale, resolvedSize }
}
