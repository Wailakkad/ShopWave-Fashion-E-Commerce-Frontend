import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { fetchProducts } from '../services/api'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const cartCount = useSelector(
    state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
  )
  const { user } = useSelector(state => state.auth)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    fetchProducts().then(setAllProducts).catch(() => {})
  }, [])

  const results = query.trim()
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : []

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setQuery('')
        setMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleSelect(id) {
    setSearchOpen(false)
    setQuery('')
    setMenuOpen(false)
    navigate(`/products/${id}`)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <Link to="/" className="text-[#111] text-lg sm:text-xl font-bold tracking-tight">ETRO</Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/" className="text-gray-600 text-sm font-normal tracking-[0.05em] hover:text-black transition-colors">Home</Link>
          <Link to="/products" className="text-gray-600 text-sm font-normal tracking-[0.05em] hover:text-black transition-colors">Products</Link>
          <Link to="/cart" className="relative text-gray-600 text-sm font-normal tracking-[0.05em] hover:text-black transition-colors">
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/profile" className="text-gray-600 text-sm font-normal tracking-[0.05em] hover:text-black transition-colors">{user.name}</Link>
          ) : (
            <Link to="/login" className="text-gray-600 text-sm font-normal tracking-[0.05em] hover:text-black transition-colors">Sign In</Link>
          )}
        </div>

        {/* Right side — mobile/tablet */}
        <div className="flex md:hidden items-center gap-3" ref={searchRef}>
          {/* Search toggle */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent text-sm text-gray-800 outline-none w-28 sm:w-36 placeholder:text-gray-400"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 ml-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-gray-600 hover:text-black p-1.5 cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {searchOpen && query && results.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {results.slice(0, 6).map(product => (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 flex-shrink-0">${product.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}

            {searchOpen && query && results.length === 0 && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center z-50">
                <p className="text-sm text-gray-400">No products found</p>
              </div>
            )}
          </div>

          {/* Cart icon */}
          <Link to="/cart" className="relative p-1.5 text-gray-600 hover:text-black">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-gray-600 hover:text-black cursor-pointer min-h-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Full-screen mobile/tablet hamburger menu — slide from right */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ease-in-out ${
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-sm bg-[#111] flex flex-col transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu header */}
          <div className="flex items-center justify-between px-6 py-5">
            <span className="text-white text-lg font-bold tracking-tight">ETRO</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white/80 hover:text-white cursor-pointer p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <div className="flex-1 flex flex-col justify-center px-6">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-white text-3xl font-bold py-4 hover:text-gray-300 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMenuOpen(false)}
              className="text-white text-3xl font-bold py-4 hover:text-gray-300 transition-colors"
            >
              Products
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="text-white text-3xl font-bold py-4 hover:text-gray-300 transition-colors flex items-center gap-3"
            >
              Cart
              {cartCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-white text-3xl font-bold py-4 hover:text-gray-300 transition-colors"
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-white text-3xl font-bold py-4 hover:text-gray-300 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Bottom icons */}
          <div className="flex items-center gap-6 px-6 py-8 border-t border-white/10">
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
