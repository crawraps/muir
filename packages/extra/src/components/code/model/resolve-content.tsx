export function resolveContent(children: React.ReactNode) {
  const ref = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState(children)

  useLayoutEffect(() => {
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
  }
}
