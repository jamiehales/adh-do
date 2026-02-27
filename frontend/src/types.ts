export interface Todo {
  id: number
  title: string
  importance: string | null
  dueDate: string | null
  ownerId: string
  requestedById: string
  createdAt: string
}

export type UserId = 'Jamie' | 'Ellie'

export const IMPORTANCE_LEVELS = [
  'I need this to happen',
  'This is important to me',
  'I would like this',
  'If you could find time',
] as const

export type Importance = typeof IMPORTANCE_LEVELS[number]
