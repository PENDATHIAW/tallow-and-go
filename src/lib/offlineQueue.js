import { newIdempotencyKey } from './eden'

const STORAGE_KEY = 'eden_offline_queue'
const listeners = new Set()

function readQueue() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeQueue(queue) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  listeners.forEach((listener) => listener(queue))
}

export function subscribeEdenQueue(listener) {
  listeners.add(listener)
  listener(readQueue())
  return () => listeners.delete(listener)
}

export function getEdenQueue() {
  return readQueue()
}

export function enqueueEdenAction(type, payload, idempotencyKey) {
  const queue = readQueue()
  const item = {
    id: idempotencyKey || newIdempotencyKey(),
    type,
    payload,
    queuedAt: new Date().toISOString(),
  }
  queue.push(item)
  writeQueue(queue)
  return item
}

export function removeEdenQueueItem(id) {
  writeQueue(readQueue().filter((item) => item.id !== id))
}

// handlers: { sale: (payload, idempotencyKey) => Promise<{ok, message}>, stock: ..., expense: ..., batch: ... }
// Runs actions in the order they were queued so stock/sale sequencing stays correct.
// Anything that still fails (offline again, real validation error) stays queued for the next flush.
export async function flushEdenQueue(handlers) {
  const queue = readQueue()
  if (!queue.length) return { flushed: 0, remaining: 0, lastError: '' }
  let flushed = 0
  let lastError = ''
  const remaining = []
  for (const item of queue) {
    const handler = handlers[item.type]
    if (!handler) {
      remaining.push(item)
      continue
    }
    const result = await handler(item.payload, item.id)
    if (result?.ok) {
      flushed += 1
    } else {
      lastError = result?.message || lastError
      remaining.push(item)
    }
  }
  writeQueue(remaining)
  return { flushed, remaining: remaining.length, lastError }
}
