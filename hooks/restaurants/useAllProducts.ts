import { productsCollection } from '@/collections'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Product } from '@/shared/types'
import { getDocs } from 'firebase/firestore'
import { useCallback, useEffect, useState } from 'react'
import { useRestaurants } from './useRestaurants'
import { useAuth } from '@/providers/authProvider'

export const useAllProducts = (refetch?: boolean) => {
   const { user } = useAuth()
   const [products, setProducts] = useState<Product[]>([])

   const { restaurants, loading } = useRestaurants()
   const setProductos = useRestaurantsStore((s) => s.setProducts)

   const getProducts = useCallback(async () => {
      try {
         console.log('getting products and restaurants')

         if (restaurants.length === 0) return
         const ids = user && user.type === 'business' ? [user.id] : restaurants.map((r) => r.id)
         const items: Product[] = []

         const promises = ids.map((p) => getDocs(productsCollection(p!)))
         const results = await Promise.all(promises)

         results.forEach((r) => r.docs.map((d) => items.push({ id: d.id, ...d.data() })))
         setProducts(items)
         setProductos(items)
      } catch (error) {
         console.log(error)
         return
      }
   }, [restaurants])

   useEffect(() => {
      if (loading) return

      getProducts()
   }, [loading, restaurants, refetch])

   return { products, restaurants, loading }
}
