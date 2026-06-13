import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import cartReducer from './cartSlice'

const storage = {
  getItem: key => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: key => Promise.resolve(localStorage.removeItem(key))
}

const persistConfig = {
  key: 'root',
  storage
}

const persistedCartReducer = persistReducer(persistConfig, cartReducer)

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer
  }
})

export const persistor = persistStore(store)
