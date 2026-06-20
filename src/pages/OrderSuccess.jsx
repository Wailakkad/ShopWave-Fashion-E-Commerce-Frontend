import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById } from '../store/orderSlice'
import LoadingSpinner from '../components/LoadingSpinner'

export default function OrderSuccess() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentOrder, loading } = useSelector(state => state.orders)

  useEffect(() => {
    if (id && (!currentOrder || currentOrder.id !== Number(id))) {
      dispatch(fetchOrderById(id))
    }
  }, [id, dispatch, currentOrder])

  if (loading) return <LoadingSpinner />
  if (!currentOrder) return <div className="min-h-screen flex items-center justify-center pt-20"><div className="w-6 h-6 border-2 border-[#111] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-[600px] mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#111] mb-2">Order Confirmed!</h1>
        <p className="text-sm text-gray-400 mb-2">Thank you for your purchase.</p>
        <p className="text-sm text-gray-500 mb-8">
          Order #{currentOrder.id} — ${parseFloat(currentOrder.total).toFixed(2)} via Cash on Delivery
        </p>

        <div className="bg-white rounded-xl border text-left p-6 mb-8" style={{ borderColor: '#EEE' }}>
          <h3 className="font-bold text-[#111] mb-3 text-sm">Order Details</h3>
          {currentOrder.items?.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-t" style={{ borderColor: '#F5F5F5' }}>
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111] truncate">{item.product_name}</p>
                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-[#111]">${(parseFloat(item.product_price) * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-2 border-t font-bold text-[#111]" style={{ borderColor: '#EEE' }}>
            <span>Total</span>
            <span>${parseFloat(currentOrder.total).toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Shipping to: {currentOrder.shipping_address}, {currentOrder.city}
          </p>
          <p className="text-xs text-gray-400">Payment: Cash on Delivery</p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link to="/profile" className="text-sm font-semibold rounded-lg px-6" style={{ lineHeight: '44px', border: '1.5px solid #DDD', color: '#666' }}>
            View Orders
          </Link>
          <Link to="/products" className="text-white text-sm font-semibold rounded-lg px-6" style={{ lineHeight: '44px', backgroundColor: '#111' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
