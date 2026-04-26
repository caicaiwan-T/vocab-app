import { useEffect, useRef } from 'react'

export function useEnterKey(callback: () => void, enabled: boolean = true) {
  const stateRef = useRef({ callback, enabled })

  useEffect(() => {
    stateRef.current = { callback, enabled }
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && stateRef.current.enabled) {
        e.preventDefault()
        stateRef.current.callback()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])
}
