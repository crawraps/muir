import { Button } from '../../../../lib/components/button'
import { Container } from '../../../../lib/components/container'
import { Heading } from '../../../../lib/components/heading'
import { IconButton } from '../../../../lib/components/icon-button'

export function ButtonPreview() {
  return (
    <>
      <Heading className='heading' level={2} variant>
        Button
      </Heading>
      <Container className='container component-button' shape='large'>
        <div>
          <Button size='small' variant='elevated'>
            Elevated
          </Button>
          <Button size='small' variant='filled'>
            Filled
          </Button>
          <Button size='small' variant='filled-tonal'>
            Filled Tonal
          </Button>
          <Button size='small' variant='outlined'>
            Outlined
          </Button>
          <Button size='small' variant='text'>
            Text
          </Button>
        </div>
        <div>
          <Button size='medium' variant='elevated'>
            Elevated
          </Button>
          <Button size='medium' variant='filled'>
            Filled
          </Button>
          <Button size='medium' variant='filled-tonal'>
            Filled Tonal
          </Button>
          <Button size='medium' variant='outlined'>
            Outlined
          </Button>
          <Button size='medium' variant='text'>
            Text
          </Button>
        </div>
        <div>
          <Button size='large' variant='elevated'>
            Elevated
          </Button>
          <Button size='large' variant='filled'>
            Filled
          </Button>
          <Button size='large' variant='filled-tonal'>
            Filled Tonal
          </Button>
          <Button size='large' variant='outlined'>
            Outlined
          </Button>
          <Button size='large' variant='text'>
            Text
          </Button>
        </div>
      </Container>

      <Heading className='heading' level={2} variant>
        Icon Button
      </Heading>
      <Container className='container component-button' shape='large'>
        <div>
          <IconButton icon='#line-md-search' size='small' variant='standard' />
          <IconButton icon='#line-md-search' size='small' variant='filled' />
          <IconButton icon='#line-md-search' size='small' variant='filled-tonal' />
          <IconButton icon='#line-md-search' size='small' variant='outlined' />
        </div>
        <div>
          <IconButton icon='#line-md-search' size='medium' variant='standard' />
          <IconButton icon='#line-md-search' size='medium' variant='filled' />
          <IconButton icon='#line-md-search' size='medium' variant='filled-tonal' />
          <IconButton icon='#line-md-search' size='medium' variant='outlined' />
        </div>
        <div>
          <IconButton icon='#line-md-search' size='large' variant='standard' />
          <IconButton icon='#line-md-search' size='large' variant='filled' />
          <IconButton icon='#line-md-search' size='large' variant='filled-tonal' />
          <IconButton icon='#line-md-search' size='large' variant='outlined' />
        </div>
      </Container>
    </>
  )
}
