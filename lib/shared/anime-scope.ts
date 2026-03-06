import { createScope, type DOMTarget, type Scope } from 'animejs'
import React, { memo, useEffect, useRef } from 'react'
import { type Theme, useTheme } from '../app/theme-provider'

interface Props {
  // biome-ignore lint/suspicious/noExplicitAny: Accepts any React element
  children: React.ReactElement<any>
  /**
   * Current anime scope
   */
  ref?: React.RefObject<Scope | null>
  /**
   * Function to initialize the scope with
   */
  init?: (scope: AnimeScopeType | undefined, theme: Theme['motion']) => void
}

export const AnimeScope = memo(({ ref, init, children }: Props) => {
  const scope = useRef<Scope>(null)

  const childRef = React.useRef<HTMLElement>(null)
  const themeContext = useTheme()

  useEffect(() => {
    const currentScope = ref ?? scope

    currentScope.current = createScope({ root: children.props.ref?.current ?? childRef.current })
    if (init) {
      currentScope.current.add(scope => {
        init(scope as AnimeScopeType, themeContext.theme.motion)
      })
    }

    return () => currentScope.current!.revert()
  }, [init, children.props.ref?.current, ref, themeContext.theme.motion])

  return React.cloneElement(children, { ref: children.props.ref ?? childRef })
})

export type AnimeScopeType =
  | (Scope & {
      root: DOMTarget
    })
  | undefined
