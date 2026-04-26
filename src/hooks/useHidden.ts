import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'vocab-app-hidden'

function loadHidden(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveHidden(set: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
}

export function useHidden(deckId: string) {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setHiddenIds(loadHidden())
  }, [deckId])

  const hide = useCallback((id: string) => {
    setHiddenIds(prev => {
      const next = new Set(prev)
      next.add(id)
      saveHidden(next)
      return next
    })
  }, [])

  const restore = useCallback((id: string) => {
    setHiddenIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      saveHidden(next)
      return next
    })
  }, [])

  const restoreAll = useCallback(() => {
    setHiddenIds(new Set())
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { hiddenIds, hide, restore, restoreAll }
}
