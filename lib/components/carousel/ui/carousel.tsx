import type { CarouselProps } from '../model/types'

export default function Carousel({ className, currentSlide, onSlideChange, children }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    setActiveIndex(currentSlide || 0)
  }, [currentSlide])
  useEffect(() => {
    onSlideChange?.(activeIndex)
  }, [activeIndex, onSlideChange])

  const slides = Children.toArray(children)

  return (
    <div className={clsx(['carousel'], className)}>
      <div className='slides-container'>
        {slides.map((slide, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: slides order is stable
          <div className={clsx(['slide'], { active: index === activeIndex })} key={index}>
            {slide}
          </div>
        ))}
      </div>
    </div>
  )
}
