import type { PendingUpdateRequest, UpdateResponse } from '../types'

const BASE = '/api/update-requests'

export async function requestUpdate(todoId: number, requestedByUserId: string): Promise<void> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todoId, requestedByUserId }),
  })
  if (!res.ok) throw new Error('Failed to create update request')
}

export async function getPendingUpdateRequests(userId: string): Promise<PendingUpdateRequest[]> {
  const res = await fetch(`${BASE}/pending-for/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch pending update requests')
  return res.json()
}

export async function getUpdateResponses(userId: string): Promise<UpdateResponse[]> {
  const res = await fetch(`${BASE}/responses-for/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch update responses')
  return res.json()
}

export async function getOutgoingRequestedTodoIds(userId: string): Promise<number[]> {
  const res = await fetch(`${BASE}/outgoing/${userId}`)
  if (!res.ok) throw new Error('Failed to fetch outgoing requests')
  return res.json()
}

export async function respondToUpdateRequest(id: number, response: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response }),
  })
  if (!res.ok) throw new Error('Failed to submit response')
}

export async function dismissUpdateResponse(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}/dismiss`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to dismiss response')
}
