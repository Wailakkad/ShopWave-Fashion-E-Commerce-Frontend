const API_BASE = 'http://localhost:5000/api/reviews'

export async function getReviewsApi(productId) {
  const res = await fetch(`${API_BASE}/${productId}`)
  if (!res.ok) throw new Error('Failed to fetch reviews')
  return res.json()
}

export async function createReviewApi(token, productId, data) {
  const res = await fetch(`${API_BASE}/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create review')
  }
  return res.json()
}
