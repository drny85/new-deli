import { updateOrder } from '@/actions/business'
import OrderStatusPicker from '@/components/business/StatusPicker'
import Button from '@/components/Button'
import CartItems from '@/components/checkout/CartItems'
import TotalView from '@/components/checkout/TotalView'
import { Container } from '@/components/Container'
import CourierCard from '@/components/CourierCard'
import Divider from '@/components/Divider'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import OTP from '@/components/Otp'
import PhoneCall from '@/components/PhoneCall'
import Row from '@/components/Row'
import { Sheet, useSheetRef } from '@/components/Sheet'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useOrder } from '@/hooks/orders/useOrder'
import { useAuth } from '@/providers/authProvider'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Order, ORDER_STATUS, ORDER_TYPE } from '@/typing'
import { dayjsFormat } from '@/utils/dayjs'
import { generateRandomNumbers } from '@/utils/generateRandomNumber'
import { STATUS_NAME } from '@/utils/orderStatus'
import { Redirect, router, Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView } from 'react-native'

const BussinessOrder = () => {
   const { user } = useAuth()
   const { orderId } = useLocalSearchParams<{ orderId: string }>()
   const { order, loading } = useOrder(orderId!)
   const [isModalVisible, setModalVisible] = useState(false)
   const itemsCount = order?.items.reduce((acc, curr) => acc + curr.quantity, 0)
   const [otp, setOPT] = useState<number | null>(null)
   const restaurant = useRestaurantsStore((s) => s.restaurant)
   const { orders, setShowOtp, showOtp } = useBusinessOrdersStore()
   const bottomSheetRef = useSheetRef()

   const orderPlacedByCustomer = (): number => {
      return orders.filter((o) => o.contactPerson.userId === order?.contactPerson.userId).length
   }
   const lastOrderPlaced = (): string => {
      if (orders.length < 2) return ''
      const t =
         order?.status !== ORDER_STATUS.delivered &&
         order?.status !== ORDER_STATUS.picked_up_by_client
            ? 1
            : 0
      return (
         orders
            .filter((o) => o.contactPerson.userId === order?.contactPerson.userId)
            .sort((a, b) => b.orderDate.localeCompare(a.orderDate))[t].orderDate || ''
      )
   }

   const onCallBackSuccess = async () => {
      try {
         if (!order) return
         await updateOrder({
            ...order,
            status: ORDER_STATUS.picked_up_by_client,
            otpPickup: null,
            pickedUpOn: new Date().toISOString()
         })
         setOPT(null)
         setShowOtp(false)
      } catch (error) {
         console.log(error)
      }
   }

   const handleStatusChange = async (status: ORDER_STATUS) => {
      try {
         if (!order) return
         if (status === ORDER_STATUS.cancelled) {
            Alert.alert('Are you sure?', 'This action cannot be undone', [
               {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
               },
               { text: 'OK', onPress: handleOrderCancel }
            ])
            return
         }
         if (status === ORDER_STATUS.marked_ready_for_delivery) {
            router.push({
               pathname: '/courier-assigment',
               params: { orderId }
            })
            return
         }
         if (
            status === ORDER_STATUS.picked_up_by_client &&
            order.otpPickup &&
            order.status === ORDER_STATUS.marked_ready_for_pickup &&
            restaurant?.requiredOTP
         ) {
            console.log('Opening OTP')
            setOPT(order.otpPickup)

            setShowOtp(true)
            return
         } else if (
            status === ORDER_STATUS.picked_up_by_client &&
            order.otpPickup &&
            order.status === ORDER_STATUS.marked_ready_for_pickup &&
            !restaurant?.requiredOTP
         ) {
            onCallBackSuccess()
         }
         let updatedOrder: Order
         updatedOrder = {
            ...order,
            status
         }
         if (status === ORDER_STATUS.marked_ready_for_pickup) {
            updatedOrder = {
               ...order,
               status,
               readyForPickupAt: new Date().toISOString(),
               readyOn: new Date().toISOString(),
               otpPickup: restaurant?.requiredOTP ? generateRandomNumbers() : null
            }
         }

         await updateOrder(updatedOrder)
      } catch (error) {
         console.log(error)
      }
      // Perform additional actions with the new status if needed
   }

   const handleOrderCancel = () => {
      console.log('Order Cancelled')
   }

   useEffect(() => {
      if (!showOtp) {
         bottomSheetRef.current?.dismiss()
      } else {
         bottomSheetRef.current?.present()
      }
   }, [showOtp])

   if (loading || !order) return <Loading />

   if (!user || user.type === 'consumer') return <Redirect href={'/(tabs)/(restaurants)'} />
   return (
      <Container>
         <Stack.Screen
            options={{
               headerRight: () =>
                  order?.status === ORDER_STATUS.new && order.items.length > 1 ? (
                     <Button
                        title="Modify Order"
                        type="soft"
                        contentTextStyle={{ paddingHorizontal: SIZES.md }}
                        onPress={() => {
                           router.push({
                              pathname: '/modify-order',
                              params: { orderId }
                           })
                        }}
                     />
                  ) : undefined
            }}
         />
         <ScrollView
            contentContainerStyle={{
               padding: SIZES.md,
               marginTop: SIZES.md
            }}>
            <View style={{ marginBottom: SIZES.md }}>
               <Row
                  align="between"
                  containerStyle={{ alignItems: 'flex-start', paddingHorizontal: SIZES.md }}>
                  <NeoView
                     containerStyle={{ borderRadius: SIZES.lg }}
                     innerStyleContainer={{
                        borderRadius: SIZES.lg,
                        padding: SIZES.md
                     }}>
                     <Text fontSize="large" type="defaultSemiBold">
                        Customer Information
                     </Text>
                     <View style={{ padding: SIZES.sm }}>
                        <Text>
                           Name: {order.contactPerson.name} {order.contactPerson.lastName}
                        </Text>
                        {order.orderType === ORDER_TYPE.delivery && (
                           <>
                              <Text>{order.address?.street.slice(0, -15)}</Text>
                              {order.address?.apt && <Text>Apt / FLR: {order.address?.apt}</Text>}
                           </>
                        )}
                        <Row containerStyle={{ gap: SIZES.lg }}>
                           <Text>Phone: {order.contactPerson.phone}</Text>
                           <PhoneCall phone={order.contactPerson.phone} />
                        </Row>
                        <Text type="muted">Total Orders Placed: {orderPlacedByCustomer()}</Text>
                        {lastOrderPlaced() && (
                           <Text style={{ marginTop: SIZES.sm }} type="muted">
                              Last Order Placed: {dayjsFormat(lastOrderPlaced()).format('lll')}
                           </Text>
                        )}
                     </View>
                  </NeoView>
                  <NeoView
                     containerStyle={{ borderRadius: SIZES.lg }}
                     innerStyleContainer={{
                        borderRadius: SIZES.lg,
                        padding: SIZES.md,
                        minHeight: SIZES.height * 0.15
                     }}>
                     <Text fontSize="large" type="defaultSemiBold">
                        Order Information
                     </Text>
                     <View style={{ padding: SIZES.sm }}>
                        <Text type="defaultSemiBold">Order #: {order.orderNumber}</Text>
                        <Text type="muted">Order ID: {order.id}</Text>
                        <Text>Order Date: {dayjsFormat(order.orderDate).format('lll')}</Text>
                        <Text>
                           Order Type:{' '}
                           {order.orderType === ORDER_TYPE.delivery ? 'Delivery' : 'Pick Up'}
                        </Text>
                     </View>
                  </NeoView>
               </Row>
            </View>
            <View
               style={{
                  alignSelf: 'center',

                  width: '45%',
                  marginVertical: SIZES.sm,
                  gap: SIZES.sm
               }}>
               <Text fontSize="large" type="muted" center>
                  Current Status:{' '}
                  <Text type="defaultSemiBold" style={{ fontSize: 18 }}>
                     {STATUS_NAME(order.status)}
                  </Text>
               </Text>
               {order.deliveredBy && (
                  <View style={{ alignItems: 'center' }}>
                     <Text>Delivered By: {order.deliveredBy.name}</Text>
                     <Text>Delivered On: {dayjsFormat(order.deliveredOn).format('lll')}</Text>
                  </View>
               )}
               {order.pickedUpOn && (
                  <View style={{ alignItems: 'center' }}>
                     <Text>Picked Up On: {dayjsFormat(order.pickedUpOn).format('lll')}</Text>
                  </View>
               )}
               {order.courier && order.status !== ORDER_STATUS.delivered && (
                  <View
                     style={{
                        marginVertical: SIZES.sm,
                        gap: SIZES.sm
                     }}>
                     <Text type="defaultSemiBold" center>
                        Assigned Courier
                     </Text>
                     <CourierCard
                        courier={order.courier}
                        onPress={() =>
                           router.push({
                              pathname: '/courier-assigment',
                              params: { orderId }
                           })
                        }
                     />
                  </View>
               )}
               {order.status !== ORDER_STATUS.delivered &&
                  order.status !== ORDER_STATUS.cancelled &&
                  order.status !== ORDER_STATUS.picked_up_by_client && (
                     <Button
                        type="soft"
                        title="Update Status"
                        onPress={() => {
                           setModalVisible(true)
                        }}
                     />
                  )}
            </View>

            <Divider size="small" />
            <Text center type="defaultSemiBold">
               Order Items ({itemsCount})
            </Text>
            <CartItems showAddMoreItemsButton={false} items={order?.items} />
         </ScrollView>
         <TotalView
            cartTotal={order.total}
            showFees
            businessOrderType={order.orderType}
            cartQuantity={itemsCount!}
            tip={order.tip ? order.tip.amount : 0}
            onPress={() => {}}
         />

         <OrderStatusPicker
            currentStatus={order.status}
            visible={isModalVisible}
            orderType={order.orderType}
            onClose={() => setModalVisible(false)}
            onStatusChange={handleStatusChange}
         />
         <Sheet
            snapPoints={['100%']}
            ref={bottomSheetRef}
            enablePanDownToClose={false}
            handleComponent={() => null}>
            <OTP
               lenght={4}
               code={otp!}
               callBack={onCallBackSuccess}
               header="Ask the Customer for the PIN"
               title="Pick-Up PIN"
            />
         </Sheet>
      </Container>
   )
}

export default BussinessOrder
