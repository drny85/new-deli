import { productsCollection } from '@/collections'
import { Product } from '@/typing'
import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useProducts = (restaurantId: string) => {
   const [products, setProducts] = useState<Product[]>([])
   const [loading, setLoading] = useState(false)
   useEffect(() => {
      if (!restaurantId) return
      setLoading(true)
      return onSnapshot(productsCollection(restaurantId), (snapshot) => {
         setProducts(
            snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data()
            }))
         )
         setLoading(false)
      })
   }, [])

   return { products, loading }
}
