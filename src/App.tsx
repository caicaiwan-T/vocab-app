import { useState, useMemo } from 'react'
import type { AppMode, Category } from './types/vocab'
import { allDecks } from './data'
import { useProgress } from './hooks/useProgress'
import { useHidden } from './hooks/useHidden'
import { useEnterKey } from './hooks/useEnterKey'
import { Header } from './components/Header'
import { CategoryFilter } from './components/CategoryFilter'
import { BrowseMode } from './components/BrowseMode'
import { FlashcardMode } from './components/FlashcardMode'
import { QuizMode } from './components/QuizMode'
import { ALL_CATEGORIES } from './components/categoryMeta'

export default function App() {
  const [activeDeckId, setActiveDeckId] = useState(allDecks[0].id)
  const [mode, setMode] = useState<AppMode>('browse')
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(new Set(ALL_CATEGORIES))
  const [, setShowHidden] = useState(false)

  const deck = useMemo(() => allDecks.find(d => d.id === activeDeckId)!, [activeDeckId])
  const { knownMap, toggle } = useProgress(activeDeckId)
  const { hiddenIds, hide, restoreAll } = useHidden(activeDeckId)

  const filteredItems = useMemo(
    () => deck.items.filter(item =>
      activeCategories.has(item.category) && !hiddenIds.has(item.id)
    ),
    [deck.items, activeCategories, hiddenIds]
  )

  const hiddenCount = useMemo(
    () => deck.items.filter(item => hiddenIds.has(item.id)).length,
    [deck.items, hiddenIds]
  )

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {}
    deck.items.forEach(item => {
      if (!hiddenIds.has(item.id)) counts[item.category] = (counts[item.category] ?? 0) + 1
    })
    return counts
  }, [deck.items, hiddenIds])

  const knownCounts = useMemo(() => {
    const counts: Partial<Record<Category, number>> = {}
    deck.items.forEach(item => {
      if (knownMap[item.id]) counts[item.category] = (counts[item.category] ?? 0) + 1
    })
    return counts
  }, [deck.items, knownMap])

  const totalKnown = deck.items.filter(i => knownMap[i.id]).length

  function toggleCategory(cat: Category) {
    setActiveCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }

  function handleDeckChange(id: string) {
    setActiveDeckId(id)
    setActiveCategories(new Set(ALL_CATEGORIES))
    setMode('browse')
    setShowHidden(false)
  }

  useEnterKey(restoreAll, hiddenCount > 0)

  return (
    <div className="app">
      <Header
        decks={allDecks}
        activeDeckId={activeDeckId}
        mode={mode}
        totalKnown={totalKnown}
        totalItems={deck.items.length}
        onDeckChange={handleDeckChange}
        onModeChange={setMode}
      />

      <main className="app-main">
        <div className="deck-description">
          <strong>{deck.company}</strong> — {deck.description}
        </div>

        <CategoryFilter
          active={activeCategories}
          counts={categoryCounts}
          knownCounts={knownCounts}
          onChange={toggleCategory}
        />

        {hiddenCount > 0 && (
          <div className="hidden-banner">
            <span>{hiddenCount} term{hiddenCount > 1 ? 's' : ''} hidden</span>
            <button onClick={restoreAll}>Restore all</button>
          </div>
        )}

        {mode === 'browse' && (
          <BrowseMode items={filteredItems} knownMap={knownMap} onToggleKnown={toggle} onHide={hide} />
        )}
        {mode === 'flashcard' && (
          <FlashcardMode
            key={`${activeDeckId}-${[...activeCategories].sort().join()}`}
            items={filteredItems}
            knownMap={knownMap}
            onToggleKnown={toggle}
          />
        )}
        {mode === 'quiz' && (
          <QuizMode
            key={`${activeDeckId}-${[...activeCategories].sort().join()}`}
            items={filteredItems}
            onToggleKnown={toggle}
          />
        )}
      </main>
    </div>
  )
}
