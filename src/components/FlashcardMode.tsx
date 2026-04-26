import { useState, useCallback } from 'react'
import type { VocabItem } from '../types/vocab'
import { useSpeech } from '../hooks/useSpeech'
import { useEnterKey } from '../hooks/useEnterKey'
import { CATEGORY_META } from './categoryMeta'

interface Props {
  items: VocabItem[]
  knownMap: Record<string, boolean>
  onToggleKnown: (id: string) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function FlashcardMode({ items, knownMap, onToggleKnown }: Props) {
  const [deck, setDeck] = useState<VocabItem[]>(() => shuffle(items))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { speak, isSpeaking, isSupported } = useSpeech()

  const current = deck[index]
  const meta = current ? CATEGORY_META[current.category] : null

  const next = useCallback(() => {
    setFlipped(false)
    setTimeout(() => setIndex(i => (i + 1) % deck.length), 150)
  }, [deck.length])

  const prev = useCallback(() => {
    setFlipped(false)
    setTimeout(() => setIndex(i => (i - 1 + deck.length) % deck.length), 150)
  }, [deck.length])

  const reshuffle = useCallback(() => {
    setFlipped(false)
    setIndex(0)
    setDeck(shuffle(items))
  }, [items])

  useEnterKey(next, !flipped)

  if (items.length === 0) {
    return <div className="empty-state"><p>No terms match your current filter.</p></div>
  }

  return (
    <div className="flashcard-mode">
      <div className="flashcard-mode__nav-info">
        <span>{index + 1} / {deck.length}</span>
        <button className="btn-ghost" onClick={reshuffle}>🔀 Shuffle</button>
      </div>

      <div className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
        <div className="flashcard__inner">
          {/* Front */}
          <div className="flashcard__face flashcard__front">
            <span className="flashcard__badge" style={{ background: meta?.bg, color: meta?.color }}>
              {meta?.icon} {current?.category}
            </span>
            <h2 className="flashcard__term">{current?.term}</h2>
            <p className="flashcard__hint">Tap to reveal</p>
          </div>

          {/* Back */}
          <div className="flashcard__face flashcard__back">
            <div className="flashcard__back-header">
              <span className="flashcard__badge" style={{ background: meta?.bg, color: meta?.color }}>
                {meta?.icon} {current?.category}
              </span>
              {isSupported && (
                <button
                  className={`vocab-card__speak-btn ${isSpeaking ? 'speaking' : ''}`}
                  onClick={e => { e.stopPropagation(); speak(current!.term, current!.language) }}
                  title="Listen to pronunciation"
                >
                  {isSpeaking ? '🔊' : '🔈'}
                </button>
              )}
            </div>
            <h3 className="flashcard__back-term">{current?.term}</h3>
            <p className="flashcard__pronunciation">{current?.pronunciation}</p>
            <p className="flashcard__meaning">{current?.meaning}</p>
            <div className="flashcard__example">
              <span className="vocab-card__example-label">Example</span>
              <p>"{current?.example}"</p>
            </div>
            {current?.tip && (
              <div className="vocab-card__tip"><span>💡</span> {current.tip}</div>
            )}
          </div>
        </div>
      </div>

      <div className="flashcard-mode__controls">
        <button className="btn-secondary" onClick={prev}>← Prev</button>

        {flipped && (
          <button
            className={`btn-known ${knownMap[current?.id ?? ''] ? 'active' : ''}`}
            onClick={e => { e.stopPropagation(); onToggleKnown(current!.id) }}
          >
            {knownMap[current?.id ?? ''] ? '✓ Got it' : '○ Still learning'}
          </button>
        )}

        <button className="btn-primary" onClick={next}>Next →</button>
      </div>

      <div className="flashcard-mode__progress">
        {deck.map((item, i) => (
          <div
            key={item.id}
            className={`flashcard-mode__dot ${i === index ? 'current' : ''} ${knownMap[item.id] ? 'known' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
