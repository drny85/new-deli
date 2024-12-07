import { ordersCollection } from '@/collections'
import { Order } from '@/shared/types'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useOrder = (orderId: string) => {
   const [order, setOrder] = useState<Order | null>(null)
   const [loading, setLoading] = useState(false)
   useEffect(() => {
      if (!orderId) return
      setLoading(true)
      const orderRef = doc(ordersCollection, orderId)
      return onSnapshot(orderRef, (snap) => {
         setOrder({ id: snap.id, ...snap.data() } as Order)
         setLoading(false)
      })
   }, [orderId])

   return { order, loading }
}
