import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="mt-1 text-base sm:text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}
