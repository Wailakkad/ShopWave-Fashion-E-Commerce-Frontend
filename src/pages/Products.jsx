import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import useProducts from '../hooks/useProducts'
import LoadingSpinner from '../components/LoadingSpinner'
import { subscribeApi } from '../services/newsletterService'

const categoryColors = {
  Outerwear: '#CC2200',
  Accessories: '#E8A000',
  Clothing: '#2D6A4F',
  Bags: '#1A1A6E',
  Shoes: '#8B0000'
}

const categories = Object.keys(categoryColors)

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

export default function Products() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [email, setEmail] = useState('')
  const carouselRef = useRef(null)
  const perPage = 6

  const filtered = products.filter(p => {
    const matchCategory = activeCategory ? p.category === activeCategory : true
    const matchSearch = searchQuery.trim()
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchCategory && matchSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * perPage
  const pageItems = filtered.slice(start, start + perPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const handleAddToCart = (product) => dispatch(addToCart(product))
  const handleBuyNow = (product) => { dispatch(addToCart(product)); navigate('/cart') }

  if (loading) return <LoadingSpinner />

  return (
    <div className="overflow-x-hidden pt-16">
      {/* SECTION 1 — HERO BANNER */}
      <section className="relative w-full h-[180px] overflow-hidden">
        <img
          src="/newHeroBackgroundImage.png"
          alt="Shop hero"
          className="w-full h-full object-cover"
          style={{ filter: 'blur(6px)', transform: 'scale(1.05)' }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} />
        <h1
          className="absolute text-white font-black leading-none"
          style={{
            left: '5%',
            bottom: '-20px',
            fontSize: 'clamp(72px, 10vw, 140px)',
            letterSpacing: '-0.03em',
            lineHeight: 1
          }}
        >
          Shop
        </h1>
      </section>

      {/* SECTION 2 — SEARCH BAR */}
      <div className="w-full bg-white flex items-center justify-between gap-3" style={{ padding: '12px 24px' }}>
        <span className="text-gray-400 text-[13px] hidden sm:inline flex-shrink-0">Give All You Need</span>
        <span className="text-gray-400 text-[13px] sm:hidden flex-shrink-0">Give All You Need</span>
        <div className="relative flex-1 sm:flex-none max-w-full sm:max-w-[260px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            placeholder="Search products..."
            className="w-full outline-none text-gray-800 bg-white placeholder:text-gray-400"
            style={{
              height: 38,
              border: '1.5px solid #E5E5E5',
              borderRadius: 999,
              padding: '0 16px 0 36px',
              fontSize: 13
            }}
          />
        </div>
      </div>

      {/* SECTION 3 — MAIN LAYOUT */}
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-6" style={{ padding: '24px' }}>

        {/* LEFT SIDEBAR — desktop only */}
        <aside className="hidden lg:block flex-shrink-0 bg-white" style={{ width: 200 }}>
          <h3 className="font-bold text-sm text-[#111] mb-4">Category</h3>
          <ul>
            {categories.map(cat => {
              const isActive = activeCategory === cat
              return (
                <li
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className="flex items-center gap-2.5 py-2.5 cursor-pointer"
                  style={{
                    borderBottom: '1px solid #F5F5F5',
                    borderLeft: isActive ? '3px solid #CC2200' : '3px solid transparent',
                    paddingLeft: isActive ? '7px' : '10px'
                  }}
                >
                  <span
                    className="inline-block flex-shrink-0"
                    style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: categoryColors[cat] }}
                  />
                  <span className="text-sm flex-1" style={{ color: isActive ? '#111' : '#666', fontWeight: isActive ? 600 : 400 }}>
                    {cat}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#CC2200] flex-shrink-0" />}
                </li>
              )
            })}
          </ul>
        </aside>

        {/* Mobile/Tablet: horizontal pill filter row */}
        <div className="lg:hidden w-full overflow-x-auto flex gap-2 pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                className="whitespace-nowrap text-xs font-medium rounded-full px-4 cursor-pointer transition-colors flex-shrink-0"
                style={{
                  height: 36,
                  backgroundColor: isActive ? '#111' : 'white',
                  color: isActive ? 'white' : '#111',
                  border: '1px solid #111'
                }}
              >
                {cat}
              </button>
            )
          })}
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="whitespace-nowrap text-xs font-medium rounded-full px-4 cursor-pointer flex-shrink-0"
              style={{ height: 36, backgroundColor: '#CC2200', color: 'white', border: '1px solid #CC2200' }}
            >
              &times; Clear
            </button>
          )}
        </div>

        {/* RIGHT — PRODUCT GRID */}
        <div className="flex-1 min-w-0">
          {pageItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No products match your criteria.</p>
              <button
                onClick={() => { setActiveCategory(null); setSearchQuery('') }}
                className="mt-4 text-sm font-medium text-[#CC2200] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageItems.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}

          {/* SECTION 5 — PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap" style={{ margin: '32px 0' }}>
              <button
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage <= 1}
                className="text-sm cursor-pointer"
                style={{ color: safePage <= 1 ? '#CCC' : '#666', pointerEvents: safePage <= 1 ? 'none' : 'auto' }}
              >
                &larr; Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className="font-semibold text-sm cursor-pointer flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    border: page === safePage ? 'none' : '1px solid #E5E5E5',
                    backgroundColor: page === safePage ? '#111' : 'white',
                    color: page === safePage ? 'white' : '#666'
                  }}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                className="text-sm cursor-pointer"
                style={{ color: safePage >= totalPages ? '#CCC' : '#666', pointerEvents: safePage >= totalPages ? 'none' : 'auto' }}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 6 — RECOMMENDATIONS CAROUSEL */}
      <section className="w-full bg-white" style={{ padding: '40px 24px' }}>
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-center justify-between mb-6 gap-4">
            <h2 className="text-lg sm:text-[22px] font-bold text-black">Explore our recommendations</h2>
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
            {products.map(product => (
              <div
                key={product.id}
                className="flex-shrink-0 bg-white rounded-[10px] overflow-hidden"
                style={{ minWidth: 'clamp(160px, 35vw, 220px)', scrollSnapAlign: 'start', border: '1px solid #EEEEEE' }}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} compact />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — CTA NEWSLETTER */}
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
                onClick={async () => { if (!email) return; try { await subscribeApi(email); setEmail(''); alert('Subscribed successfully!') } catch (err) { alert(err.message) } }}
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
