import type { Category } from '../types/vocab'
import { ALL_CATEGORIES, CATEGORY_META } from './categoryMeta'

interface Props {
  active: Set<Category>
  counts: Partial<Record<Category, number>>
  knownCounts: Partial<Record<Category, number>>
  onChange: (cat: Category) => void
}

export function CategoryFilter({ active, counts, knownCounts, onChange }: Props) {
  return (
    <div className="category-filter">
      {ALL_CATEGORIES.map(cat => {
        const meta = CATEGORY_META[cat]
        const total = counts[cat] ?? 0
        const known = knownCounts[cat] ?? 0
        const isActive = active.has(cat)
        return (
          <button
            key={cat}
            className={`category-filter__btn ${isActive ? 'active' : ''}`}
            style={isActive ? { borderColor: meta.color, color: meta.color, background: meta.bg } : {}}
            onClick={() => onChange(cat)}
          >
            <span className="category-filter__icon">{meta.icon}</span>
            <span className="category-filter__label">{cat}</span>
            <span className="category-filter__count">{known}/{total}</span>
          </button>
        )
      })}
    </div>
  )
}
