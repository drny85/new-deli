import { SIZES } from '@/constants/Colors'
import { CartItem, useCartsStore } from '@/stores/cartsStore'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Alert, StyleSheet, TextStyle, TouchableOpacity } from 'react-native'
import ItemQuantitySetter from '../ItemQuantitySetter'
import NeoView from '../NeoView'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import Divider from '../Divider'
import { FontAwesome } from '@expo/vector-icons'
import { letterSizes } from '@/helpers/lettersSizes'
import { useAuth } from '@/providers/authProvider'
import { toastAlert } from '@/utils/toast'

type Props = {
   item: CartItem
   showSetter?: boolean
   removable?: boolean
   onRemove?: (item: CartItem) => void
   contentTitleStyle?: TextStyle
   contentSubTitleStyle?: TextStyle
}

const CartListItem = ({ item, showSetter = true, removable = false, onRemove }: Props) => {
   const addToCart = useCartsStore((state) => state.addToCart)
   const getCart = useCartsStore((state) => state.getCart)
   const removeFromCart = useCartsStore((state) => state.removeItemFromCart)
   const updateCart = useCartsStore((state) => state.updateCart)
   const cart = getCart(item.businessId)
   const { user } = useAuth()
   const isBusiness = user?.type === 'business'

   const handleInAdd = (item: CartItem) => {
      if (item.addons && item.addons.length > 0) {
         if (cart) {
            updateCart(item.businessId, {
               ...cart,
               items: [
                  ...cart.items.map((i) =>
                     item.id === i.id ? { ...i, quantity: i.quantity + 1 } : i
                  )
               ],
               quantity: cart?.quantity + 1,
               total: cart.total + +item.price
            })
            return
         }

         return
      } else {
         addToCart({ ...item, quantity: 1 })
      }
   }

   const handleRemove = (item: CartItem) => {
      if (item.addons && item.addons.length > 0) {
         if (cart) {
            if (item.quantity > 1) {
               updateCart(item.businessId, {
                  ...cart,
                  items: cart.items.map((i) =>
                     i.id === item.id ? { ...i, quantity: item.quantity - 1 } : i
                  ),
                  quantity: cart?.quantity - 1,
                  total: cart.total - +item.price
               })
            } else {
               removeFromCart(item)
            }
         }
      } else {
         removeFromCart(item)
      }
   }

   if (!showSetter) {
      return (
         <View style={{ paddingLeft: removable ? 26 : 0 }}>
            {removable && onRemove !== undefined && (
               <TouchableOpacity
                  style={{ position: 'absolute', left: -10, top: 0 }}
                  activeOpacity={0.8}
                  onPress={() => {
                     onRemove(item)
                  }}>
                  <FontAwesome name="trash-o" size={24} color="red" />
               </TouchableOpacity>
            )}
            <Row align="between">
               <Text type="muted" style={[{ fontWeight: '600' }, isBusiness && styles.title]}>
                  {item.quantity} - {item.name}
               </Text>
               <Text type="muted">
                  $
                  {(item.size !== null
                     ? +item.size.price * item.quantity
                     : +item.price * item.quantity
                  ).toFixed(2)}
               </Text>
            </Row>
            {item.size && (
               <Text
                  style={{ marginTop: 5, marginLeft: SIZES.lg, fontStyle: 'italic' }}
                  type="muted">
                  <Text type="muted" style={{ fontWeight: '500' }}>
                     {letterSizes(item.sizes) ? 'size' : 'add-on'}:
                  </Text>{' '}
                  {item.size.size}
               </Text>
            )}
            {item.multipleAddons &&
               item.multipleAddons > 0 &&
               item.addons &&
               item.addons.length > 0 && (
                  <Row containerStyle={{ padding: 6, flexWrap: 'wrap', marginLeft: SIZES.md }}>
                     {item.addons.map((addon, index) => (
                        <Text
                           type="muted"
                           capitalize
                           key={addon}
                           style={isBusiness && styles.subtitle}>
                           {addon}
                           {index < item.addons.length - 1 ? ', ' : ''}{' '}
                        </Text>
                     ))}
                  </Row>
               )}

            {item.instructions && (
               <Text style={{ marginTop: 6, marginLeft: SIZES.lg }} type="muted">
                  <Text type="muted">special intructions:</Text> {item.instructions}
               </Text>
            )}

            <Divider size="small" />
         </View>
      )
   }

   return (
      <NeoView
         containerStyle={{ borderRadius: SIZES.sm, ...styles.neo }}
         innerStyleContainer={{ borderRadius: SIZES.lg, ...styles.neo }}>
         <Row containerStyle={{ paddingVertical: 6 }}>
            <TouchableOpacity
               activeOpacity={0.8}
               onPress={() =>
                  router.push({
                     pathname: '/product-details',
                     params: {
                        productId: item.id,
                        businessId: item.businessId,
                        itemId: item.itemId
                     }
                  })
               }>
               <NeoView rounded size={SIZES.height * 0.12 < 100 ? 100 : SIZES.height * 0.12}>
                  <Image role="img" source={{ uri: item.image! }} style={styles.image} />
               </NeoView>
            </TouchableOpacity>
            <View style={{ paddingHorizontal: SIZES.md, flex: 1, gap: SIZES.sm * 0.5 }}>
               <Text type="defaultSemiBold">{item.name}</Text>
               <Row align="between">
                  <Text type="muted">{item.size ? item.size.size : ''}</Text>
                  <Text type="defaultSemiBold">
                     ${' '}
                     {(item.size !== null
                        ? +item.size.price * item.quantity
                        : +item.price * item.quantity
                     ).toFixed(2)}
                  </Text>
               </Row>
               {item.multipleAddons &&
                  item.multipleAddons > 0 &&
                  item.addons &&
                  item.addons.length > 0 && (
                     <Row containerStyle={{ padding: 6, flexWrap: 'wrap' }}>
                        {item.addons.map((addon, index) => (
                           <Text type="muted" capitalize key={addon}>
                              {addon}
                              {index < item.addons.length - 1 ? ', ' : ''}{' '}
                           </Text>
                        ))}
                     </Row>
                  )}
               <View style={{ width: '50%', alignSelf: 'center' }}>
                  <ItemQuantitySetter
                     quantity={item.quantity}
                     onPressAdd={() => {
                        if (cart?.isShared) {
                           return toastAlert({
                              title: 'Cart is shared',
                              message: 'You cannot add items to a shared cart',
                              preset: 'error',
                              duration: 4
                           })
                        }
                        handleInAdd(item)
                     }}
                     onPressSub={() => {
                        if (cart?.isShared) {
                           return toastAlert({
                              title: 'Cart is shared',
                              message: 'You cannot modify a shared cart',
                              preset: 'error',
                              duration: 4
                           })
                        }
                        handleRemove(item)
                     }}
                  />
               </View>
            </View>
         </Row>
      </NeoView>
   )
}

export default CartListItem

const styles = StyleSheet.create({
   image: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      objectFit: 'contain',
      borderRadius: 100,
      flex: 1
   },
   neo: {
      borderTopLeftRadius: SIZES.lg * 10,
      borderBottomLeftRadius: SIZES.lg * 10
   },
   title: {
      fontSize: 20
   },
   subtitle: {
      fontSize: 16
   }
})
