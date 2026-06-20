import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../store/orderSlice'
import LoadingSpinner from '../components/LoadingSpinner'

const statusColors = {
  pending: '#E8A000',
  confirmed: '#2D6A4F',
  shipped: '#1A1A6E',
  delivered: '#2D6A4F',
  cancelled: '#CC2200'
}

export default function OrderDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentOrder, loading, error } = useSelector(state => state.orders)

  useEffect(() => {
    dispatch(fetchOrderById(id))
  }, [id, dispatch])

  if (loading) return <LoadingSpinner />

  if (error || !currentOrder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <h2 className="text-xl font-bold text-[#111] mb-2">Order not found</h2>
        <Link to="/profile" className="text-sm text-[#CC2200] font-medium hover:underline">Back to orders</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-[800px] mx-auto">
        <button onClick={() => navigate('/profile')} className="text-gray-400 text-[13px] hover:text-black transition-colors mb-6 block">&larr; Back to orders</button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111]">Order #{currentOrder.id}</h1>
            <p className="text-sm text-gray-400 mt-1">
              Placed on {new Date(currentOrder.created_at).toLocaleDateString()}
            </p>
          </div>
          <span className="text-xs font-semibold rounded-full px-3 py-1 text-white" style={{ backgroundColor: statusColors[currentOrder.status] || '#888' }}>
            {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
          </span>
        </div>

        {/* Shipping Info */}
        <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: '#EEE' }}>
          <h3 className="font-bold text-[#111] text-sm mb-3">Shipping Details</h3>
          <p className="text-sm text-gray-600">{currentOrder.shipping_address}</p>
          <p className="text-sm text-gray-600">{currentOrder.city}</p>
          <p className="text-sm text-gray-600">Phone: {currentOrder.phone}</p>
          {currentOrder.notes && <p className="text-sm text-gray-500 mt-2">Notes: {currentOrder.notes}</p>}
          <p className="text-xs text-gray-400 mt-3">Payment: Cash on Delivery</p>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border p-6 mb-6" style={{ borderColor: '#EEE' }}>
          <h3 className="font-bold text-[#111] text-sm mb-3">Items ({currentOrder.items?.length || 0})</h3>
          {currentOrder.items?.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-3 border-t" style={{ borderColor: '#F5F5F5' }}>
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product_id}`} className="text-sm font-medium text-[#111] hover:underline truncate block">{item.product_name}</Link>
                <p className="text-xs text-gray-400">${parseFloat(item.product_price).toFixed(2)} each × {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-[#111]">${(parseFloat(item.product_price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between pt-4 mt-2 border-t font-bold text-[#111] text-base" style={{ borderColor: '#EEE' }}>
            <span>Total</span>
            <span>${parseFloat(currentOrder.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
