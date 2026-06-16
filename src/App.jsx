import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadUser } from './store/authSlice'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  const dispatch = useDispatch()
  const { initialLoading } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  if (initialLoading) return null

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />}          />
        <Route path="/products"    element={<Products />}      />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart"         element={<Cart />}          />
        <Route path="/login"        element={<Login />}         />
        <Route path="/register"     element={<Register />}      />
        <Route path="/profile"      element={<Profile />}       />
        <Route path="*"             element={<NotFound />}      />
      </Routes>
    </div>
  )
}
