import { ordersCollection } from '@/collections'
import { useAuth } from '@/providers/authProvider'
import { dayjsFormat } from '@/utils/dayjs'
import { limit, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect } from 'react'
import { toast } from 'sonner-native'
import { useAudioPlayer } from 'expo-audio'

import audioSource from '@/assets/audio/new_order.wav'
import { router } from 'expo-router'
import { SIZES } from '@/constants/Colors'

const useNewOrderAlert = () => {
   const { user } = useAuth()
   const player = useAudioPlayer(audioSource)
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

               toast('New Order', {
                  duration: 5000,
                  action: {
                     label: 'View',
                     onClick: () => {
                        // Navigate to order details
                        toast.dismiss()
                        router.push({
                           pathname: '/order',
                           params: { orderId: order.id }
                        })
                     }
                  },
                  actionButtonStyle: {
                     paddingHorizontal: SIZES.lg
                  },
                  cancel: {
                     label: 'Dismiss',
                     onClick: () => {
                        console.log('dismissed')
                     }
                  },
                  description: `Order #${order.orderNumber}\nType:${order.orderType}\nTotal: $${order.total.toFixed(2)}, Items: ${order.items.reduce((acc, curr) => acc + curr.quantity, 0)}`
               })
               player.play()
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
