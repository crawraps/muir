import { Icon, Text } from '@muir/base'

export function resolveIcon(language: string, icons?: Record<string, string | React.ReactNode>, className?: string): React.ReactNode {
  const value = icons?.[language]
  if (value === undefined) {
    return (
      <Text className={className} type='label'>
        .{language}
      </Text>
    )
  }
  if (typeof value === 'string') {
    return <Icon className={className} name={value} />
  }
  return value
}
