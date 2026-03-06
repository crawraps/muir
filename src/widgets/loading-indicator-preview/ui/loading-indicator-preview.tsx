import { Container } from '../../../../lib/components/container'
import { Heading } from '../../../../lib/components/heading'
import { LoadingIndicator } from '../../../../lib/components/loading-indicator'

export function LoadingIndicatorPreview() {
  return (
    <>
      <Heading className='heading' level={2} variant>
        Loading indicator
      </Heading>
      <Container className='container component-loading-indicator' shape='large'>
        <LoadingIndicator />
      </Container>
    </>
  )
}
