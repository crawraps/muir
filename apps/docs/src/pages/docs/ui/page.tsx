import { Button } from '@muir/base'
import { Pane } from 'src/entities/pane'

export default function () {
  return (
    <Pane>
      <h1>The docs list</h1>
      <Button>go to {'<Button />'} docs</Button>
    </Pane>
  )
}
