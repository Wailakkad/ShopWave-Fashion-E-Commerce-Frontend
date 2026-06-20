const API_BASE = 'http://localhost:5000/api/newsletter'

export async function subscribeApi(email) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to subscribe')
  }
  return res.json()
}
