import { Container } from '../../../../lib/components/container'
import { Heading } from '../../../../lib/components/heading'
import { Label } from '../../../../lib/components/label'
import { Switch } from '../../../../lib/components/switch'

export function SwitchPreview() {
  return (
    <>
      <Heading className='heading' level={2} variant>
        Switch
      </Heading>
      <Container className='container component-switch' shape='large'>
        <Label htmlFor>
          <span>Plain</span> <Switch showOnlySelectedIcon={false} />
        </Label>
        <Label htmlFor>
          <span>Icones</span> <Switch icons />
        </Label>
        <Label htmlFor>
          <span>Only selected icon</span> <Switch selected />
        </Label>
      </Container>
    </>
  )
}
