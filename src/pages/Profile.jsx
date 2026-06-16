import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 pt-20">
        <h2 className="text-xl font-bold text-[#111] mb-2">Not logged in</h2>
        <p className="text-sm text-gray-400 mb-6">Sign in to view your profile.</p>
        <Link
          to="/login"
          className="text-white text-sm font-semibold rounded-lg px-6"
          style={{ lineHeight: '44px', backgroundColor: '#111' }}
        >
          Sign In
        </Link>
      </div>
    )
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-24 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: '#CC2200' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111]">{user.name}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Member since</span>
              <span className="text-[#111] font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">User ID</span>
              <span className="text-[#111] font-medium">#{user.id}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-white text-sm font-semibold rounded-lg cursor-pointer mt-8"
            style={{ height: 44, backgroundColor: '#CC2200' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
