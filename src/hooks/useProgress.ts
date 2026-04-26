import { useCallback, useEffect, useState } from 'react'
import type { KnownMap } from '../types/vocab'

const STORAGE_KEY = 'vocab-app-progress'

function loadProgress(): KnownMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function useProgress(deckId: string) {
  const [knownMap, setKnownMap] = useState<KnownMap>({})

  useEffect(() => {
    setKnownMap(loadProgress())
  }, [deckId])

  const toggle = useCallback((id: string) => {
    setKnownMap(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const reset = useCallback((ids: string[]) => {
    setKnownMap(prev => {
      const next = { ...prev }
      ids.forEach(id => { next[id] = false })
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { knownMap, toggle, reset }
}
