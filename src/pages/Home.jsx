import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { motion } from 'framer-motion'
import useProducts from '../hooks/useProducts'
import LoadingSpinner from '../components/LoadingSpinner'
import { subscribeApi } from '../services/newsletterService'

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeLeft = {
  hidden: { opacity: 0, x: -70 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const fadeRight = {
  hidden: { opacity: 0, x: 70 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

const staggerSlow = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

const swatchSets = [
  ['#FF0000', '#0000FF', '#00AA00'],
  ['#FF6600', '#9933FF', '#FF3399'],
  ['#CC0000', '#FFCC00', '#0066CC'],
  ['#660099', '#009966', '#FF0066'],
  ['#333333', '#FF3300', '#00CCFF'],
  ['#990000', '#FF9900', '#339933'],
  ['#003366', '#993366', '#66CC00'],
  ['#CC3366', '#336699', '#CC9933']
]

export default function Home() {
  const dispatch = useDispatch()
  const { products, loading } = useProducts()
  const carouselRef = useRef(null)
  const [email, setEmail] = useState('')

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full min-h-screen overflow-hidden bg-gray-50 pt-16 md:pt-0">
        {/* Background model image — right-aligned */}
        <img
          src="/newHeroBackgroundImage.png"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ objectPosition: 'right center' }}
        />

        {/* Left hero content */}
        <motion.div
          className="absolute z-10"
          style={{ left: '6%', bottom: '12%' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.h1
            className="text-[#111] font-black leading-none mb-6"
            style={{
              fontFamily: 'Inter, Helvetica Neue, sans-serif',
              fontSize: 'clamp(48px, 12vw, 120px)'
            }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            stella
          </motion.h1>

          {/* Pagination dots */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full border border-gray-500" />
          </motion.div>

          {/* Navigation arrows */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <div className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        {/* Right side floating product cards — hidden on mobile */}
        <motion.div
          className="hidden md:flex absolute gap-3"
          style={{ right: '4%', top: '30%' }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Card 1 */}
          <motion.div
            className="w-36 bg-white rounded-lg shadow-md p-3"
            whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {products[0] ? (
              <img src={products[0].image} alt={products[0].name} className="w-full aspect-square object-cover rounded mb-2" />
            ) : (
              <div className="w-full aspect-square bg-gray-200 rounded mb-2" />
            )}
            <p className="text-xs font-semibold text-gray-900 truncate">{products[0] ? products[0].name : 'Product'}</p>
            <p className="text-xs text-gray-500 mb-2">${products[0] ? products[0].price.toFixed(2) : '0.00'}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-blue-800 inline-block" />
              </div>
              <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-100">+</span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="w-36 bg-white rounded-lg shadow-md p-3"
            whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {products[1] ? (
              <img src={products[1].image} alt={products[1].name} className="w-full aspect-square object-cover rounded mb-2" />
            ) : (
              <div className="w-full aspect-square bg-gray-200 rounded mb-2" />
            )}
            <p className="text-xs font-semibold text-gray-900 truncate">{products[1] ? products[1].name : 'Product'}</p>
            <p className="text-xs text-gray-500 mb-2">${products[1] ? products[1].price.toFixed(2) : '0.00'}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-blue-800 inline-block" />
              </div>
              <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-100">+</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom right dark card */}
        <motion.div
          className="absolute bottom-0 right-0 z-10 flex items-center gap-3 p-4"
          style={{
            backgroundColor: 'rgba(26, 26, 26, 0.85)',
            borderTopLeftRadius: '16px',
            width: '220px'
          }}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="w-12 h-12 bg-gray-500 rounded flex-shrink-0 overflow-hidden">
            {products[0] && (
              <img src={products[0].image} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <p className="text-white text-xs font-medium">Design 5</p>
            <p className="text-gray-400 text-xs">next collection</p>
          </div>
        </motion.div>
      </section>

      {/* New Arrivals Section */}
      <motion.section
        className="bg-white py-20 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <motion.div
            className="flex flex-col md:flex-row md:items-start justify-between mb-8 md:mb-12 gap-4"
            variants={fadeUp}
          >
            <motion.div variants={fadeLeft}>
              <p className="text-red-500 text-xs font-semibold tracking-widest uppercase mb-1">NEW IN</p>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight">Just Dropped</h2>
              <p className="text-gray-400 text-sm mt-1">Fresh from the studio — limited pieces.</p>
            </motion.div>
            <motion.div className="flex items-center gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} variants={fadeRight}>
              <Link to="/products" className="text-gray-400 text-sm hover:text-gray-600 whitespace-nowrap flex-shrink-0">View All &rarr;</Link>
              <span className="text-gray-300 flex-shrink-0">|</span>
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-500 cursor-pointer hover:border-gray-500 whitespace-nowrap flex-shrink-0">Jackets</span>
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-500 cursor-pointer hover:border-gray-500 whitespace-nowrap flex-shrink-0">Accessories</span>
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-500 cursor-pointer hover:border-gray-500 whitespace-nowrap flex-shrink-0">Knitwear</span>
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-500 cursor-pointer hover:border-gray-500 whitespace-nowrap flex-shrink-0">Bags</span>
              <span className="text-xs border border-gray-300 rounded-full px-3 py-1 text-gray-500 cursor-pointer hover:border-gray-500 whitespace-nowrap flex-shrink-0">Shoes</span>
            </motion.div>
          </motion.div>

          {/* Product grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerGrid}
            >
              {products.slice(0, 8).map((product, i) => {
                const swatches = swatchSets[i % swatchSets.length]
                return (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
                    variants={scaleIn}
                    whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-square bg-white flex items-center justify-center p-4">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <p className="text-gray-400 text-xs tracking-widest uppercase mt-3">{product.category}</p>
                      <Link to={`/products/${product.id}`}>
                        <p className="text-sm font-bold text-gray-900 mt-1">{product.name}</p>
                      </Link>
                      <p className="text-gray-500 text-sm mt-0.5">${product.price.toFixed(2)}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-1">
                          {swatches.map((color, ci) => (
                            <span
                              key={ci}
                              className="w-3.5 h-3.5 rounded-full inline-block"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <motion.button
                          onClick={() => dispatch(addToCart(product))}
                          className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 text-sm hover:bg-gray-100 transition-colors"
                          whileHover={{ rotate: 90, scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Brand Story Section */}
      <section className="w-full flex flex-col md:flex-row">
        <motion.div
          className="w-full md:w-1/2 flex items-center"
          style={{ backgroundColor: '#F2F0ED', padding: '40px 24px' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeLeft}
        >
          <div>
            <h2
              className="font-black leading-[0.88] text-[#0D0D0D]"
              style={{ fontSize: 'clamp(40px, 8vw, 96px)' }}
            >
              WHERE<br />OBSESSION<br />BECOMES<br />FASHION
            </h2>
            <motion.div
              className="mt-8 md:mt-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <p className="text-gray-500 text-sm leading-relaxed" style={{ maxWidth: '380px' }}>
                Crafted for those who refuse to blend in. Every piece tells a story.
              </p>
              <motion.button
                className="mt-6 rounded-full text-[13px] font-medium cursor-pointer hover:bg-[#0D0D0D] hover:text-white transition-colors"
                style={{
                  border: '1.5px solid #0D0D0D',
                  padding: '10px 24px',
                  color: '#0D0D0D'
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Story &rarr;
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="w-full md:w-1/2 min-h-[300px] md:min-h-0 overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeRight}
        >
          <img
            src="/brand story right image.jpeg"
            alt="Brand story"
            className="w-full h-full object-cover object-top"
          />
        </motion.div>
      </section>

      {/* Bestsellers Section */}
      <motion.section
        className="py-20 px-4"
        style={{ backgroundColor: '#F5F3F0' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <motion.div className="flex items-end justify-between mb-10" variants={fadeUp}>
            <motion.div variants={fadeLeft}>
              <p className="text-red-500 text-xs font-semibold tracking-widest uppercase mb-1">BESTSELLERS</p>
              <h2 className="text-4xl font-bold text-gray-900">The Ones Everyone Wants</h2>
            </motion.div>
            <motion.div className="flex items-center gap-3" variants={fadeRight}>
              <button
                onClick={() => carouselRef.current?.scrollBy({ left: -260, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                style={{ border: '1.5px solid #DDDDDD' }}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => carouselRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#CC2200' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* Carousel */}
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <motion.div
              ref={carouselRef}
              className="flex gap-5 overflow-x-auto pb-4"
              style={{
                scrollBehavior: 'smooth',
                scrollSnapType: 'x mandatory',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
              variants={staggerGrid}
            >
              {products.slice(0, 8).map((product, i) => {
                const swatches = swatchSets[i % swatchSets.length]
                return (
                  <motion.div
                    key={product.id}
                    className="flex-shrink-0 bg-white rounded-2xl overflow-hidden"
                    style={{
                      width: 'clamp(160px, 40vw, 220px)',
                      scrollSnapAlign: 'start',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                    variants={scaleIn}
                    whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(0,0,0,0.15)' }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="overflow-hidden" style={{ height: '280px' }}>
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'top center' }}
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </Link>
                    <hr style={{ border: 'none', borderTop: '1px solid #F0F0F0' }} />
                    <div className="p-3.5">
                      <p className="text-gray-400 text-xs tracking-widest uppercase">{product.category}</p>
                      <Link to={`/products/${product.id}`}>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">{product.name}</p>
                      </Link>
                      <p className="text-gray-500 text-sm mt-0.5">${product.price.toFixed(2)}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-1">
                          {swatches.map((color, ci) => (
                            <span
                              key={ci}
                              className="w-3 h-3 rounded-full inline-block"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <motion.button
                          onClick={() => dispatch(addToCart(product))}
                          className="text-white text-xs font-medium rounded-full px-4 py-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#CC2200' }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Lookbook Section */}
      <section
        className="w-full relative min-h-[620px]"
        style={{
          backgroundImage: 'url(/lookbook%20background%20image.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Content - right 50% dark area */}
        <motion.div
          className="absolute inset-0 md:left-1/2 flex flex-col justify-center"
          style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.85) 100%)',
            padding: '0 24px'
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeRight}
        >
          <div className="md:pl-12 lg:pl-16 max-w-lg">
            <motion.div variants={staggerSlow}>
              <motion.span
                className="inline-block text-white text-[11px] font-semibold tracking-widest rounded-full px-3.5 py-1"
                style={{ backgroundColor: '#CC2200' }}
                variants={fadeUp}
              >
                LOOKBOOK 2026
              </motion.span>
              <motion.h2
                className="text-white font-black leading-[0.85] mt-6"
                style={{ fontSize: 'clamp(48px, 10vw, 110px)' }}
                variants={fadeUp}
              >
                THE<br />RED<br />EDIT
              </motion.h2>
              <motion.p className="text-gray-400 text-sm mt-6 leading-relaxed" style={{ maxWidth: '400px' }} variants={fadeUp}>
                A study in confidence. Twelve looks. One obsession.
              </motion.p>
              <motion.button
                className="mt-8 rounded-full text-[13px] font-medium cursor-pointer transition-colors duration-200 hover:bg-white hover:text-black"
                style={{
                  border: '1.5px solid #FFFFFF',
                  color: '#FFFFFF',
                  padding: '12px 28px',
                  backgroundColor: 'transparent'
                }}
                variants={fadeUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Lookbook &rarr;
              </motion.button>
              <motion.div className="flex gap-3 mt-8" variants={fadeUp}>
                <motion.img src="/one.jpeg" alt="Lookbook thumb" className="w-[72px] h-[72px] rounded-lg object-cover" whileHover={{ scale: 1.1, y: -4 }} />
                <motion.img src="/two.jpeg" alt="Lookbook thumb" className="w-[72px] h-[72px] rounded-lg object-cover" whileHover={{ scale: 1.1, y: -4 }} />
                <motion.img src="/three.jpeg" alt="Lookbook thumb" className="w-[72px] h-[72px] rounded-lg object-cover" whileHover={{ scale: 1.1, y: -4 }} />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Press Section */}
      <motion.section
        className="w-full bg-white"
        style={{ padding: '100px 0' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
      >
        <div className="max-w-[800px] mx-auto px-4 text-center">
          {/* Red line */}
          <motion.div className="mx-auto mb-10" style={{ width: '48px', height: '2px', backgroundColor: '#CC2200' }} variants={scaleIn} />

          {/* Quote */}
          <motion.p
            className="text-[#1a1a1a] leading-relaxed"
            style={{ fontSize: '26px', fontFamily: 'Playfair Display, Georgia, serif', fontStyle: 'italic' }}
            variants={fadeUp}
          >
            The most compelling and fearless collection to emerge from European fashion in a decade.
          </motion.p>
          <motion.p className="mt-6 text-[#999999] text-xs tracking-widest uppercase font-normal" variants={fadeUp}>
            &mdash; Vogue Paris, March 2026
          </motion.p>

          {/* Divider */}
          <motion.div className="mt-16 w-full" style={{ height: '1px', backgroundColor: '#EEEEEE' }} variants={fadeUp} />

          {/* Press logos row */}
          <motion.div className="mt-8 md:mt-12 flex items-center justify-center flex-wrap gap-x-8 gap-y-4 md:gap-x-0 md:justify-between" variants={staggerGrid}>
            {['VOGUE', 'BAZAAR', 'ELLE', 'WWD', 'GQ', 'Wallpaper'].map((name, i) => (
              <motion.span
                key={name}
                className="text-[#BBBBBB] font-bold cursor-pointer"
                style={{ fontSize: i % 2 === 0 ? 'clamp(18px, 3vw, 22px)' : 'clamp(15px, 2.5vw, 18px)' }}
                variants={scaleIn}
                whileHover={{ color: '#CC2200', scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {name}
              </motion.span>
            ))}
          </motion.div>

          {/* Featured in label */}
          <motion.p className="mt-8 text-[#BBBBBB] text-[10px] tracking-widest uppercase" variants={fadeUp}>AS FEATURED IN</motion.p>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        className="w-full"
        style={{ backgroundColor: '#F2F0ED', minHeight: '280px' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10 md:gap-20" style={{ padding: '40px 24px' }}>
          {/* Left side */}
          <motion.div className="w-full md:flex-1" variants={fadeLeft}>
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xs font-semibold tracking-widest uppercase">STAY AHEAD</span>
              <span className="w-px h-3" style={{ backgroundColor: '#CCCCCC' }} />
              <span className="text-gray-400 text-xs">3.2k tracking</span>
            </div>
            <h2
              className="mt-3 font-black leading-[1.05] text-[#0D0D0D]"
              style={{ fontSize: 'clamp(28px, 5vw, 48px)' }}
            >
              Get Early Access<br />To Every Drop
            </h2>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed" style={{ maxWidth: '380px' }}>
              Join 40,000+ members who get first access to new collections, exclusive offers, and editorial content.
            </p>
          </motion.div>

          {/* Right side */}
          <motion.div className="w-full md:flex-1" variants={fadeRight}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-lg outline-none text-sm"
              style={{
                height: '52px',
                border: '1.5px solid #DDDDDD',
                backgroundColor: '#FFFFFF',
                padding: '0 16px',
                color: '#333333'
              }}
            />
            <motion.button
              onClick={async () => {
                if (!email) return
                try {
                  await subscribeApi(email)
                  setEmail('')
                  alert('Subscribed successfully!')
                } catch (err) {
                  alert(err.message)
                }
              }}
              className="w-full rounded-full text-white text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity mt-3"
              style={{ backgroundColor: '#0D0D0D', padding: '14px 32px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Subscribe &rarr;
            </motion.button>
            <p className="mt-2 text-center text-[11px]" style={{ color: '#999999' }}>
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
            <div className="mt-4 flex items-center justify-center gap-6 sm:gap-8 flex-wrap">
              <div className="text-center">
                <p className="text-xs font-bold text-[#0D0D0D]">40K+ Members</p>
                <p className="text-xs" style={{ color: '#999999' }}>Growing daily</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-[#0D0D0D]">Weekly Drops</p>
                <p className="text-xs" style={{ color: '#999999' }}>New every week</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-[#0D0D0D]">Exclusive Access</p>
                <p className="text-xs" style={{ color: '#999999' }}>Members only</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
