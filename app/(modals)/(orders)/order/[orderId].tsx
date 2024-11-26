import BackButton from '@/components/BackButton'
import CartItems from '@/components/checkout/CartItems'
import TotalView from '@/components/checkout/TotalView'
import ConfettiComponent, { ConfettiComponentRef } from '@/components/ConfettiComponent'
import Loading from '@/components/Loading'
import OrderProgress from '@/components/OrderProgress'
import PhoneCall from '@/components/PhoneCall'
import Row from '@/components/Row'
import ShareButton from '@/components/ShareLink'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { getDurationFromGoogleMaps } from '@/helpers/getEtaInMinutes'
import { useOrder } from '@/hooks/orders/useOrder'
import { useDriverLocation } from '@/hooks/useDriverLocation'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useCartsStore } from '@/stores/cartsStore'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { ORDER_STATUS, ORDER_TYPE } from '@/typing'
import { calculateETA } from '@/utils/calculateETA'
import { dayjsFormat } from '@/utils/dayjs'
import { STATUS_NAME } from '@/utils/orderStatus'
import { useNavigationState } from '@react-navigation/native'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const OrderDetails = () => {
   const [eta, setEta] = useState<number | null>(null)
   const routes = useNavigationState((s) => s.routes)
   const shouldReplace = useMemo(
      () => routes.findIndex((r) => r.name === 'order-success') !== -1,
      [routes]
   )

   const { orderId, showDetails } = useLocalSearchParams<{
      orderId: string
      showDetails?: string
   }>()
   const confettiRef = useRef<ConfettiComponentRef>(null)
   const restaurants = useRestaurantsStore((s) => s.restaurants)
   const { top } = useSafeAreaInsets()
   const backgroundColor = useThemeColor('background')

   const removeCart = useCartsStore((s) => s.removeCart)
   const { setOrderType, reOrder } = useOrderFlowStore()
   const { order, loading } = useOrder(orderId!)
   const restaurant = restaurants.find((r) => r.id === order?.businessId)
   const location = useDriverLocation(order?.courier?.id!)

   useEffect(() => {
      if (!order || reOrder) return
      removeCart(order?.businessId)
      setOrderType('delivery')
   }, [order])

   useEffect(() => {
      let timeOut: NodeJS.Timeout | null = null
      if (order?.status === ORDER_STATUS.picked_up_by_client && confettiRef) {
         timeOut = setTimeout(() => {
            confettiRef.current?.triggerConfetti()
         }, 300)
      }

      return () => {
         if (timeOut) clearTimeout(timeOut)
      }
   }, [order?.status, confettiRef])

   const fetchEAT = useCallback(async () => {
      if (!location?.location || !order?.address?.coords) return
      try {
         console.log('Fetching ETA')
         const duration = await getDurationFromGoogleMaps(
            location?.location!,
            order?.address?.coords!,
            process.env.EXPO_PUBLIC_GOOGLE_API!
         )
         if (duration !== null) {
            console.log(`ETA: ${duration} minutes`)
            setEta(duration)
         } else {
            console.log('Failed to fetch ETA')
         }
      } catch (error) {
         console.log(error)
      }
   }, [])

   useEffect(() => {
      fetchEAT()
   }, [])

   if (loading || !order) return <Loading />

   return (
      <View style={{ flex: 1, paddingTop: top, backgroundColor }}>
         <BackButton
            onPress={() => {
               if (shouldReplace) {
                  router.replace('/orders')
                  return
               }
               router.back()
            }}
         />
         <Row align="between" containerStyle={{ paddingHorizontal: SIZES.md }}>
            <Text />
            <Text type="header" center>
               {showDetails ? 'Order Details' : 'Order Status'}
            </Text>
            <ShareButton id={orderId} type="order" />
         </Row>
         {showDetails === undefined && (
            <ScrollView
               showsVerticalScrollIndicator={false}
               style={{ flex: 1 }}
               contentContainerStyle={{ padding: SIZES.sm, marginTop: SIZES.sm }}>
               <Row align="evenly" containerStyle={{ gap: SIZES.sm, padding: SIZES.sm }}>
                  <Image
                     source={restaurant?.image}
                     style={{ height: 80, width: 100, borderRadius: SIZES.sm }}
                  />
                  <View>
                     <Text fontSize="medium" type="subtitle">
                        {restaurant?.name}
                     </Text>
                     <Text type="muted" fontSize="small">
                        {restaurant?.address?.split(',')[0]}
                     </Text>
                     <Text type="muted">{restaurant?.phone}</Text>
                  </View>
                  <PhoneCall phone={restaurant?.phone!} size={50} />
               </Row>
               <View style={{ flex: 1, marginTop: SIZES.sm, marginBottom: 60 }}>
                  {order?.otpPickup && (
                     <Text center type="defaultSemiBold">
                        {order.orderType === ORDER_TYPE.delivery ? 'Delivery' : 'Pick Up'} PIN{' '}
                        {order?.otpPickup}
                     </Text>
                  )}

                  <OrderProgress
                     eta={eta || 10}
                     onRefresh={fetchEAT}
                     status={order?.status!}
                     orderType={order?.orderType!}
                     orderDate={order?.orderDate!}
                  />
               </View>
            </ScrollView>
         )}
         {showDetails === 'yes' && (
            <View style={{ flex: 1, justifyContent: 'space-between', marginTop: SIZES.lg }}>
               <View style={{ padding: SIZES.md, gap: 3 }}>
                  <Text type="defaultSemiBold">From {restaurant?.name}</Text>
                  {order.orderType === ORDER_TYPE.delivery ? (
                     <>
                        <Text type="muted">To: {order.address?.street.slice(0, -5)}</Text>
                        <Text type="muted">Apt / Fl /Suite: {order.address?.apt}</Text>
                     </>
                  ) : (
                     <Text capitalize type="muted">
                        Ordered for pick up
                     </Text>
                  )}
                  <Text type="muted">Status: {STATUS_NAME(order.status)}</Text>
                  <Text type="muted">Order Date: {dayjsFormat(order.orderDate).format('lll')}</Text>
                  {order.status === ORDER_STATUS.delivered && (
                     <Text type="muted">
                        Delivered On: {dayjsFormat(order.deliveredOn).format('lll')}
                     </Text>
                  )}
                  {order.status === ORDER_STATUS.picked_up_by_client && (
                     <Text type="muted">
                        Picked Up On: {dayjsFormat(order.pickedUpOn).format('lll')}
                     </Text>
                  )}
               </View>
               {order?.otpPickup && (
                  <Text center type="defaultSemiBold">
                     {order.orderType === ORDER_TYPE.delivery ? 'Delivery' : 'Pick Up'} PIN{' '}
                     {order?.otpPickup}
                  </Text>
               )}
               <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: SIZES.md }}>
                  <Row align="evenly">
                     <Text type="defaultSemiBold">Order # {order.orderNumber}</Text>
                     <Text center type="defaultSemiBold">
                        Items Summary
                     </Text>
                  </Row>
                  {order && <CartItems items={order?.items} showAddMoreItemsButton={false} />}
               </ScrollView>
               <TotalView
                  businessOrderType={order.orderType}
                  cartQuantity={order?.items.reduce((acc, curr) => curr.quantity + acc, 0)!}
                  showFees={true}
                  cartTotal={order?.total!}
                  onPress={() => {}}
               />
            </View>
         )}
         <ConfettiComponent ref={confettiRef} />
      </View>
   )
}

export default OrderDetails
