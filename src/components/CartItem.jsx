import { useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../store/cartSlice'

export default function CartItem({ item }) {
  const dispatch = useDispatch()

  return (
    <div
      className="flex gap-4 p-4 bg-white rounded-[10px]"
      style={{ border: '1px solid #EEEEEE' }}
    >
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0"
        style={{ backgroundColor: '#F8F8F8' }}
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#111] truncate">{item.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">${item.price.toFixed(2)} each</p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <label className="text-xs text-gray-500 font-medium">Qty:</label>
          <select
            value={item.quantity}
            onChange={e => dispatch(updateQuantity({ id: item.id, quantity: Number(e.target.value) }))}
            className="text-xs font-medium rounded-md outline-none"
            style={{
              height: 32,
              padding: '0 8px',
              border: '1px solid #DDD',
              backgroundColor: 'white',
              color: '#111'
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="text-right flex-shrink-0 flex flex-col items-end justify-between">
        <p className="text-sm font-bold text-[#111]">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="text-xs font-medium cursor-pointer transition-colors"
          style={{
            color: '#999',
            height: 32,
            padding: '0 12px',
            border: '1px solid #DDD',
            borderRadius: 6,
            backgroundColor: 'white'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#CC2200'; e.currentTarget.style.borderColor = '#CC2200' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#999'; e.currentTarget.style.borderColor = '#DDD' }}
        >
          Remove
        </button>
      </div>
    </div>
  )
}
