import { updateOrder } from '@/actions/business'
import CourierMap from '@/components/business/CouriersMap'
import Loading from '@/components/Loading'
import { View } from '@/components/ThemedView'
import { useOrder } from '@/hooks/orders/useOrder'
import { Courier, Order, ORDER_STATUS } from '@/typing'
import { generateRandomNumbers } from '@/utils/generateRandomNumber'
import { router, useLocalSearchParams } from 'expo-router'

const CourierAssigment = () => {
   const { orderId } = useLocalSearchParams<{ orderId: string }>()
   const { loading, order } = useOrder(orderId!)

   const handleOnPress = async (courier: Courier) => {
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
            router.dismissAll()
         }
      } catch (error) {
         console.log(error)
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
