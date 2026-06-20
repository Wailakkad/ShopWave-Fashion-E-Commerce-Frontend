import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-[#111]">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6" style={{ padding: '32px 24px' }}>
        <Link to="/" className="text-white text-lg font-bold tracking-tight">ETRO</Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-400 text-sm hover:text-white transition-colors">Home</Link>
          <Link to="/products" className="text-gray-400 text-sm hover:text-white transition-colors">Products</Link>
          <Link to="/cart" className="text-gray-400 text-sm hover:text-white transition-colors">Cart</Link>
        </div>
        <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} ETRO. All rights reserved.</p>
      </div>
    </footer>
  )
}
