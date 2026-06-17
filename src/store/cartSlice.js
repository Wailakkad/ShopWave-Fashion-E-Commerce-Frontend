import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCartApi, addToCartApi, updateCartItemApi, removeFromCartApi, clearCartApi } from '../services/cartService'

function normalizeItem(item) {
  return {
    id: item.product_id ?? item.id,
    name: item.name,
    price: parseFloat(item.price),
    image: item.image,
    category: item.category,
    description: item.description ?? '',
    quantity: item.quantity
  }
}

function hasToken() {
  return !!localStorage.getItem('token')
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  if (!hasToken()) return thunkAPI.rejectWithValue('Not logged in')
  const data = await fetchCartApi(localStorage.getItem('token'))
  return (data.items || []).map(normalizeItem)
})

export const addToCart = createAsyncThunk('cart/addToCart', async (product, { getState }) => {
  if (hasToken()) {
    try {
      const data = await addToCartApi(localStorage.getItem('token'), product.id)
      return (data.items || []).map(normalizeItem)
    } catch {}
  }
  const current = getState().cart.items
  const existing = current.find(i => i.id === product.id)
  const newItems = existing
    ? current.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
    : [...current, { ...product, quantity: 1 }]
  return newItems
})

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { getState }) => {
  if (hasToken()) {
    try {
      const data = await removeFromCartApi(localStorage.getItem('token'), productId)
      return (data.items || []).map(normalizeItem)
    } catch {}
  }
  return getState().cart.items.filter(i => i.id !== productId)
})

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, quantity }, { getState }) => {
  if (hasToken()) {
    try {
      const data = await updateCartItemApi(localStorage.getItem('token'), id, quantity)
      return (data.items || []).map(normalizeItem)
    } catch {}
  }
  return getState().cart.items.map(i => i.id === id ? { ...i, quantity } : i)
})

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  if (hasToken()) {
    try {
      await clearCartApi(localStorage.getItem('token'))
    } catch {}
  }
  return []
})

export const syncCartAfterLogin = createAsyncThunk('cart/syncCartAfterLogin', async (_, { getState }) => {
  const token = localStorage.getItem('token')
  if (!token) return []
  const localItems = getState().cart.items
  if (localItems.length > 0) {
    for (const item of localItems) {
      for (let i = 0; i < item.quantity; i++) {
        try { await addToCartApi(token, item.id) } catch {}
      }
    }
  }
  const data = await fetchCartApi(token)
  return (data.items || []).map(normalizeItem)
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    mergeCart(state, action) {
      state.items = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => { state.loading = true; state.error = null })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(addToCart.fulfilled, (state, action) => { state.items = action.payload })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.items = action.payload })
      .addCase(updateQuantity.fulfilled, (state, action) => { state.items = action.payload })
      .addCase(clearCart.fulfilled, (state, action) => { state.items = action.payload })
      .addCase(syncCartAfterLogin.fulfilled, (state, action) => { state.items = action.payload })
  }
})

export const { mergeCart } = cartSlice.actions
export default cartSlice.reducer
