import type { Category } from '../types/vocab'

interface CategoryMeta {
  color: string
  bg: string
  icon: string
  description: string
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  'EdTech': {
    color: '#1a5ab0',
    bg: 'rgba(42,110,200,0.12)',
    icon: '📚',
    description: 'Industry-wide terms used in educational technology',
  },
  'UX Design': {
    color: '#5a1ab0',
    bg: 'rgba(122,42,200,0.12)',
    icon: '🎨',
    description: 'Design process, methods, and vocabulary',
  },
  'Sofatutor': {
    color: '#a03010',
    bg: 'rgba(200,80,42,0.12)',
    icon: '🛋️',
    description: 'Sofatutor-specific product and market terms',
  },
  'Presentation': {
    color: '#1a7a50',
    bg: 'rgba(42,184,122,0.12)',
    icon: '🎤',
    description: 'Vocabulary for presenting your work to stakeholders',
  },
}

export const ALL_CATEGORIES: Category[] = ['EdTech', 'UX Design', 'Sofatutor', 'Presentation']
