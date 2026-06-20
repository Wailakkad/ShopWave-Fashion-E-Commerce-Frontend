import { createSlice } from '@reduxjs/toolkit'

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: { shipping_address: '', city: '', phone: '', notes: '' },
  reducers: {
    setShippingAddress(state, action) { state.shipping_address = action.payload },
    setCity(state, action) { state.city = action.payload },
    setPhone(state, action) { state.phone = action.payload },
    setNotes(state, action) { state.notes = action.payload },
    resetCheckout(state) {
      state.shipping_address = ''
      state.city = ''
      state.phone = ''
      state.notes = ''
    }
  }
})

export const { setShippingAddress, setCity, setPhone, setNotes, resetCheckout } = checkoutSlice.actions
export default checkoutSlice.reducer
