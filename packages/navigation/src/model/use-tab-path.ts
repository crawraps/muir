import { useKeepAliveContext } from 'keepalive-for-react'
import { useTabMetadata, useTabState } from '../ui/tab-provider'

export function useTabPath(): string {
  const meta = useTabMetadata()
  const state = useTabState()

  const { _cacheKey } = useKeepAliveContext()
  const tabId = _cacheKey
  const memory = state.memory[tabId]
  const tab = meta.tabs.find(t => t.id === tabId)
  return memory?.path ?? tab?.path ?? '/'
}
