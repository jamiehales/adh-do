import type { Todo } from '../types'

const BASE = '/api/todos'

export async function getTodosForUser(userId: string): Promise<Todo[]> {
  const res = await fetch(`${BASE}/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch todos')
  return res.json()
}

export async function createTodo(data: {
  title: string
  importance: string | null
  dueDate: string | null
  ownerId: string
  requestedById: string
}): Promise<Todo> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create todo')
  return res.json()
}
