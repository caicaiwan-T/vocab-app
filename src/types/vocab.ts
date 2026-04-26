export type Category = 'EdTech' | 'UX Design' | 'Sofatutor' | 'Presentation'
export type AppMode = 'browse' | 'flashcard' | 'quiz'

export interface VocabItem {
  id: string
  term: string
  /** IPA notation, e.g. /ˈwɔːkθruː/ */
  pronunciation: string
  category: Category
  meaning: string
  /** A sentence showing the term in a real sofatutor work context */
  example: string
  /** BCP-47 language tag for TTS — defaults to 'en-GB', use 'de-DE' for German terms */
  language?: string
  /** Optional extra tip shown on the card back */
  tip?: string
}

export interface Deck {
  id: string
  name: string
  company: string
  description: string
  items: VocabItem[]
}

export type KnownMap = Record<string, boolean>
