import { Container } from '../../../../lib/components/container'
import { Heading } from '../../../../lib/components/heading'
import { IconButton } from '../../../../lib/components/icon-button'
import { TextField } from '../../../../lib/components/text-field'

export function TextFieldPreview() {
  return (
    <>
      <Heading className='heading' level={2} variant>
        Text field
      </Heading>
      <Container className='container component-text-field' shape='large'>
        <div>
          <TextField maxLength={10} placeholder='Placeholder' size='small' supportingText='supporting text' variant='filled' />
          <TextField label='Outlined' placeholder='Placeholder' size='small' variant='outlined' />
        </div>
        <div>
          <TextField label='Filled' placeholder='Placeholder' size='medium' variant='filled' />
          <TextField
            label='Outlined'
            leadingIcon='#line-md-search'
            placeholder='Placeholder'
            size='medium'
            supportingText='supporting text'
            trailingIcon={<IconButton icon='#line-md-close' size='small' />}
            variant='outlined'
          />
        </div>
        <div>
          <TextField label='Filled' placeholder='Placeholder' size='large' variant='filled' />
          <TextField label='Outlined' placeholder='Placeholder' size='large' variant='outlined' />
        </div>
      </Container>
    </>
  )
}
