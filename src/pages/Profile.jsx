import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { fetchOrders } from '../store/orderSlice'

const statusColors = {
  pending: '#E8A000',
  confirmed: '#2D6A4F',
  shipped: '#1A1A6E',
  delivered: '#2D6A4F',
  cancelled: '#CC2200'
}

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { orders, loading } = useSelector(state => state.orders)
  const [tab, setTab] = useState('info')

  useEffect(() => {
    if (user) dispatch(fetchOrders())
  }, [user, dispatch])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 pt-20">
        <h2 className="text-xl font-bold text-[#111] mb-2">Not logged in</h2>
        <p className="text-sm text-gray-400 mb-6">Sign in to view your profile.</p>
        <Link to="/login" className="text-white text-sm font-semibold rounded-lg px-6" style={{ lineHeight: '44px', backgroundColor: '#111' }}>Sign In</Link>
      </div>
    )
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6" style={{ borderColor: '#EEE' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: '#CC2200' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111]">{user.name}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          <div className="border-t pt-4 mt-4 space-y-2" style={{ borderColor: '#F0F0F0' }}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Member since</span>
              <span className="text-[#111] font-medium">{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">User ID</span>
              <span className="text-[#111] font-medium">#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b" style={{ borderColor: '#EEE' }}>
          <button onClick={() => setTab('info')} className={`text-sm font-medium pb-3 cursor-pointer ${tab === 'info' ? 'text-[#111] border-b-2 border-[#111]' : 'text-gray-400'}`}>
            Profile Info
          </button>
          <button onClick={() => setTab('orders')} className={`text-sm font-medium pb-3 cursor-pointer ${tab === 'orders' ? 'text-[#111] border-b-2 border-[#111]' : 'text-gray-400'}`}>
            Order History {orders.length > 0 && `(${orders.length})`}
          </button>
        </div>

        {tab === 'info' && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#EEE' }}>
            <div className="space-y-3">
              <div><span className="text-xs text-gray-400 block">Full Name</span><span className="text-sm font-medium text-[#111]">{user.name}</span></div>
              <div><span className="text-xs text-gray-400 block">Email</span><span className="text-sm font-medium text-[#111]">{user.email}</span></div>
              <div><span className="text-xs text-gray-400 block">User ID</span><span className="text-sm font-medium text-[#111]">#{user.id}</span></div>
              <div><span className="text-xs text-gray-400 block">Member Since</span><span className="text-sm font-medium text-[#111]">{new Date(user.created_at).toLocaleDateString()}</span></div>
            </div>
            <button onClick={handleLogout} className="w-full text-white text-sm font-semibold rounded-lg cursor-pointer mt-8" style={{ height: 44, backgroundColor: '#CC2200' }}>
              Sign Out
            </button>
          </div>
        )}

        {tab === 'orders' && (
          <div className="bg-white rounded-xl border" style={{ borderColor: '#EEE' }}>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-[#111] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-gray-400 mb-4">No orders yet.</p>
                <Link to="/products" className="text-sm font-semibold text-white rounded-lg px-6" style={{ lineHeight: '44px', backgroundColor: '#111' }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div>
                {orders.map(order => (
                  <Link key={order.id} to={`/orders/${order.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b" style={{ borderColor: '#F5F5F5' }}>
                    <div>
                      <p className="text-sm font-medium text-[#111]">Order #{order.id}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 text-white" style={{ backgroundColor: statusColors[order.status] || '#888' }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <p className="text-sm font-semibold text-[#111] mt-1">${parseFloat(order.total).toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
