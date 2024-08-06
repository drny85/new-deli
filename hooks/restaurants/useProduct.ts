import { productsCollection } from '@/collections'
import { Product } from '@/typing'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useProduct = (businessId: string, productId: string) => {
   const [product, setProduct] = useState<Product | null>(null)
   const [loading, setLoading] = useState(false)
   useEffect(() => {
      if (!productId || !businessId!) return
      const productRef = doc(productsCollection(businessId), productId)
      setLoading(true)
      return onSnapshot(productRef, (snap) => {
         if (!snap.exists()) {
            setLoading(false)
            return
         }
         setProduct({ id: snap.id, ...snap.data() } as Product)
         setLoading(false)
      })
   }, [productId, businessId])

   return { product, loading }
}
