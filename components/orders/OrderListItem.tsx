import { SIZES } from '@/constants/Colors'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Order, ORDER_STATUS, ORDER_TYPE } from '@/shared/types'
import React, { useCallback, useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import NeoView from '../NeoView'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'

import { dayjsFormat } from '@/utils/dayjs'
import { router } from 'expo-router'
import { Image } from 'expo-image'
import Divider from '../Divider'
import { STATUS_NAME } from '@/utils/orderStatus'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { useCartsStore } from '@/stores/cartsStore'

type Props = {
   order: Order
   onPress: () => void
}

const OrderListItem = ({ order, onPress }: Props) => {
   const restaurant = useRestaurantsStore((s) =>
      s.restaurants.find((r) => r.id === order.businessId)
   )
   const { setDeliveryAddress, setOrderType, setOrder, setTipAmount, setReOrder } =
      useOrderFlowStore()
   const { addToCart, createNewCart, getCart, removeCart } = useCartsStore()

   const reOrder = useMemo(() => {
      return (
         order.status === ORDER_STATUS.delivered ||
         order.status === ORDER_STATUS.picked_up_by_client
      )
   }, [order.status])
   const handleOnPress = useCallback(async () => {
      if (reOrder) {
         setReOrder(true)
         const existingCart = getCart(order.businessId)
         if (existingCart) {
            removeCart(order.businessId)
         }
         const cart = await createNewCart(order.businessId)
         if (!cart) return

         order.items.forEach((i) => addToCart(i))
         setOrderType(order.orderType)
         setOrder(order)
         setDeliveryAddress(order.address)
         if (order.tip) {
            setTipAmount(order.tip?.amount)
         }

         router.push(`/restaurant-cart/${order.businessId}`)
      } else {
         router.push({ pathname: '/order/[orderId]', params: { orderId: order.id! } })
      }
   }, [reOrder, order])
   return (
      <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: SIZES.md }}>
         <Row align="between">
            <Text type="defaultSemiBold">Order # {order.orderNumber}</Text>

            <TouchableOpacity onPress={handleOnPress}>
               <NeoView
                  containerStyle={{ borderRadius: SIZES.lg * 2 }}
                  innerStyleContainer={{
                     borderRadius: SIZES.lg * 2,
                     paddingHorizontal: SIZES.sm,
                     paddingVertical: SIZES.sm / 2
                  }}>
                  <Text type="defaultSemiBold">
                     {reOrder
                        ? 'Re-order'
                        : order.orderType === ORDER_TYPE.pickup
                          ? 'Check Status'
                          : 'Track Order'}
                  </Text>
               </NeoView>
            </TouchableOpacity>
         </Row>
         <Row containerStyle={{ padding: SIZES.md, gap: SIZES.sm }}>
            <Image
               source={restaurant?.image}
               style={{ width: 80, height: 80, borderRadius: SIZES.md }}
            />

            <View>
               <Text type="defaultSemiBold">{restaurant?.name}</Text>
               <Text type="muted">{order.address?.street.slice(0, -15)}</Text>
               <Text fontSize="small">
                  Type: {order.orderType === ORDER_TYPE.delivery ? 'Delivery' : 'Pick Up'}
               </Text>
               <Text fontSize="small">Status: {STATUS_NAME(order.status)}</Text>
               <Text fontSize="small">
                  Order Date: {dayjsFormat(order.orderDate).format('lll')}
               </Text>
            </View>
         </Row>
         <Divider size="small" />
      </TouchableOpacity>
   )
}

export default OrderListItem
