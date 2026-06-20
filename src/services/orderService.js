const API_BASE = 'http://localhost:5000/api/orders'

export async function createOrderApi(token, orderData) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(orderData)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create order')
  }
  return res.json()
}

export async function getOrdersApi(token) {
  const res = await fetch(API_BASE, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

export async function getOrderByIdApi(token, id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch order')
  return res.json()
}
