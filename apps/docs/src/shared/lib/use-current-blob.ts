import { type BlobConfig } from 'src/widgets/blob-scene'
import { getDocFrontmatter } from 'src/entities/docs'
import { useMemo } from 'react'
import { useLocation } from 'wouter'

const blobs: BlobConfig[] = [
  {
    points: 10,
    gScale: 70,
    hScale: 20,
    cx: 600,
    cy: 2400,
  },
  {
    points: 14,
    gScale: 50,
    hScale: 30,
    cx: 550,
    cy: 2200,
  },
]

const groupToBlobIndex: Record<string, number> = {
  basic: 0,
  extra: 1,
}

export function useCurrentBlob() {
  const [location] = useLocation()

  const currentBlob = useMemo(() => {
    if (!location.startsWith('/docs/')) return 0
    const docName = location.replace('/docs/', '')
    const frontmatter = getDocFrontmatter(docName)
    const group = frontmatter?.group as string | undefined
    return group && group in groupToBlobIndex ? groupToBlobIndex[group] : 0
  }, [location])

  return { blobs, blob: blobs[currentBlob] }
}