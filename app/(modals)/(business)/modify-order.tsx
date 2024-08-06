import { updateOrder } from '@/actions/business'
import OrderStatusPicker from '@/components/business/StatusPicker'
import Button from '@/components/Button'
import CartItems from '@/components/checkout/CartItems'
import TotalView from '@/components/checkout/TotalView'
import { Container } from '@/components/Container'
import CourierCard from '@/components/CourierCard'
import Divider from '@/components/Divider'
import Input from '@/components/Input'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'

import PhoneCall from '@/components/PhoneCall'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useOrder } from '@/hooks/orders/useOrder'
import { CartItem } from '@/stores/cartsStore'
import { Order, ORDER_STATUS, ORDER_TYPE } from '@/typing'
import { dayjsFormat } from '@/utils/dayjs'
import { STATUS_NAME } from '@/utils/orderStatus'
import { toastMessage } from '@/utils/toast'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, TouchableOpacity } from 'react-native'

const ModifyOrder = () => {
   const { orderId } = useLocalSearchParams<{
      orderId: string
   }>()

   const { order, loading } = useOrder(orderId!)
   const itemsCount = order?.items.reduce((acc, curr) => acc + curr.quantity, 0)
   const [newApt, setNewApt] = useState(order?.address?.apt)
   const [editAtpt, setEditApt] = useState(false)
   const [editItems, setEditItems] = useState(false)

   const onAptChange = async () => {
      try {
         if (!newApt || !order) return
         if (order.orderType === ORDER_TYPE.pickup) return
         if (order.address?.apt) {
            if (newApt === order.address?.apt) {
               setEditApt(false)
               return
            }
         }
         const updatedOrder: Order = {
            ...order,
            address: {
               ...order.address!,
               apt: newApt
            }
         }
         const updated = await updateOrder({ ...updatedOrder })
         if (updated) {
            setEditApt(false)
            toastMessage({
               title: 'Success',
               preset: 'done',

               message: 'Apt / Flr /Suite updated'
            })
         }
      } catch (error) {
         console.log('Error changing apt', error)
      }
   }

   const onRemovePress = async (item: CartItem) => {
      try {
         if (!order) return
         if (order.items.length === 1) {
            Alert.alert(
               'Last Item',
               'This action cannot be undone and you just cancel this order',
               [
                  {
                     text: 'Cancel',
                     onPress: () => console.log('Cancel Pressed'),
                     style: 'cancel'
                  },
                  {
                     text: 'Refund',
                     onPress: () => {
                        setEditItems(false)
                        router.back()
                     },
                     style: 'destructive'
                  }
               ]
            )
            return
         }

         const removeAmount = +item.price * item.quantity
         const updatedOrder: Order = {
            ...order,
            items: order?.items.filter((i) => i.id !== item.id),
            total: order.total - removeAmount
         }
         const success = await updateOrder(updatedOrder)
         if (success) {
            toastMessage({
               title: 'Removed',
               preset: 'done',
               message: `${item.quantity}x ${item.name} removed`
            })
            handlePartialRefund(order, removeAmount)
         }
      } catch (error) {
         console.log(error)
      }
   }

   const handlePartialRefund = (order: Order, refundAmount: number) => {
      console.log('Refunding', refundAmount)
   }
   if (loading || !order) return <Loading />

   return (
      <Container contentContainerStyle={{ borderWidth: 4, borderColor: 'red' }}>
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
                     <Row align="between">
                        <Text fontSize="large" type="defaultSemiBold">
                           Customer Info
                        </Text>
                        {order.orderType === ORDER_TYPE.delivery && (
                           <TouchableOpacity
                              onPress={() => {
                                 setEditApt((p) => {
                                    if (!p) {
                                       if (order.address?.apt) {
                                          setNewApt(order.address?.apt)
                                       }
                                    }
                                    return !p
                                 })
                              }}>
                              <FontAwesome name="edit" size={28} color={'orange'} />
                           </TouchableOpacity>
                        )}
                     </Row>
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
                        {editAtpt && (
                           <View style={{ marginVertical: SIZES.sm }}>
                              <Row containerStyle={{ gap: SIZES.md }}>
                                 <Input
                                    placeholder="Apt / Fl /Suite"
                                    value={newApt}
                                    containerStyle={{ width: 100, alignSelf: 'center' }}
                                    textAlign="center"
                                    onChangeText={(text) => setNewApt(text.toUpperCase())}
                                 />
                                 <TouchableOpacity onPress={onAptChange}>
                                    <Text style={{ fontWeight: '700', fontSize: 16 }} type="muted">
                                       Save
                                    </Text>
                                 </TouchableOpacity>
                              </Row>
                           </View>
                        )}
                        <Row containerStyle={{ gap: SIZES.lg }}>
                           <Text>Phone: {order.contactPerson.phone}</Text>
                           <PhoneCall phone={order.contactPerson.phone} />
                        </Row>
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
                        Order Info
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
                  width: '50%',
                  marginVertical: SIZES.sm,
                  gap: SIZES.sm
               }}>
               <Text fontSize="large" type="muted" center>
                  Current Status:{' '}
                  <Text type="defaultSemiBold" style={{ fontSize: 20 }}>
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
                  <View style={{ marginVertical: SIZES.sm, gap: SIZES.sm }}>
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
                     <Button type="soft" title="Update Status" onPress={() => {}} />
                  )}
            </View>

            <Divider size="small" />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
               <Row containerStyle={{ gap: SIZES.lg }}>
                  <Text center type="defaultSemiBold">
                     Order Items ({itemsCount})
                  </Text>
                  <TouchableOpacity
                     onPress={() => {
                        setEditItems((p) => !p)
                     }}>
                     <FontAwesome name="edit" size={28} color={'orange'} />
                  </TouchableOpacity>
               </Row>
            </View>
            <CartItems
               showAddMoreItemsButton={false}
               items={order?.items}
               removable={editItems}
               onRemove={(item) => {
                  Alert.alert(
                     'Remove Item',
                     `Are you sure you want to remove ${item.name} from the order?`,
                     [
                        {
                           text: 'Cancel',
                           style: 'cancel'
                        },
                        {
                           text: 'Remove',
                           onPress: () => onRemovePress(item),
                           style: 'destructive'
                        }
                     ]
                  )
               }}
            />
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
            visible={false}
            orderType={order.orderType}
            onClose={() => {}}
            onStatusChange={() => {}}
         />
      </Container>
   )
}

export default ModifyOrder
