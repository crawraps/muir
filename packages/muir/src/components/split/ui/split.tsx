import { atr } from '../../../shared/attributify'
import type { SplitProps } from '../model/properties'
import styling from './public.module.css'

/**
 * A layout component that groups children (buttons, icons, text inputs)
 * into a connected strip with shared border-radius handling.
 */
function Split({ vertical, uneven, ref, ...props }: SplitProps) {
  return <div {...props} className={cx('split', styling.split, props.className)} is-equal={atr(!uneven)} is-vertical={atr(vertical)} ref={ref} />
}

export default Split
