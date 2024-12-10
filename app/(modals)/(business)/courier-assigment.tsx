import { updateBusinessCourier, updateOrder } from '@/actions/business'
import CourierMap from '@/components/business/CouriersMap'
import Loading from '@/components/Loading'
import { View } from '@/components/ThemedView'
import { db } from '@/firebase'
import { useOrder } from '@/hooks/orders/useOrder'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { Courier, Order, ORDER_STATUS } from '@/shared/types'
import { generateRandomNumbers } from '@/utils/generateRandomNumber'
import { router, useLocalSearchParams } from 'expo-router'
import { collection, doc, setDoc } from 'firebase/firestore'
import { Alert } from 'react-native'

const CourierAssigment = () => {
   const { orderId } = useLocalSearchParams<{ orderId: string }>()
   const { loading, order } = useOrder(orderId!)
   const { restaurant } = useRestaurant(order?.businessId!)

   const handleOnPress = async (courier: Courier) => {
      const isActive = checkIfCourierIsActive(courier.id!)
      if (!isActive) return
      if (!courier || !order) return
      try {
         const newOrder: Order = {
            ...order!,
            status: ORDER_STATUS.marked_ready_for_delivery,
            readyOn: new Date().toISOString(),
            otpPickup: generateRandomNumbers(),
            courier: { ...courier!, agreement: [] }
         }

         const updated = await updateOrder(newOrder)

         if (updated) {
            const refDoc = doc(collection(db, 'deliveries'), orderId)
            await setDoc(refDoc, {
               orderId,
               courierId: courier.id,
               orderDate: new Date().toISOString()
            })
            router.dismissAll()
         }
      } catch (error) {
         console.log(error)
      }
   }

   const checkIfCourierIsActive = (courierId: string) => {
      const isActive = restaurant?.couriers.map((c) => c.active && c.id).includes(courierId)
      if (!isActive) {
         Alert.alert('Courier is not active', 'Please activate the courier first', [
            {
               text: 'Activate Courier',
               onPress: async () => {
                  // router.push({ pathname: '/[courierId]', params: { courierId: courier.id! } })
                  const updated = await updateBusinessCourier(courierId, restaurant?.id!)
                  if (updated) {
                     return true
                  }
               }
            },
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel'
            }
         ])
         return false
      } else {
         return true
      }
   }

   if (loading) return <Loading />

   return (
      <View style={{ flex: 1 }}>
         <CourierMap onPress={(c) => handleOnPress(c)} assigedCourier={order?.courier!} />
      </View>
   )
}

export default CourierAssigment
