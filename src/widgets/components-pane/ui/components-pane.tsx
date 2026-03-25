import { useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { getGroupedDocs } from '../../../shared/api/docs'

interface SecondNavPaneProps {
  activeCategory?: string
  selected?: string
}

export const SecondNavPane = ({ activeCategory, selected }: SecondNavPaneProps) => {
  const grouped = getGroupedDocs()
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (activeCategory && categoryRefs.current[activeCategory]) {
      categoryRefs.current[activeCategory]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activeCategory])

  const categories = Object.keys(grouped)

  return (
    <div className={cx('snp', 'pane')}>
      {categories.length === 0 ? (
        <div className={cx('empty-state')}>No items found.</div>
      ) : (
        categories.map(category => {
          const docs = grouped[category]
          const label = category.charAt(0).toUpperCase() + category.slice(1)

          return (
            <div
              key={category}
              ref={el => {
                categoryRefs.current[category] = el
              }}
            >
              <Link className={cx(['category-button', { active: activeCategory === category }])} href={`/${category}`}>
                {label}
              </Link>
              <div className={cx('snp-list')}>
                {docs.map(doc => {
                  const docName = doc.split('/').pop() || doc
                  const itemLabel = docName.charAt(0).toUpperCase() + docName.slice(1)
                  const isActive = selected === doc

                  return (
                    <Link className={cx(['snp-button', { active: isActive }])} href={`/${doc}`} key={doc}>
                      {itemLabel}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
