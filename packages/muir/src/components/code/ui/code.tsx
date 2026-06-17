import { Button, Icon, Surface } from '../../../basic'
import { handleCopyButtonClick } from '../model/clipboard'
import { useCodeStyle } from '../model/code-style-context'
import type { CodeProps } from '../model/properties'
import { resolveContent } from '../model/resolve-content'
import { resolveIcon } from '../model/resolve-icon'
import { useCodeThemeChange } from '../model/use-code-theme-change'
import styling from './public.module.css'

function Code({ filename: filenameProp, ...props }: CodeProps) {
  const { theme, resolvedTheme, cycle: cycleTheme } = useCodeStyle()
  useCodeThemeChange(theme, resolvedTheme, props.onThemeChange)

  const icon = resolveIcon(props.language, props.icons, cx('icon'))
  const { content, ref, filename: extractedFilename } = resolveContent(props.children, props.parseFirstCommentAsFilename, props.commentLineSignatures)
  const filename = filenameProp ?? extractedFilename

  return (
    <Surface className={cx('code', styling.root, props.className)} muir-name='code' data-code-theme={resolvedTheme} data-language={props.language} ref={ref}>
      <aside>
        {icon}
        {filename && <span className={cx('filename')}>{filename}</span>}
        <span className={cx('spacer')} />
        <div className={cx('toolbar')}>
          <Button icon onClick={handleCopyButtonClick} variant='text'>
            {props.copyIcon || <Icon name='copy' />}
          </Button>
          <Button icon onClick={cycleTheme} variant='text'>
            {props.themeIcon || <Icon name='theme' />}
          </Button>
        </div>
      </aside>

      {content}
    </Surface>
  )
}

export default Code
