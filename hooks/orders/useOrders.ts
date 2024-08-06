import { updateETA } from '@/actions/business'
import { ordersCollection } from '@/collections'
import { useAuth } from '@/providers/authProvider'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { Order } from '@/typing'

import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useOrders = (businessId?: string) => {
   const { user } = useAuth()
   const [orders, setOrders] = useState<Order[]>([])
   const setBusinessOrder = useBusinessOrdersStore((s) => s.setOrders)
   const [loading, setLoading] = useState(false)
   useEffect(() => {
      if (!user) return
      setLoading(true)

      const querySearch = businessId
         ? where('businessId', '==', businessId)
         : where('userId', '==', user?.id)
      const ordersRef = query(ordersCollection, querySearch)
      return onSnapshot(ordersRef, async (snapshot) => {
         if (businessId) {
            const data = snapshot.docs
               .map((d) => ({ id: d.id, ...d.data() }))
               .sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1))
            setBusinessOrder(data)
            await updateETA(data)
         } else {
            setOrders(
               snapshot.docs
                  .map((d) => ({ id: d.id, ...d.data() }))
                  .sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1))
            )
         }

         setLoading(false)
      })
   }, [user, businessId])

   return { orders, loading }
}
