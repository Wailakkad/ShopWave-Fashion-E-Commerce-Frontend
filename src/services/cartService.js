const API_BASE = 'http://localhost:5000/api/cart'

export async function fetchCartApi(token) {
  const res = await fetch(API_BASE, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to fetch cart')
  return res.json()
}

export async function addToCartApi(token, productId) {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId })
  })
  if (!res.ok) throw new Error('Failed to add to cart')
  return res.json()
}

export async function updateCartItemApi(token, productId, quantity) {
  const res = await fetch(`${API_BASE}/items/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ quantity })
  })
  if (!res.ok) throw new Error('Failed to update cart item')
  return res.json()
}

export async function removeFromCartApi(token, productId) {
  const res = await fetch(`${API_BASE}/items/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to remove from cart')
  return res.json()
}

export async function clearCartApi(token) {
  const res = await fetch(API_BASE, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Failed to clear cart')
  return res.json()
}
