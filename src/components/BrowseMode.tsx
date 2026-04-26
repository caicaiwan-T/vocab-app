import type { VocabItem } from '../types/vocab'
import { VocabCard } from './VocabCard'

interface Props {
  items: VocabItem[]
  knownMap: Record<string, boolean>
  onToggleKnown: (id: string) => void
  onHide: (id: string) => void
}

export function BrowseMode({ items, knownMap, onToggleKnown, onHide }: Props) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No terms match your current filter. Select at least one category above.</p>
      </div>
    )
  }

  return (
    <div className="browse-grid">
      {items.map(item => (
        <VocabCard
          key={item.id}
          item={item}
          isKnown={!!knownMap[item.id]}
          onToggleKnown={onToggleKnown}
          onHide={onHide}
        />
      ))}
    </div>
  )
}
