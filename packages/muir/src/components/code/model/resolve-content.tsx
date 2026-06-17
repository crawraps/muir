import { extractFilename } from '../model/parse-filename'

export function resolveContent(children: React.ReactNode, parseFirstCommentAsFilename = true, commentLineSignatures?: string[]) {
  const ref = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState(children)
  const [filename, setFilename] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (typeof children === 'string' && parseFirstCommentAsFilename) {
      const { filename: extracted, strippedCode } = extractFilename(children, commentLineSignatures)
      if (extracted) {
        setFilename(extracted)
        setContent(
          <pre>
            <code>{strippedCode}</code>
          </pre>,
        )
        return
      }
    }

    if (!ref.current) return
    const childs = Array.from(ref.current.children)

    if (childs.at(-1)?.tagName !== 'PRE') {
      setContent(
        <pre>
          <code>{children}</code>
        </pre>,
      )
    }
  }, [])

  return {
    content,
    ref,
    filename,
  }
}
