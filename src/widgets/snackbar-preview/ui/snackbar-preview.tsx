declare global {
  namespace JSX {
    interface IntrinsicElements {
      // biome-ignore lint/suspicious/noExplicitAny: Custom element types are not available
      'dotlottie-player': any
    }
  }
}

import { Button } from '../../../../lib/components/button'
import { Container } from '../../../../lib/components/container'
import { Heading } from '../../../../lib/components/heading'
import { Icon } from '../../../../lib/components/icon'
import { useSnackbar } from '../../../../lib/components/snackbar'

export function SnackbarPreview() {
  const snackbar = useSnackbar()

  return (
    <>
      <Heading className='heading' level={2} variant>
        Snackbar
      </Heading>
      <Container className='container component-snackbar' shape='large'>
        <Button onClick={() => snackbar.queue({ preset: 'default', prefix: <Icon name='line-md-search' style={{ width: '100%', height: '100%' }} /> })}>Show snackbar</Button>
        <Button
          onClick={() =>
            snackbar.queue({
              message: 'A little longer snackbar',
              duration: 5000,
              prefix: createElement('dotlottie-player', { autoplay: true, className: 'success-icon', src: '/success-icon.lottie', subframe: true }),
              anchors: { vertical: 'bottom', horizontal: 'left' },
            })
          }
        >
          Show long snackbar
        </Button>
      </Container>
    </>
  )
}
