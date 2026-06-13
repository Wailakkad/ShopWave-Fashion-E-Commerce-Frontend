import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import useProducts from '../hooks/useProducts'
import LoadingSpinner from '../components/LoadingSpinner'

const ratings = [4.5, 5, 4, 3.5, 5, 4, 4.5, 3]

function StarRating({ rating }) {
  const full = Math.floor(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3 h-3" fill={i < full ? '#F59E0B' : '#E5E5E5'} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-gray-400 text-[11px] ml-1">{rating}</span>
      <span className="text-gray-300 text-[11px]">({Math.floor(Math.random() * 200 + 30)})</span>
    </div>
  )
}

function ProductCard({ product, onAddToCart, onBuyNow, compact }) {
  const rating = ratings[product.id % ratings.length]
  return (
    <div className="bg-white rounded-[10px] transition-shadow duration-200 relative" style={{ border: '1px solid #EEEEEE' }}>
      <span
        className="absolute top-3 right-3 z-10 text-[10px] font-medium rounded-full px-2 py-0.5"
        style={{ backgroundColor: '#F5F5F5', color: '#888' }}
      >
        {product.category}
      </span>
      <Link to={`/products/${product.id}`} className="block">
        <div
          className={`w-full overflow-hidden ${compact ? 'h-[180px] md:h-[200px] lg:h-[220px]' : ''}`}
          style={{
            backgroundColor: '#F8F8F8',
            borderRadius: '10px 10px 0 0'
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            className={`w-full block ${compact ? 'h-full object-cover' : ''}`}
          />
        </div>
      </Link>
      <div className="p-3">
        <Link to={`/products/${product.id}`}>
          <p
            className="font-bold text-[#111] leading-tight"
            style={{ fontSize: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {product.name}
          </p>
        </Link>
        <div className="mt-1"><StarRating rating={rating} /></div>
        <p className="font-bold text-[#111] mt-1.5" style={{ fontSize: 15 }}>${product.price.toFixed(2)}</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="font-semibold cursor-pointer rounded-md transition-colors duration-150"
            style={{ height: 34, fontSize: 11, border: '1.5px solid #111', backgroundColor: 'white', color: '#111' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#111' }}
          >
            Add to Cart
          </button>
          <button
            onClick={() => onBuyNow(product)}
            className="font-semibold cursor-pointer rounded-md transition-colors duration-150"
            style={{ height: 34, fontSize: 11, backgroundColor: '#111', color: 'white', border: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#CC2200' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#111' }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { products, loading } = useProducts()
  const [email, setEmail] = useState('')
  const carouselRef = useRef(null)

  if (loading) return <LoadingSpinner />

  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-24 sm:pt-28 py-16 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product not found</h2>
        <Link to="/products" className="mt-4 inline-block text-gray-600 hover:text-black underline text-sm sm:text-base">
          Back to products
        </Link>
      </div>
    )
  }

  const rating = ratings[product.id % ratings.length]
  const related = products.filter(p => p.category === product.category && p.id !== product.id)
  const handleAddToCart = (p) => dispatch(addToCart(p))
  const handleBuyNow = (p) => { dispatch(addToCart(p)); navigate('/cart') }

  return (
    <div className="overflow-x-hidden pt-16">
      {/* SECTION 1 — HERO BANNER */}
      <section className="relative w-full h-[180px] overflow-hidden">
        <img
          src="/newHeroBackgroundImage.png"
          alt="Product hero"
          className="w-full h-full object-cover"
          style={{ filter: 'blur(6px)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} />
        <h1
          className="absolute text-white font-black leading-none"
          style={{
            left: '5%',
            bottom: '-20px',
            fontSize: 'clamp(40px, 8vw, 100px)',
            letterSpacing: '-0.03em',
            lineHeight: 1
          }}
        >
          {product.category}
        </h1>
      </section>

      {/* SECTION 2 — BREADCRUMB BAR */}
      <div className="w-full bg-white flex items-center" style={{ padding: '12px 24px' }}>
        <Link to="/products" className="text-gray-400 text-[13px] hover:text-black transition-colors">
          &larr; Back to products
        </Link>
        <span className="mx-2 text-gray-300 text-[13px]">/</span>
        <span className="text-gray-600 text-[13px]">{product.category}</span>
        <span className="mx-2 text-gray-300 text-[13px]">/</span>
        <span className="text-gray-800 text-[13px] font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* SECTION 3 — MAIN PRODUCT DETAIL */}
      <div className="max-w-[1280px] mx-auto" style={{ padding: '24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Left — Image */}
          <div
            className="bg-white rounded-[10px] flex items-center justify-center"
            style={{ border: '1px solid #EEEEEE', minHeight: 'clamp(300px, 50vw, 500px)' }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[90%] max-w-[90%] object-contain p-4"
            />
          </div>

          {/* Right — Details */}
          <div className="flex flex-col">
            <span
              className="inline-block text-[10px] font-medium rounded-full px-2.5 py-0.5 w-fit"
              style={{ backgroundColor: '#F5F5F5', color: '#888' }}
            >
              {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#111] mt-3 leading-tight">{product.name}</h1>

            <div className="mt-2">
              <StarRating rating={rating} />
            </div>

            <p className="text-2xl sm:text-3xl font-bold text-[#111] mt-3">${product.price.toFixed(2)}</p>

            <p className="text-gray-500 text-sm leading-relaxed mt-4" style={{ lineHeight: 1.7 }}>
              {product.description}
            </p>

            {/* Color swatches */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Colors</p>
              <div className="flex gap-2">
                {['#CC2200', '#111111', '#F5F5F5', '#2D6A4F'].map((color, i) => (
                  <span
                    key={i}
                    className="w-7 h-7 rounded-full inline-block cursor-pointer transition-transform hover:scale-110"
                    style={{ backgroundColor: color, border: color === '#F5F5F5' ? '1px solid #DDD' : 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button
                    key={size}
                    className="text-xs font-medium rounded-md cursor-pointer transition-colors"
                    style={{
                      height: 36,
                      padding: '0 16px',
                      border: '1px solid #DDD',
                      backgroundColor: 'white',
                      color: '#666'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#111'; e.currentTarget.style.color = '#111' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#DDD'; e.currentTarget.style.color = '#666' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => handleAddToCart(product)}
                className="flex-1 font-semibold cursor-pointer rounded-md transition-colors duration-150"
                style={{
                  height: 44,
                  fontSize: 13,
                  border: '1.5px solid #111',
                  backgroundColor: 'white',
                  color: '#111'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#111'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#111' }}
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleBuyNow(product)}
                className="flex-1 font-semibold cursor-pointer rounded-md transition-colors duration-150"
                style={{
                  height: 44,
                  fontSize: 13,
                  backgroundColor: '#111',
                  color: 'white',
                  border: 'none'
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#CC2200' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#111' }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex items-center gap-6 text-xs text-gray-400 border-t pt-4" style={{ borderColor: '#F0F0F0' }}>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Free shipping
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                30-day returns
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 — RELATED PRODUCTS CAROUSEL */}
      {related.length > 0 && (
        <section className="w-full bg-white" style={{ padding: '40px 24px' }}>
          <div className="max-w-[1280px] mx-auto">
            <div className="flex items-center justify-between mb-6 gap-4">
              <h2 className="text-lg sm:text-[22px] font-bold text-black">You Might Also Like</h2>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => carouselRef.current?.scrollBy({ left: -240, behavior: 'smooth' })}
                  className="flex items-center justify-center cursor-pointer rounded-full flex-shrink-0"
                  style={{ width: 40, height: 40, border: '1.5px solid #DDDDDD', backgroundColor: 'white' }}
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => carouselRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}
                  className="flex items-center justify-center cursor-pointer rounded-full flex-shrink-0"
                  style={{ width: 40, height: 40, backgroundColor: '#CC2200', border: 'none' }}
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-4 overflow-x-auto"
              style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              {related.map(p => (
                <div
                  key={p.id}
                  className="flex-shrink-0 bg-white rounded-[10px] overflow-hidden"
                  style={{ minWidth: 'clamp(160px, 35vw, 220px)', scrollSnapAlign: 'start', border: '1px solid #EEEEEE' }}
                >
                  <ProductCard product={p} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} compact />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5 — CTA NEWSLETTER */}
      <section className="w-full" style={{ backgroundColor: '#111111' }}>
        <div
          className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ padding: '40px 24px' }}
        >
          <div className="w-full md:w-auto">
            <h2
              className="text-white font-black leading-tight"
              style={{ fontSize: 'clamp(24px, 5vw, 36px)', maxWidth: 360 }}
            >
              Ready to Get Our New Stuff?
            </h2>
            <div className="flex mt-5 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="outline-none text-sm bg-white text-gray-800 flex-1 md:flex-none"
                style={{ height: 44, padding: '0 16px', border: 'none', borderRadius: '6px 0 0 6px' }}
              />
              <button
                onClick={() => { if (email) { alert(`Subscribed: ${email}`); setEmail('') } }}
                className="font-semibold text-sm cursor-pointer transition-opacity hover:opacity-90 flex-shrink-0"
                style={{ height: 44, padding: '0 20px', backgroundColor: '#CC2200', color: 'white', borderRadius: '0 6px 6px 0', border: 'none' }}
              >
                Submit
              </button>
            </div>
          </div>
          <p
            className="text-sm leading-relaxed w-full md:w-auto"
            style={{ maxWidth: 280, color: '#888', lineHeight: 1.7 }}
          >
            Tell us your needs, the best apparels are here. Come a template action for changing colors that's right for your needs.
          </p>
        </div>
      </section>
    </div>
  )
}
