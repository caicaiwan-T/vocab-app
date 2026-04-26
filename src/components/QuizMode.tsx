import { useState, useCallback, useMemo } from 'react'
import type { VocabItem } from '../types/vocab'
import { useSpeech } from '../hooks/useSpeech'
import { useEnterKey } from '../hooks/useEnterKey'
import { CATEGORY_META } from './categoryMeta'

interface Props {
  items: VocabItem[]
  onToggleKnown: (id: string) => void
}

interface Question {
  item: VocabItem
  choices: string[]
  correctIndex: number
  type: 'term-to-meaning' | 'meaning-to-term'
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestions(items: VocabItem[]): Question[] {
  const pool = shuffle(items).slice(0, Math.min(items.length, 10))
  return pool.map(item => {
    const type: Question['type'] = Math.random() > 0.5 ? 'term-to-meaning' : 'meaning-to-term'
    const distractors = shuffle(items.filter(x => x.id !== item.id))
      .slice(0, 3)
      .map(x => type === 'term-to-meaning' ? x.meaning : x.term)
    const correct = type === 'term-to-meaning' ? item.meaning : item.term
    const allChoices = shuffle([correct, ...distractors])
    return {
      item,
      choices: allChoices,
      correctIndex: allChoices.indexOf(correct),
      type,
    }
  })
}

export function QuizMode({ items, onToggleKnown }: Props) {
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(items))
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const { speak, isSupported } = useSpeech()

  const restart = useCallback(() => {
    setQuestions(buildQuestions(items))
    setQIndex(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }, [items])

  useEnterKey(restart, done)

  const current = questions[qIndex]
  const meta = current ? CATEGORY_META[current.item.category] : null

  const handleSelect = useCallback((idx: number) => {
    if (selected !== null) return
    setSelected(idx)
    if (idx === current.correctIndex) {
      setScore(s => s + 1)
      onToggleKnown(current.item.id)
    }
  }, [selected, current, onToggleKnown])

  const handleNext = useCallback(() => {
    if (qIndex + 1 >= questions.length) {
      setDone(true)
    } else {
      setQIndex(i => i + 1)
      setSelected(null)
    }
  }, [qIndex, questions.length])

  useEnterKey(handleNext, selected !== null && !done)

  const scorePct = useMemo(() => Math.round((score / questions.length) * 100), [score, questions.length])

  if (items.length < 4) {
    return <div className="empty-state"><p>Select at least 4 terms to start a quiz.</p></div>
  }

  if (done) {
    return (
      <div className="quiz-result">
        <div className="quiz-result__emoji">
          {scorePct >= 80 ? '🎉' : scorePct >= 50 ? '💪' : '📚'}
        </div>
        <h2 className="quiz-result__score">{score} / {questions.length}</h2>
        <p className="quiz-result__message">
          {scorePct >= 80 ? "Excellent! You're ready for your trial day." :
           scorePct >= 50 ? "Good work — review the ones you missed and try again." :
           "Keep practising — you'll get there!"}
        </p>
        <div className="quiz-result__bar">
          <div className="quiz-result__fill" style={{ width: `${scorePct}%` }} />
        </div>
        <button className="btn-primary" onClick={restart}>Try Again</button>
      </div>
    )
  }

  return (
    <div className="quiz-mode">
      <div className="quiz-mode__header">
        <div className="quiz-mode__progress-text">
          Question {qIndex + 1} of {questions.length}
        </div>
        <div className="quiz-mode__score-badge">Score: {score}</div>
      </div>

      <div className="quiz-mode__progress-bar">
        <div className="quiz-mode__progress-fill" style={{ width: `${((qIndex) / questions.length) * 100}%` }} />
      </div>

      <div className="quiz-mode__card">
        <div className="quiz-mode__category-badge" style={{ background: meta?.bg, color: meta?.color }}>
          {meta?.icon} {current.item.category}
        </div>

        {current.type === 'term-to-meaning' ? (
          <>
            <p className="quiz-mode__prompt">What does this term mean?</p>
            <div className="quiz-mode__term-row">
              <h2 className="quiz-mode__term">{current.item.term}</h2>
              {isSupported && (
                <button
                  className="vocab-card__speak-btn"
                  onClick={() => speak(current.item.term, current.item.language)}
                  title="Listen"
                >🔈</button>
              )}
            </div>
            <p className="quiz-mode__pronunciation">{current.item.pronunciation}</p>
          </>
        ) : (
          <>
            <p className="quiz-mode__prompt">Which term matches this definition?</p>
            <p className="quiz-mode__definition">"{current.item.meaning}"</p>
          </>
        )}

        <div className="quiz-mode__choices">
          {current.choices.map((choice, i) => {
            let state = ''
            if (selected !== null) {
              if (i === current.correctIndex) state = 'correct'
              else if (i === selected) state = 'wrong'
              else state = 'dim'
            }
            return (
              <button
                key={i}
                className={`quiz-choice ${state}`}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
              >
                <span className="quiz-choice__letter">{String.fromCharCode(65 + i)}</span>
                <span className="quiz-choice__text">{choice}</span>
              </button>
            )
          })}
        </div>

        {selected !== null && (
          <div className={`quiz-mode__feedback ${selected === current.correctIndex ? 'correct' : 'wrong'}`}>
            {selected === current.correctIndex
              ? `✓ Correct! "${current.item.term}" — ${current.item.pronunciation}`
              : `✗ The correct answer was: "${current.type === 'term-to-meaning' ? current.item.meaning : current.item.term}"`
            }
          </div>
        )}
      </div>

      {selected !== null && (
        <button className="btn-primary quiz-mode__next" onClick={handleNext}>
          {qIndex + 1 >= questions.length ? 'See results →' : 'Next question →'}
        </button>
      )}
    </div>
  )
}
