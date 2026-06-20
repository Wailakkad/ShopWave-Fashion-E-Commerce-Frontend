import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { placeOrder } from '../store/orderSlice'
import { setShippingAddress, setCity, setPhone, setNotes, resetCheckout } from '../store/checkoutSlice'
import { fetchCart } from '../store/cartSlice'

export default function Checkout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(state => state.cart.items)
  const checkout = useSelector(state => state.checkout)
  const { placeLoading, error } = useSelector(state => state.orders)
  const [step, setStep] = useState(1)

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const handlePlaceOrder = async () => {
    const result = await dispatch(placeOrder({
      shipping_address: checkout.shipping_address,
      city: checkout.city,
      phone: checkout.phone,
      notes: checkout.notes
    }))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(fetchCart())
      dispatch(resetCheckout())
      navigate(`/order-success/${result.payload.id}`)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <h2 className="text-xl font-bold text-[#111] mb-2">Your cart is empty</h2>
        <p className="text-sm text-gray-400 mb-6">Add some items before checking out.</p>
        <button onClick={() => navigate('/products')} className="text-white text-sm font-semibold rounded-lg px-6" style={{ lineHeight: '44px', backgroundColor: '#111' }}>
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-2xl font-bold text-[#111] mb-2">Checkout</h1>
        <p className="text-sm text-gray-400 mb-8">Cash on Delivery — no payment needed online</p>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-8 text-sm">
          <span className={`font-medium ${step >= 1 ? 'text-[#111]' : 'text-gray-300'}`}>Shipping</span>
          <span className="text-gray-300">→</span>
          <span className={`font-medium ${step >= 2 ? 'text-[#111]' : 'text-gray-300'}`}>Review</span>
          <span className="text-gray-300">→</span>
          <span className={`font-medium ${step >= 3 ? 'text-[#111]' : 'text-gray-300'}`}>Confirm</span>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#EEE' }}>
            <h2 className="text-lg font-bold text-[#111] mb-4">Shipping Details</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
                <textarea value={checkout.shipping_address} onChange={e => dispatch(setShippingAddress(e.target.value))} required className="w-full outline-none text-sm rounded-lg px-4 py-3" style={{ border: '1.5px solid #DDD', backgroundColor: '#FAFAFA', color: '#333', minHeight: 80 }} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">City</label>
                <input value={checkout.city} onChange={e => dispatch(setCity(e.target.value))} required className="w-full outline-none text-sm rounded-lg px-4" style={{ height: 44, border: '1.5px solid #DDD', backgroundColor: '#FAFAFA', color: '#333' }} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Phone</label>
                <input value={checkout.phone} onChange={e => dispatch(setPhone(e.target.value))} required className="w-full outline-none text-sm rounded-lg px-4" style={{ height: 44, border: '1.5px solid #DDD', backgroundColor: '#FAFAFA', color: '#333' }} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Order Notes (optional)</label>
                <textarea value={checkout.notes} onChange={e => dispatch(setNotes(e.target.value))} className="w-full outline-none text-sm rounded-lg px-4 py-3" style={{ border: '1.5px solid #DDD', backgroundColor: '#FAFAFA', color: '#333', minHeight: 60 }} />
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!checkout.shipping_address || !checkout.city || !checkout.phone} className="mt-6 w-full text-white text-sm font-semibold rounded-lg cursor-pointer disabled:opacity-50" style={{ height: 44, backgroundColor: '#111' }}>
              Continue to Review
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#EEE' }}>
            <h2 className="text-lg font-bold text-[#111] mb-4">Review Your Order</h2>
            <div className="text-sm text-gray-500 mb-4">
              <p>Shipping to: {checkout.shipping_address}, {checkout.city}</p>
              <p>Phone: {checkout.phone}</p>
              {checkout.notes && <p>Notes: {checkout.notes}</p>}
            </div>
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-t" style={{ borderColor: '#F5F5F5' }}>
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111] truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                </div>
                <p className="text-sm font-semibold text-[#111]">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 mt-2 border-t font-bold text-[#111]" style={{ borderColor: '#EEE' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Payment: Cash on Delivery</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="flex-1 text-sm font-semibold rounded-lg cursor-pointer" style={{ height: 44, border: '1.5px solid #DDD', backgroundColor: 'white', color: '#666' }}>
                Back
              </button>
              <button onClick={() => setStep(3)} className="flex-1 text-white text-sm font-semibold rounded-lg cursor-pointer" style={{ height: 44, backgroundColor: '#111' }}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#EEE' }}>
            <h2 className="text-lg font-bold text-[#111] mb-4">Confirm & Place Order</h2>
            <div className="text-sm text-gray-500 mb-4 space-y-1">
              <p><span className="font-medium text-[#111]">Ship to:</span> {checkout.shipping_address}, {checkout.city}</p>
              <p><span className="font-medium text-[#111]">Phone:</span> {checkout.phone}</p>
              <p><span className="font-medium text-[#111]">Payment:</span> Cash on Delivery</p>
              <p><span className="font-medium text-[#111]">Items:</span> {items.length}</p>
              <p><span className="font-medium text-[#111]">Total:</span> ${subtotal.toFixed(2)}</p>
            </div>
            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
            <button onClick={handlePlaceOrder} disabled={placeLoading} className="w-full text-white text-sm font-semibold rounded-lg cursor-pointer disabled:opacity-50" style={{ height: 44, backgroundColor: '#111' }}>
              {placeLoading ? 'Placing Order...' : 'Place Order — Cash on Delivery'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
