import { IconsShared } from '../../../shared/ui/icons'
import { ButtonPreview } from '../../../widgets/button-preview'
import { FormPreview } from '../../../widgets/form-preview'
import { HeaderWidget } from '../../../widgets/header'
import { LoadingIndicatorPreview } from '../../../widgets/loading-indicator-preview'
import { RevealerPreview } from '../../../widgets/revealer-preview'
import { SnackbarPreview } from '../../../widgets/snackbar-preview'
import { SwitchPreview } from '../../../widgets/switch-preview'
import { TextFieldPreview } from '../../../widgets/text-field-preview'
import { TypographyPreview } from '../../../widgets/typography-preview'

// Wait, the original css used in page.
// We can just put a simple class.
import styles from './preview.module.css'

export function PreviewPage() {
  return (
    <main className={styles.preview}>
      <HeaderWidget />
      <TypographyPreview />
      <ButtonPreview />
      <TextFieldPreview />
      <SwitchPreview />
      <FormPreview />
      <RevealerPreview />
      <LoadingIndicatorPreview />
      <SnackbarPreview />
      <div className={styles.icons}>
        <IconsShared />
      </div>
    </main>
  )
}
