import type { AppMode, Deck } from '../types/vocab'

interface Props {
  decks: Deck[]
  activeDeckId: string
  mode: AppMode
  totalKnown: number
  totalItems: number
  onDeckChange: (id: string) => void
  onModeChange: (mode: AppMode) => void
}

const MODES: { id: AppMode; label: string; icon: string }[] = [
  { id: 'browse', label: 'Browse', icon: '📖' },
  { id: 'flashcard', label: 'Flashcard', icon: '🃏' },
  { id: 'quiz', label: 'Quiz', icon: '✏️' },
]

export function Header({
  decks, activeDeckId, mode, totalKnown, totalItems,
  onDeckChange, onModeChange,
}: Props) {
  const pct = totalItems > 0 ? Math.round((totalKnown / totalItems) * 100) : 0

  return (
    <header className="app-header">
      <div className="app-header__top">
        <div className="app-header__brand">
          <span className="app-header__logo">VocabKit</span>
          <span className="app-header__tagline">Professional vocabulary trainer</span>
        </div>

        <div className="app-header__deck-selector">
          {decks.map(deck => (
            <button
              key={deck.id}
              className={`deck-btn ${deck.id === activeDeckId ? 'active' : ''}`}
              onClick={() => onDeckChange(deck.id)}
            >
              {deck.name}
            </button>
          ))}
        </div>
      </div>

      <div className="app-header__bottom">
        <nav className="mode-tabs">
          {MODES.map(m => (
            <button
              key={m.id}
              className={`mode-tab ${mode === m.id ? 'active' : ''}`}
              onClick={() => onModeChange(m.id)}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </nav>

        <div className="progress-summary">
          <span className="progress-summary__text">{totalKnown} / {totalItems} known</span>
          <div className="progress-summary__bar">
            <div className="progress-summary__fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-summary__pct">{pct}%</span>
        </div>
      </div>
    </header>
  )
}
