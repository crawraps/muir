import { type Scope, spring, waapi } from 'animejs'
import { useCallback, useEffect, useRef } from 'react'
import { useTheme } from '../../../../lib/app/theme-provider'
import { defaultThemes } from '../../../../lib/app/theme-provider/with-defaults/defaults'
import { Container } from '../../../../lib/components/container'
import { Heading } from '../../../../lib/components/heading'
import { Label } from '../../../../lib/components/label'
import { Switch } from '../../../../lib/components/switch'
import { AnimeScope, type AnimeScopeType } from '../../../../lib/shared/anime-scope'
// import '@aarsteinmedia/dotlottie-player/light';

export function HeaderWidget() {
  const animatedHeaderScope = useRef<Scope>(null)
  const themeContext = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      if (!animatedHeaderScope.current) return
      if (window.scrollY > 100) {
        animatedHeaderScope.current.methods.stickHeader()
      } else {
        animatedHeaderScope.current.methods.unstickHeader()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // biome-ignore lint/suspicious/noExplicitAny: Theme motion types are complex
  const scopeInit = useCallback((scope: AnimeScopeType, motion: any) => {
    if (!scope) return
    const staticCopy = scope.root.cloneNode(true) as HTMLElement
    staticCopy.style.position = 'static'
    staticCopy.style.visibility = 'hidden'
    scope.root.parentNode?.prepend(staticCopy)

    const spatialEase = spring(motion.expressive.slow.spatial)
    const effectsEase = spring(motion.expressive.slow.effects)

    let isSticky = false
    scope.add('stickHeader', () => {
      if (isSticky) return
      isSticky = true
      scope.root.setAttribute('md-shape', 'small')
      scope.root.setAttribute('md-emphasis', 'medium')
      waapi.animate(scope.root, {
        ease: spatialEase,
        top: '.5rem',
        width: 'calc(100% - (1rem + var(--md-sys-shape-corner-small) * 6))',
      })
      waapi.animate('p', {
        ease: spatialEase,
        height: 0,
        marginTop: 0,
        opacity: { ease: effectsEase, to: 0 },
        x: '-1rem',
      })
      waapi.animate('h1', {
        ease: spatialEase,
        fontSize: '1.5rem',
        fontWeight: { ease: effectsEase, to: 500 },
      })
    })

    scope.add('unstickHeader', () => {
      if (!isSticky) return
      isSticky = false
      scope.root.setAttribute('md-shape', 'extra-large')
      scope.root.setAttribute('md-emphasis', 'high')
      waapi.animate(scope.root, {
        ease: spatialEase,
        top: '2rem',
        width: 'var(--container-width)',
      })
      waapi.animate('p', {
        ease: spatialEase,
        height: 'auto',
        marginTop: '0.5rem',
        opacity: { ease: effectsEase, to: 1 },
        x: 0,
      })
      waapi.animate('h1', {
        ease: spatialEase,
        fontSize: '2.5rem',
        fontWeight: { ease: effectsEase, to: 800 },
      })
    })
  }, [])

  return (
    <AnimeScope init={scopeInit} ref={animatedHeaderScope}>
      <Container className='heading-container' emphasis='high' key='header' shape='extra-large'>
        <div className='background' />
        <div>
          <div className='text'>
            <Heading level={1} variant>
              shared ui
            </Heading>
          </div>
          <Label htmlFor>
            Dark theme
            <Switch
              // biome-ignore lint/suspicious/noExplicitAny: Custom element event
              onChange={(ev: any) => {
                if (ev.currentTarget.selected) {
                  themeContext.updateTheme(defaultThemes.dark)
                } else {
                  themeContext.updateTheme(defaultThemes.light)
                }
              }}
            />
          </Label>
        </div>
      </Container>
    </AnimeScope>
  )
}
