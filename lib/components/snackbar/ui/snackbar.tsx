import type { Snackbar } from '../model/queue'
import { useAnimations } from './animations'
import style from './style.module.css'

interface Props extends Snackbar {
  offset: number
  id: number
  dismiss: () => void
}

export default function SnackbarComponents(props: Props) {
  const { root, animate } = useAnimations(props.anchors?.vertical === 'top', props.dismiss)

  useEffect(() => {
    animate(props.offset)
  }, [props.offset, animate])

  return (
    <div
      className={style.snackbar}
      draggable={props.offset === 0}
      ref={root}
      style={{ zIndex: props.offset === -1 ? -1000 : -props.offset, alignSelf: props.anchors?.horizontal, top: 0 }}
    >
      <div className={style.content}>
        <span className={style.prefix}>{props.prefix}</span>
        <span>{props.message}</span>
        <span className={style.suffix}>{props.suffix}</span>
      </div>
    </div>
  )
}
