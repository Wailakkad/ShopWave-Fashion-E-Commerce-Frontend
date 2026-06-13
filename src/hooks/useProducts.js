import { useState, useEffect } from 'react'
import products from '../data/products'

export default function useProducts() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(products)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return { products: data, loading }
}
