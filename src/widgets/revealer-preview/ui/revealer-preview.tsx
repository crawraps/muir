import { useState } from 'react'
import { Button } from '../../../../lib/components/button'
import { Container } from '../../../../lib/components/container'
import { Heading } from '../../../../lib/components/heading'
import { Icon } from '../../../../lib/components/icon'
import { Revealer } from '../../../../lib/components/revealer'

export function RevealerPreview() {
  const [isRevealed, setIsRevealed] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <>
      <Heading className='heading' level={2} variant>
        Revealer
      </Heading>
      <Container className='container component-revealer' shape='large'>
        <Button onClick={() => setIsRevealed(it => !it)} variant='outlined'>
          <Revealer isRevealed={isRevealed}>click on me</Revealer>
        </Button>
        <Button className='loading-button' onClick={() => setIsLoading(it => !it)} variant='filled-tonal'>
          <Revealer isRevealed={!isLoading}>submit</Revealer>
          <Revealer hiddenVector='150%' isRevealed={isLoading}>
            <Icon name='line-md-loading-loop' />
          </Revealer>
        </Button>
      </Container>
    </>
  )
}
