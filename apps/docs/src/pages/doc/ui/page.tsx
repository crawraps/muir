import { MDXProvider } from '@mdx-js/react'

import { useParams } from '@muir/navigation'
import { resolveDoc } from 'src/entities/docs'
import { Pane } from 'src/entities/pane'

export default function () {
  const params = useParams()
  const docName = (params['*']?.split('/').slice(1).join('/') ?? params.id ?? 'components/button') as string
  const doc = resolveDoc(docName)

  return (
    <Pane>
      {doc && (
        <MDXProvider>
          <doc.component />
        </MDXProvider>
      )}
    </Pane>
  )
}
