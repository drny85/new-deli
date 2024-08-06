import { useEffect } from 'react'
import { ordersCollection } from '@/collections'
import { useAuth } from '@/providers/authProvider'
import { useFeaturesStore } from '@/stores/featuresStore'
import { dayjsFormat } from '@/utils/dayjs'
import { limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'

const useNewOrderAlert = () => {
   const { user } = useAuth()
   const { setShowNewOrderPopup, setPopupParams } = useFeaturesStore()
   useEffect(() => {
      // Subscribe to Firestore orders collection
      // const unsubscribe = firestore()
      //   .collection('orders')
      //   .orderBy('createdAt', 'desc')
      //   .limit(1)
      const ref = query(
         ordersCollection,
         where('businessId', '==', user?.id),
         orderBy('orderDate', 'desc'),
         limit(1)
      )

      const unsubscribe = onSnapshot(ref, async (snapshot) => {
         if (!snapshot.empty) {
            // Play sound twice for new order
            const order = snapshot.docs[0].exists() ? snapshot.docs[0].data() : null

            if (order) {
               const canPlay = dayjsFormat(order.orderDate).diff(dayjsFormat(), 'seconds')
               if (Math.abs(canPlay) > 5) return
               console.log('new order #', order.orderNumber)
               // Show popup
               setShowNewOrderPopup(true)
               setPopupParams({
                  title: 'New Order',
                  description: `Total: $${order.total.toFixed(2)}, Items: ${order.items.reduce((acc, curr) => acc + curr.quantity, 0)}`
               })
            }
         }
      })

      return () => {
         // Cleanup
         unsubscribe()
      }
   }, [])
}

export default useNewOrderAlert
