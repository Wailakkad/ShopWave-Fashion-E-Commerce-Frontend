import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrderApi, getOrdersApi, getOrderByIdApi } from '../services/orderService'

export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData, thunkAPI) => {
  const token = localStorage.getItem('token')
  if (!token) return thunkAPI.rejectWithValue('Not logged in')
  try {
    const data = await createOrderApi(token, orderData)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, thunkAPI) => {
  const token = localStorage.getItem('token')
  if (!token) return thunkAPI.rejectWithValue('Not logged in')
  try {
    return await getOrdersApi(token)
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, thunkAPI) => {
  const token = localStorage.getItem('token')
  if (!token) return thunkAPI.rejectWithValue('Not logged in')
  try {
    return await getOrderByIdApi(token, id)
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], currentOrder: null, loading: false, error: null, placeLoading: false },
  reducers: {
    clearOrderError(state) { state.error = null }
  },
  extraReducers: builder => {
    builder
      .addCase(placeOrder.pending, state => { state.placeLoading = true; state.error = null })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placeLoading = false
        state.currentOrder = action.payload
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placeLoading = false
        state.error = action.payload
      })
      .addCase(fetchOrders.pending, state => { state.loading = true; state.error = null })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOrderById.pending, state => { state.loading = true; state.error = null })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { clearOrderError } = orderSlice.actions
export default orderSlice.reducer
