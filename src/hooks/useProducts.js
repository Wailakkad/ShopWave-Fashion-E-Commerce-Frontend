import { useState, useEffect } from 'react'
import { fetchProducts } from '../services/api'

export default function useProducts() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
      .then(setData)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])
  return { products: data, loading }
}
