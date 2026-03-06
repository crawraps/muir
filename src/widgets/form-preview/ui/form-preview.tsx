import * as yup from 'yup'
import { useTheme } from '../../../../lib/app/theme-provider'
import { Container } from '../../../../lib/components/container'
import { Form, type FormMethodsFromSchema } from '../../../../lib/components/form'
import { Heading } from '../../../../lib/components/heading'
import { Label } from '../../../../lib/components/label'
import { FormLoadingIndicator, LoadingIndicator } from '../../../../lib/components/loading-indicator'
import { SubmitButton } from '../../../../lib/components/submit-button'
import { Switch } from '../../../../lib/components/switch'
import { TextField } from '../../../../lib/components/text-field'

export function FormPreview() {
  const themeContext = useTheme()
  const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    password: yup.string().required('Password is required').min(5, 'Password must be at least 5 characters'),
    predefinedName: yup.boolean(),
  })

  const methods = useRef<FormMethodsFromSchema<typeof schema> | null>(null)

  const isNameReadonly = methods.current?.watch('predefinedName')
  useEffect(() => {
    if (isNameReadonly) {
      methods.current?.setValue('name', 'Tyler Joseph')
    } else {
      methods.current?.resetField('name')
    }
  }, [isNameReadonly])

  const handleSubmit = async (data: yup.InferType<typeof schema> | null) => {
    if (data) {
      console.log(`Submitted data: ${JSON.stringify(data, null, 2)}`)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1400 + 600))
      if (Math.random() > 0.5) {
        console.log('Account successfully created')
      } else {
        console.error('submitting error')
        methods.current?.setError('root', {
          message: 'Unexpected error occurred, please keep trying again, until it works',
        })
      }
    }
  }

  return (
    <>
      <Heading className='heading' level={2} variant>
        Form
      </Heading>
      <Form className='form' defaultValues={{ predefinedName: true }} onSubmit={handleSubmit} ref={methods} schema={schema}>
        <Container className='container component-form' emphasis='high' shape='large'>
          <Label>create new account</Label>
          <TextField label='name' name='name' placeholder='Josh Dun' readOnly={isNameReadonly} variant='outlined' />
          <TextField label='password' name='password' type='password' variant='outlined' />

          <Label htmlFor>
            <span>predefined name</span> <Switch name='predefinedName' />
          </Label>

          <FormLoadingIndicator />
          <SubmitButton loadingIcon={<LoadingIndicator color={themeContext.theme.palette['on-primary']} />}>create account</SubmitButton>
        </Container>
      </Form>
    </>
  )
}
