import type { VocabItem } from '../types/vocab'
import { useSpeech } from '../hooks/useSpeech'
import { CATEGORY_META } from './categoryMeta'

interface Props {
  item: VocabItem
  isKnown: boolean
  onToggleKnown: (id: string) => void
  onHide: (id: string) => void
}

export function VocabCard({ item, isKnown, onToggleKnown, onHide }: Props) {
  const { speak, isSpeaking, isSupported } = useSpeech()
  const meta = CATEGORY_META[item.category]

  return (
    <div className={`vocab-card ${isKnown ? 'vocab-card--known' : ''}`}>
      <div className="vocab-card__header">
        <span className="vocab-card__badge" style={{ background: meta.bg, color: meta.color }}>
          {meta.icon} {item.category}
        </span>
        <div className="vocab-card__actions">
          <button
            className={`vocab-card__known-btn ${isKnown ? 'active' : ''}`}
            onClick={() => onToggleKnown(item.id)}
            title={isKnown ? 'Mark as still learning' : 'Mark as known'}
          >
            {isKnown ? '✓ Got it' : '○ Learning'}
          </button>
          <button
            className="vocab-card__hide-btn"
            onClick={() => onHide(item.id)}
            title="Hide this term"
          >
            Hide
          </button>
        </div>
      </div>

      <div className="vocab-card__term-row">
        <h3 className="vocab-card__term">{item.term}</h3>
        {isSupported && (
          <button
            className={`vocab-card__speak-btn ${isSpeaking ? 'speaking' : ''}`}
            onClick={() => speak(item.term, item.language)}
            title="Listen to pronunciation"
          >
            {isSpeaking ? '🔊' : '🔈'}
          </button>
        )}
      </div>

      <p className="vocab-card__pronunciation">{item.pronunciation}</p>
      <p className="vocab-card__meaning">{item.meaning}</p>

      <div className="vocab-card__example">
        <span className="vocab-card__example-label">Example</span>
        <p>"{item.example}"</p>
      </div>

      {item.tip && (
        <div className="vocab-card__tip">
          <span>💡</span> {item.tip}
        </div>
      )}
    </div>
  )
}
