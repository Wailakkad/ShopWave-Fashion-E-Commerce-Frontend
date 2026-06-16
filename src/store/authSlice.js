import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi, registerApi, getMeApi } from '../services/authService'

export const login = createAsyncThunk('auth/login', async ({ email, password }, thunkAPI) => {
  try {
    const data = await loginApi(email, password)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const register = createAsyncThunk('auth/register', async ({ name, email, password }, thunkAPI) => {
  try {
    const data = await registerApi(name, email, password)
    localStorage.setItem('token', data.token)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message)
  }
})

export const loadUser = createAsyncThunk('auth/loadUser', async (_, thunkAPI) => {
  const token = localStorage.getItem('token')
  if (!token) return thunkAPI.rejectWithValue('No token')
  try {
    const user = await getMeApi(token)
    return { user, token }
  } catch {
    localStorage.removeItem('token')
    return thunkAPI.rejectWithValue('Session expired')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, loading: false, error: null, initialLoading: true },
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem('token')
    },
    clearError(state) {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(register.pending, state => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loadUser.pending, state => { state.initialLoading = true })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.initialLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loadUser.rejected, state => {
        state.initialLoading = false
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
