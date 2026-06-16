import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError } from '../store/authSlice'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const message = searchParams.get('message')
  const { user, loading, error } = useSelector(state => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) navigate(redirect)
  }, [user, navigate, redirect])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = e => {
    e.preventDefault()
    dispatch(login({ email, password }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 pt-20">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-[#111] mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in to your account</p>
        {message && (
          <p className="text-xs text-[#CC2200] bg-red-50 rounded-lg px-4 py-2 mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full outline-none text-sm rounded-lg px-4"
              style={{ height: 44, border: '1.5px solid #DDD', backgroundColor: '#FAFAFA', color: '#333' }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full outline-none text-sm rounded-lg px-4"
              style={{ height: 44, border: '1.5px solid #DDD', backgroundColor: '#FAFAFA', color: '#333' }}
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white text-sm font-semibold rounded-lg cursor-pointer disabled:opacity-50"
            style={{ height: 44, backgroundColor: '#111' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#CC2200] font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}
