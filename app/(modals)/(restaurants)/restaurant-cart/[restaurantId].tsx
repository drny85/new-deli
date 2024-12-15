import { getCartFromDatabase } from '@/actions/cart'
import BackButton from '@/components/BackButton'
import CartItems from '@/components/checkout/CartItems'
import TotalView from '@/components/checkout/TotalView'
import Loading from '@/components/Loading'
import Row from '@/components/Row'
import ShareButton from '@/components/ShareLink'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { Cart, ORDER_TYPE } from '@/shared/types'
import { useCartsStore } from '@/stores/cartsStore'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { generateUniqueId } from '@/utils/generateUniqueId'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'

type Params = {
   restaurantId: string
}

const RestaurantCart = () => {
   const user = useAuth().user
   const { restaurantId } = useLocalSearchParams<Params>()
   const [sharedCart, setSharedCart] = useState<Cart | null>(null)
   const { getCart, removeCart, updateCart } = useCartsStore()
   const setOrderType = useOrderFlowStore((s) => s.setOrderType)
   const cartT = getCart(restaurantId!)
   const cart = sharedCart || cartT
   const { restaurant, loading } = useRestaurant(cart?.restaurantId!)

   const backgroundColor = useThemeColor('background')
   const { top } = useSafeAreaInsets()

   const onCheckoutPress = () => {
      if (!user)
         return router.push({
            pathname: '/login',
            params: { returnUrl: `(modals)/(restaurants)/checkout?restaurantId=${restaurantId}` }
         })
      if (restaurant && restaurant.minimumDelivery && cart) {
         if (restaurant.minimumDelivery > cart?.total) {
            toast.warning('Minimum delivery not met', {
               description: `Minimum delivery is ${restaurant.minimumDelivery}\nSpend at least $${Math.round(restaurant.minimumDelivery - cart.total).toFixed(1)} more`,

               position: 'top-center'
            })

            return
         }
      }
      if (restaurant?.ordersMethod === 'pickup-only') {
         if (!cart) return
         setOrderType(ORDER_TYPE.pickup)
         updateCart(restaurantId!, { ...cart!, orderType: ORDER_TYPE.pickup })
      }
      router.push({
         pathname: '/checkout',
         params: { restaurantId }
      })
   }

   useEffect(() => {
      if (cart?.items.length === 0) {
         removeCart(restaurantId!)
         router.canGoBack() && router.back()
      }
   }, [cart?.items.length])

   useEffect(() => {
      if (cart?.isShared && cart.id) {
         getCartFromDatabase(cart.id!).then((cart) => {
            if (cart) {
               setSharedCart(cart)
            }
         })
      }
   }, [cart?.isShared])

   if (loading || !restaurant || !cart) return <Loading />
   return (
      <View style={{ flex: 1, backgroundColor, paddingTop: top }}>
         <Row align="between" containerStyle={{ paddingHorizontal: SIZES.md }}>
            <BackButton
               containerStyle={{ position: 'relative', marginTop: 0, top: 0, left: 0 }}
               onPress={() => {
                  if (router.canGoBack()) {
                     router.back()
                  } else {
                     router.replace('/cart')
                  }
               }}
            />

            <Text
               style={{ marginTop: 4, fontFamily: 'Lobster', fontSize: 22 }}
               adjustsFontSizeToFit
               numberOfLines={1}
               ellipsizeMode="tail">
               {restaurant?.name}
            </Text>

            <ShareButton id={restaurantId} cartId={generateUniqueId()} type="cart" ascentColor />
         </Row>
         <View style={{ flex: 1, justifyContent: 'space-between' }}>
            {cart && cart?.items.length > 0 && (
               <>
                  <CartItems items={cart.items} />
                  <TotalView
                     businessOrderType={cart.orderType}
                     title="Checkout"
                     cartQuantity={cart.quantity}
                     cartTotal={cart.total}
                     onPress={onCheckoutPress}
                  />
               </>
            )}
         </View>
      </View>
   )
}

export default RestaurantCart
