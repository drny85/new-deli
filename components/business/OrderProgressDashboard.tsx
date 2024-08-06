import { SIZES } from '@/constants/Colors'
import NeoView from '../NeoView'
import { Text } from '../ThemedText'
import { TouchableOpacity } from 'react-native'
import CircularProgressBar from '../CircularProgressBar'
import Row from '../Row'
import { router } from 'expo-router'
import { Order, ORDER_STATUS } from '@/typing'
import { View } from '../ThemedView'
import useOrientation from '@/hooks/useOrientation'

const RADIUS = 60
type Props = {
   orders: Order[]
}

const OrderProgressDashboard = ({ orders }: Props) => {
   const orientation = useOrientation()
   const orderByStatus = orders.reduce(
      (acc, order) => {
         if (!acc[order.status]) {
            acc[order.status] = 0
         }
         acc[order.status]++
         return acc
      },
      {} as Record<ORDER_STATUS, number>
   )

   return (
      <NeoView
         innerStyleContainer={{ padding: SIZES.md, borderRadius: SIZES.lg }}
         containerStyle={{ borderRadius: SIZES.lg }}>
         <Text center type="header">
            Today Orders
         </Text>
         {orders.length === 0 && (
            <View center style={{ padding: SIZES.lg * 2 }}>
               <Text>No Orders</Text>
            </View>
         )}
         {orders.length > 0 && (
            <Row containerStyle={{ gap: SIZES.md, marginTop: SIZES.md }} align="evenly">
               <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/')}>
                  <CircularProgressBar
                     radius={RADIUS}
                     currentValue={(orderByStatus.new / orders.length) * 100 || 0}
                     strokeWidth={RADIUS / 4}
                     maxValue={100}
                     title="New"
                  />
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/progress')}>
                  <CircularProgressBar
                     radius={RADIUS}
                     currentValue={(orderByStatus.in_progress / orders.length) * 100 || 0}
                     strokeWidth={RADIUS / 4}
                     maxValue={100}
                     title="On The Making"
                  />
               </TouchableOpacity>
               {orderByStatus.marked_ready_for_pickup > 0 && (
                  <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/in-route')}>
                     <CircularProgressBar
                        radius={RADIUS}
                        currentValue={
                           (orderByStatus.marked_ready_for_pickup / orders.length) * 100 || 0
                        }
                        strokeWidth={RADIUS / 4}
                        maxValue={100}
                        title="Ready For Pickup"
                     />
                  </TouchableOpacity>
               )}
               <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/in-route')}>
                  <CircularProgressBar
                     radius={RADIUS}
                     currentValue={
                        (orderByStatus.marked_ready_for_delivery / orders.length) * 100 || 0
                     }
                     strokeWidth={RADIUS / 4}
                     maxValue={100}
                     title="On Delivery"
                  />
               </TouchableOpacity>
               <TouchableOpacity activeOpacity={0.6} onPress={() => router.push('/delivered')}>
                  <CircularProgressBar
                     radius={RADIUS}
                     currentValue={
                        ((orderByStatus.delivered || 0 + orderByStatus.picked_up_by_client || 0) /
                           orders.length) *
                           100 || 0
                     }
                     strokeWidth={RADIUS / 4}
                     maxValue={100}
                     title="Delivered / Picked Up"
                  />
               </TouchableOpacity>
               {orderByStatus.cancelled > 0 ||
                  (orientation === 'landscape' && (
                     <CircularProgressBar
                        radius={RADIUS}
                        currentValue={(orderByStatus.cancelled / orders.length) * 100 || 0}
                        strokeWidth={RADIUS / 4}
                        maxValue={100}
                        title="Cancelled"
                     />
                  ))}
            </Row>
         )}
      </NeoView>
   )
}

export default OrderProgressDashboard
