import { Container } from '../../../../lib/components/container'
import { Heading } from '../../../../lib/components/heading'

export function TypographyPreview() {
  return (
    <>
      <Heading className='heading' level={2} variant>
        Heading
      </Heading>
      <Container className='container component-heading' shape='large'>
        <div>
          <Heading level={1}>Heading</Heading>
          <Heading level={2}>Heading 2</Heading>
          <Heading level={3}>Heading 3</Heading>
          <Heading level={4}>Heading 4</Heading>
          <Heading level={5}>Heading 5</Heading>
          <Heading level={6}>Heading 6</Heading>
        </div>
        <div>
          <Heading level={1} variant>
            Heading variant
          </Heading>
          <Heading level={2} variant>
            Heading 2 variant
          </Heading>
          <Heading level={3} variant>
            Heading 3 variant
          </Heading>
          <Heading level={4} variant>
            Heading 4 variant
          </Heading>
          <Heading level={5} variant>
            Heading 5 variant
          </Heading>
          <Heading level={6} variant>
            Heading 6 variant
          </Heading>
        </div>
      </Container>
    </>
  )
}
