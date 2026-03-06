import { createContext, type ReactNode, use } from 'react'
import SnackbarContainer from '../ui/container'
import SnackbarComponent from '../ui/snackbar'
import { type Presets, presets } from './presets'
import { type Snackbar, useQueue } from './queue'

export type SnackbarContextType = {
  queue(props?: Snackbar & { preset?: string }): number
  dismiss(id: number): void
  dismissAll(): void
}

export interface SnackbarProviderProps {
  children: ReactNode
  presets?: Presets
}

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

export const useSnackbar = () => {
  const context = use(SnackbarContext)
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}

export const SnackbarProvider = ({ children, ...props }: SnackbarProviderProps) => {
  const { list, ...queue } = useQueue(Object.assign(presets, props.presets), 2000)

  return (
    <SnackbarContext value={queue}>
      {children}
      {['top', 'bottom'].map(position => (
        <SnackbarContainer key={position} position={position}>
          {list
            .filter(bar => bar.anchors?.vertical === position)
            .map((bar, index) => (
              <SnackbarComponent dismiss={() => queue.dismiss(bar.id)} key={bar.id} offset={bar.visible ? index : -1} {...bar} />
            ))}
        </SnackbarContainer>
      ))}
    </SnackbarContext>
  )
}

export default SnackbarContext
