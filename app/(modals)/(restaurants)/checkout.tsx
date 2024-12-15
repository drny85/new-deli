import { placePendingOrder } from '@/actions/orders'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import AnimatedRestaurantMap from '@/components/checkout/AnimatedRestaurantMap'
import CartItems from '@/components/checkout/CartItems'
import TipsCalculator from '@/components/checkout/TipCalculator'
import TotalView from '@/components/checkout/TotalView'
import Divider from '@/components/Divider'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import Row from '@/components/Row'
import { Sheet, useSheetRef } from '@/components/Sheet'
import StripeProviderComponent from '@/components/StripeProvider'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import ToggleDeliveryPickup from '@/components/ToggleDeliveryPickup'
import { SIZES } from '@/constants/Colors'
import {
   calculateDistanceBetweenDeliveryAddressResturant,
   preventDeliveryOrder
} from '@/helpers/checkout'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { Order, ORDER_STATUS, ORDER_TYPE } from '@/shared/types'
import { useCartsStore } from '@/stores/cartsStore'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { Feather } from '@expo/vector-icons'
import BottomSheet, { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { useNetInfo } from '@react-native-community/netinfo'
import { Image } from 'expo-image'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import { useEffect, useRef, useState } from 'react'
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'

type Params = {
   restaurantId: string
}
const Checkout = () => {
   const { user } = useAuth()
   const { isInternetReachable } = useNetInfo()
   const bottomSheetRef = useSheetRef()
   const bottomSheetRefTip = useRef<BottomSheet>(null)
   const ascent = useThemeColor('icon')
   const textColor = useThemeColor('text')
   const backgroundColor = useThemeColor('background')
   const { top } = useSafeAreaInsets()
   const { restaurantId } = useLocalSearchParams<Params>()
   const {
      deliveryAddress,
      orderType,
      setChangingAddressFromCheckoutScreen,
      tipAmount,
      setOrder,
      setDeliveryAddress,
      setOrderType,
      setInitiatePayment
   } = useOrderFlowStore()
   const { getCart, updateCart } = useCartsStore()

   const cart = getCart(restaurantId!)

   const [showItems, setShowItems] = useState(false)
   const [deliveryInstruction, setDeliveryInstruction] = useState('')
   const { loading, restaurant } = useRestaurant(restaurantId!)

   const handlePlaceOrder = async () => {
      const prevented = preventDeliveryOrder(restaurant!, orderType)
      if (prevented) return
      if (!isInternetReachable) {
         toast.warning('No Internet', {
            description: 'No internet connection',
            position: 'top-center'
         })
         return
      }
      if (!restaurant?.isOpen) {
         toast.warning('Restaurant is closed', {
            description: 'Restaurant is closed',
            position: 'top-center'
         })

         return
      }
      const isGood = cantContinueIfDeliveryWithoutAddress()
      if (!isGood) return
      if (!user?.id || !cart || !restaurantId) return
      const withinRange = calculateDistanceBetweenDeliveryAddressResturant(
         restaurant,
         orderType,
         deliveryAddress!
      )
      if (!withinRange) return
      if (restaurant && restaurant?.minimumDelivery && restaurant.minimumDelivery > cart?.total) {
         toast.warning('Minimum delivery not met', {
            description: `Minimum delivery is ${restaurant.minimumDelivery}`,

            position: 'top-center'
         })

         return
      }

      const order: Order = {
         address: deliveryAddress,
         contactPerson: {
            userId: user.id,
            name: user?.name!,
            lastName: user?.lastName!,
            phone: user?.phone!
         },
         tip: {
            amount: tipAmount,
            percentage: 0
         },
         businessId: restaurantId,
         deliveredBy: null,
         declined: [],
         deliveryPaid: false,
         deliveryInstructions: deliveryInstruction,
         mode: 'test',
         orderDate: new Date().toISOString(),
         items: cart.items,
         status: ORDER_STATUS.new,
         orderType: orderType === ORDER_TYPE.delivery ? ORDER_TYPE.delivery : ORDER_TYPE.pickup,
         userId: user?.id,
         total: cart.total,
         paymentIntent: '',
         transferId: '',
         sharedUserId: cart.isShared ? user.id : null
      }
      try {
         const { success, order: pendingOrder } = await placePendingOrder(order)
         console.log(success)
         if (success && pendingOrder) {
            await setOrder(pendingOrder)
            setInitiatePayment(true)
         } else {
            console.log('Error placing order', success, pendingOrder)
            toast.error('Error placing order', {
               description: 'Something went wrong',
               position: 'top-center'
            })
         }
      } catch (error) {
         console.log('Error placing order =>', error)
      }
   }

   const cantContinueIfDeliveryWithoutAddress = (): boolean => {
      if (!deliveryAddress && orderType === ORDER_TYPE.delivery) {
         setChangingAddressFromCheckoutScreen(true)
         router.push({ pathname: '/address', params: { restaurantId } })
         return false
      }
      return true
   }

   useEffect(() => {
      if (!user) return
      cantContinueIfDeliveryWithoutAddress()

      if (cart && cart.orderType && deliveryAddress) {
         setOrderType(cart.orderType)
         updateCart(restaurantId!, { ...cart, deliveryAddress: deliveryAddress })
         if (cart.deliveryAddress && cart.orderType === ORDER_TYPE.delivery) {
            setDeliveryAddress(cart.deliveryAddress)
         }
      }
   }, [])

   useEffect(() => {
      preventDeliveryOrder(restaurant!, orderType)
      if (orderType === 'delivery' && restaurant?.ordersMethod === 'pickup-only') {
         setOrderType(ORDER_TYPE.pickup)
      }
   }, [restaurant, orderType])

   if (!user)
      return (
         <Redirect
            href={{
               pathname: '/login',
               params: { returnUrl: `(modals)/(restaurants)/checkout?restaurantId=${restaurantId}` }
            }}
         />
      )

   if (loading || !cart || !restaurant || !restaurant.stripeAccount) return <Loading />
   return (
      <StripeProviderComponent
         cartTotal={cart.total}
         businessName={restaurant.name}
         connectedId={restaurant.stripeAccount}>
         <View style={{ flex: 1, paddingTop: top, backgroundColor }}>
            <BackButton />
            <View style={{ alignSelf: 'flex-end', marginRight: SIZES.md }}>
               <Row align="between" containerStyle={{ width: '66%' }}>
                  <Text style={{ marginTop: 4 }} type="header" center>
                     Checkout
                  </Text>
                  <NeoView
                     containerStyle={{ borderRadius: SIZES.lg * 1.5 }}
                     innerStyleContainer={{ borderRadius: SIZES.lg * 1.5 }}>
                     <ToggleDeliveryPickup
                        onOptionChange={(option) => {
                           setOrderType(option)
                           updateCart(restaurantId!, {
                              ...cart!,
                              orderType:
                                 option === 'delivery' ? ORDER_TYPE.delivery : ORDER_TYPE.pickup
                           })
                        }}
                     />
                  </NeoView>
               </Row>
            </View>

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
               <ScrollView
                  style={{ flex: 0.7 }}
                  contentContainerStyle={{
                     padding: SIZES.md,
                     marginVertical: SIZES.md,
                     justifyContent: 'space-between'
                  }}>
                  {orderType === 'delivery' ? (
                     <TouchableOpacity
                        onPress={() => {
                           setChangingAddressFromCheckoutScreen(true)
                           router.push({ pathname: '/address', params: { restaurantId } })
                        }}>
                        <Text type="defaultSemiBold">Delivery Address</Text>
                        <Row align="between" containerStyle={{ marginVertical: SIZES.sm }}>
                           <View style={{ gap: 3 }}>
                              {cart.deliveryAddress?.label && (
                                 <Text type="muted">{cart.deliveryAddress.label}</Text>
                              )}
                              <Text type="italic">
                                 {cart.deliveryAddress
                                    ? cart.deliveryAddress?.street.slice(0, -5)
                                    : 'You must select a delivery address'}
                              </Text>
                              {cart.deliveryAddress?.apt && (
                                 <Text type="italic">Apt / FLR : {cart.deliveryAddress.apt}</Text>
                              )}
                           </View>
                           <Feather name="chevron-right" size={26} color={ascent} />
                        </Row>
                     </TouchableOpacity>
                  ) : (
                     <View>
                        {restaurant && restaurant.coords && (
                           <AnimatedRestaurantMap
                              restaurant={{
                                 latitude: restaurant.coords?.latitude,
                                 longitude: restaurant.coords?.longitude,
                                 name: restaurant.name,
                                 description: restaurant.address!
                              }}
                           />
                        )}
                        <TouchableOpacity disabled onPress={() => {}}>
                           <Text style={{ fontSize: 16, fontWeight: '700' }} type="muted">
                              Pick Up At
                           </Text>
                           <Row align="between" containerStyle={{ marginVertical: SIZES.sm }}>
                              <View style={{ gap: 3 }}>
                                 <Text type="defaultSemiBold">{restaurant?.name}</Text>
                                 <Text type="subtitle">{restaurant?.address?.slice(0, -5)}</Text>
                              </View>
                              {/* <Feather name="chevron-right" size={26} color={ascent} /> */}
                           </Row>
                        </TouchableOpacity>
                     </View>
                  )}

                  {orderType === 'delivery' && (
                     <>
                        <Divider size="small" />
                        <TouchableOpacity
                           onPress={() => {
                              bottomSheetRef.current?.present()
                           }}>
                           <Text type="defaultSemiBold">Delivery Instructions</Text>
                           <Row align="between">
                              <View>
                                 {deliveryInstruction ? (
                                    <Text type="italic">{deliveryInstruction}</Text>
                                 ) : (
                                    <Text style={{ opacity: 0.6 }} type="italic">
                                       Leave it at the door, etc.
                                    </Text>
                                 )}
                              </View>
                              <Feather name="chevron-right" size={26} color={ascent} />
                           </Row>
                        </TouchableOpacity>
                     </>
                  )}
                  <Divider size="small" />
                  <Text type="defaultSemiBold">Order Summary </Text>
                  <TouchableOpacity
                     activeOpacity={0.9}
                     onPress={() => setShowItems((prev) => !prev)}>
                     <Row align="between" containerStyle={{ marginTop: SIZES.sm }}>
                        <View>
                           <Row containerStyle={{ gap: SIZES.md }}>
                              <Image
                                 source={restaurant?.image}
                                 style={{
                                    height: 60,
                                    width: 60,
                                    borderRadius: 30,
                                    objectFit: 'cover'
                                 }}
                              />
                              <View>
                                 <Text style={{ fontWeight: '600', fontSize: 16 }} type="muted">
                                    {restaurant?.name}
                                 </Text>
                                 <Text type="italic"> {cart?.quantity} items</Text>
                              </View>
                           </Row>
                        </View>
                        <Feather
                           name={!showItems ? 'chevron-right' : 'chevron-down'}
                           size={26}
                           color={ascent}
                        />
                     </Row>
                  </TouchableOpacity>
                  <AnimatePresence>
                     {showItems && (
                        <MotiView
                           from={{ opacity: 0, translateY: -20 }}
                           animate={{ opacity: 1, translateY: 0 }}>
                           <CartItems items={cart.items} showAddMoreItemsButton={false} />
                        </MotiView>
                     )}
                  </AnimatePresence>
               </ScrollView>
               <View>
                  <TotalView
                     businessOrderType={orderType}
                     title="Place Order"
                     cartQuantity={cart.quantity}
                     cartTotal={cart.total}
                     onPress={handlePlaceOrder}
                     showFees={true}
                     onUpdateTip={() => bottomSheetRefTip.current?.snapToIndex(1)}
                  />
               </View>
            </View>
            <Sheet snapPoints={['50%']} ref={bottomSheetRef} topInset={SIZES.statusBarHeight}>
               <View
                  style={{
                     padding: SIZES.md,
                     marginTop: 20
                  }}>
                  <Text type="defaultSemiBold">Special Instructions</Text>
                  <BottomSheetTextInput
                     style={[styles.container, { color: textColor }]}
                     placeholder="Any note for the delivery person"
                     value={deliveryInstruction}
                     multiline
                     maxLength={160}
                     onChangeText={setDeliveryInstruction}
                     //placeholderTextColor={theme.TEXT_COLOR + 90}
                  />
                  <View style={{ width: '60%', alignSelf: 'center', marginVertical: SIZES.lg }}>
                     <Button
                        type="soft"
                        title={'Done'}
                        onPress={() => {
                           Keyboard.dismiss()
                           bottomSheetRef.current?.close()
                        }}
                        containerStyle={{ borderRadius: SIZES.lg * 1.5 }}
                     />
                  </View>
               </View>
            </Sheet>

            <TipsCalculator bottomSheetRef={bottomSheetRefTip} orderTotal={cart.total} />
         </View>
      </StripeProviderComponent>
   )
}

export default Checkout

const styles = StyleSheet.create({
   container: {
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
      minHeight: 70,
      fontSize: 16,
      lineHeight: 20,
      padding: SIZES.md,
      backgroundColor: 'rgba(151, 151, 151, 0.25)'
   }
})
