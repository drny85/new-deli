import { SIZES } from '@/constants/Colors'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Cart, ORDER_TYPE } from '@/shared/types'
import { useCartsStore } from '@/stores/cartsStore'
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import React from 'react'
import { Image, Platform, Pressable, TouchableOpacity, useColorScheme } from 'react-native'
import { toast } from 'sonner-native'
import Button from '../Button'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import NeumorphismView from '../NeumorphismView'

const IMAGE_HEIGHT = 80

type Props = {
   cart: Cart
}

const CartListItemView = ({ cart }: Props) => {
   const { loading, restaurant } = useRestaurant(cart.restaurantId)
   const removeCart = useCartsStore((s) => s.removeCart)
   const ascent = useThemeColor('ascent')
   const isDark = useColorScheme() === 'dark'

   const goToStore = () => {
      router.push({
         pathname: '/restaurant',
         params: { restaurantId: restaurant?.id }
      })
   }

   const confirmDeletion = () => {
      toast('Are you sure?', {
         description: 'This action cannot be undone',
         cancel: {
            label: 'Cancel',
            onClick: () => {}
         },
         action: {
            label: 'Delete',

            onClick: deleteStoreCart
         },
         actionButtonStyle: {
            backgroundColor: ascent
         },
         actionButtonTextStyle: {
            color: '#ffffff'
         },
         duration: Infinity,
         icon: <Ionicons name="trash-outline" size={28} color={ascent} />
      })
   }

   const deleteStoreCart = () => {
      if (!restaurant?.id) return
      removeCart(restaurant.id)
      toast.dismiss()
      toast.success('Cart Deleted', {
         description: 'Your cart has been deleted'
      })
   }
   if (loading) return null
   return (
      <NeumorphismView key={cart.restaurantId} padding={SIZES.md}>
         <Row align="between">
            <Row containerStyle={{ gap: SIZES.sm }}>
               <Pressable onPress={goToStore}>
                  <Image
                     source={{
                        uri: restaurant?.image || 'https://picsum.photos/seed/picsum/200/300'
                     }}
                     //transition={300}
                     style={{
                        width: IMAGE_HEIGHT,
                        height: IMAGE_HEIGHT,
                        borderRadius: IMAGE_HEIGHT / 2
                     }}
                  />
               </Pressable>
               <View>
                  <Text type="header">{restaurant?.name}</Text>
                  <Row>
                     <Text type="muted">
                        {cart.quantity} item{cart.quantity > 1 ? 's' : ''}{' '}
                     </Text>
                     <Text type="muted"> - </Text>
                     <Text type="muted">${cart.total.toFixed(2)}</Text>
                  </Row>
                  <Text type="muted">
                     {cart.orderType === ORDER_TYPE.delivery ? `Delivery` : 'Pick Up'}
                  </Text>
                  {!restaurant?.isOpen && (
                     <Text center type="defaultSemiBold" style={{ color: 'red', marginTop: 4 }}>
                        Closed
                     </Text>
                  )}
               </View>
            </Row>

            <TouchableOpacity onPress={confirmDeletion}>
               {Platform.OS === 'ios' ? (
                  <SymbolView name="trash.circle" tintColor={ascent} size={28} />
               ) : (
                  <FontAwesome name="trash-o" size={28} color={ascent} />
               )}
            </TouchableOpacity>
         </Row>

         <View style={{ gap: SIZES.md, marginTop: SIZES.md }}>
            {cart.isShared && (
               <Row containerStyle={{ alignSelf: 'center', gap: SIZES.sm }}>
                  <Text type="muted" center>
                     Shared
                  </Text>
                  <Feather name="share-2" size={24} color="grey" />
               </Row>
            )}
            <Button
               containerStyle={{ borderRadius: SIZES.lg * 2 }}
               contentTextStyle={{ fontSize: 16, color: '#ffffff' }}
               type="primary"
               title="View Cart"
               onPress={() => {
                  router.push(`/restaurant-cart/${restaurant?.id}`)
               }}
            />
            <Button
               containerStyle={{ borderRadius: SIZES.lg * 2 }}
               contentTextStyle={{ fontSize: 16, color: isDark ? '#ffffff' : '#212121' }}
               type="soft"
               title="View Store"
               onPress={goToStore}
            />
         </View>
      </NeumorphismView>
   )
}

export default CartListItemView
