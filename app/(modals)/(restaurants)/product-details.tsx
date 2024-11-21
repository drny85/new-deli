import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import AddonsSelector from '@/components/cart/MultipleAddonsSelection'
import ItemQuantitySetter from '@/components/ItemQuantitySetter'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'

import SizePicker from '@/components/restaurants/SizePicker'
import Row from '@/components/Row'
import ShareButton from '@/components/ShareLink'
import { Sheet, useSheetRef } from '@/components/Sheet'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { ADDONS, CART_ALLOWED } from '@/constants'
import { SIZES } from '@/constants/Colors'
import { useProduct } from '@/hooks/restaurants/useProduct'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Cart, CartItem, useCartsStore } from '@/stores/cartsStore'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { ORDER_TYPE, P_Size } from '@/typing'
import { toastAlert, toastMessage } from '@/utils/toast'
import { FontAwesome } from '@expo/vector-icons'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { router, useLocalSearchParams } from 'expo-router'
import { Image } from 'moti'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const PIC_DIMENSIONS = SIZES.height * 0.5

type PropsParams = {
   productId: string
   businessId: string
   itemId?: string | undefined
}

const ProductDetail = () => {
   const { productId, businessId, itemId } = useLocalSearchParams<PropsParams>()
   const backgroundColor = useThemeColor('background')
   const ascent = useThemeColor('ascent')
   const secondary = useThemeColor('secondary')
   const textColor = useThemeColor('text')
   const snapPoints = useMemo(() => ['60%'], [])
   const { bottom } = useSafeAreaInsets()
   const { createNewCart, carts, addToCart, updateCart } = useCartsStore()
   const { orderType, deliveryAddress } = useOrderFlowStore()
   const cart = carts.find((c) => c.restaurantId === businessId)
   const { product, loading } = useProduct(businessId!, productId!)
   const [selected, setSelected] = useState<P_Size | null>(null)
   const [quantity, setQuantity] = useState<number>(1)
   const bottomSheetRef = useSheetRef()
   const [instructions, setInstructions] = useState<string>('')
   const [showFullDescription, setShowFullDescription] = useState(false)
   const [selectedAddons, setSelectedAddons] = useState<string[]>([])

   const toggleAddonSelection = (addonName: string, maxSelectable: number) => {
      const isSelected = selectedAddons.includes(addonName)
      if (isSelected) {
         setSelectedAddons((prevState) => prevState.filter((name) => name !== addonName))
      } else {
         if (selectedAddons.length < maxSelectable) {
            setSelectedAddons((prevState) => [...prevState, addonName])
         } else {
            alert(`You can select up to ${maxSelectable} add-ons.`)
         }
      }
   }

   const itemAlreadyInCart = () => {
      if (product?.sizes && product.sizes.length > 0) {
         return cart?.items.find(
            (i) =>
               i.businessId === product?.businessId &&
               i.size?.id === selected?.id &&
               i.itemId === product.id
         )
      } else {
         return cart?.items.find((i) => i.businessId === product?.businessId && product.id === i.id)
      }
   }

   const handleAddToCart = async () => {
      if (itemId) {
         updateExistingCart()
         return
      }
      if (
         carts.length >= CART_ALLOWED &&
         carts.findIndex((c) => c.items.find((i) => i.businessId === product?.businessId)) === -1
      ) {
         return toastAlert({
            title: 'Error',
            message: 'You can only have 10 carts',
            preset: 'error',
            duration: 1
         })
      }
      if (!selected && product?.sizes && product.sizes.length > 0)
         return toastAlert({
            title: 'Pick One',
            message: 'You must pick a size',
            preset: 'custom',
            iconName: 'hand.raised.fill',
            duration: 2
         })
      if (!cart) {
         createOrGetCart()
      }
      const item: CartItem = {
         ...product!,
         itemId: new Date().getTime().toString(),
         addons: selectedAddons,
         price: selected?.price || product?.price!,
         size: selected,
         quantity,
         instructions
      }

      const added = await addToCart(item)
      if (!added)
         return toastAlert({
            title: 'Error',
            message: 'Something went wrong',
            preset: 'error',
            duration: 1
         })

      toastMessage({
         title: 'Success',
         message: 'Added to cart',
         preset: 'custom',
         iconName: 'cart.badge.plus',
         duration: 1
      })
      router.back()
   }

   const updateExistingCart = () => {
      const updated = {
         ...cart!,

         items: cart!.items.map((item) => {
            if (item.itemId === itemId) {
               return {
                  ...item,
                  size: selected,
                  quantity,
                  instructions,
                  addons: selectedAddons
               }
            }
            return item
         })
      }
      const updatedWithNewTotalAndQuantity = {
         ...updated,

         //total: updated.items.reduce((acc, item) => acc + +item.price * item.quantity, 0),
         total: updated.items.reduce(
            (acc, item) =>
               acc +
               (item.size !== null
                  ? +item.size.price * item.quantity
                  : +item.price * item.quantity),

            0
         ),
         quantity: updated.items.reduce((acc, item) => acc + item.quantity, 0)
      }

      if (!businessId) return
      updateCart(businessId, updatedWithNewTotalAndQuantity!)
      toastMessage({
         title: 'Success',
         message: 'Updated cart',
         duration: 2,
         preset: 'custom',
         iconName: 'cart.circle.fill',
         haptic: 'success'
      })
      router.back()
   }

   const createOrGetCart = useCallback((): Cart => {
      if (cart) return cart
      const c: Cart = {
         items: [],
         restaurantId: businessId!,
         total: 0,
         quantity: 0,
         deliveryAddress: orderType === 'delivery' && deliveryAddress ? deliveryAddress : null,
         orderType: orderType === 'delivery' ? ORDER_TYPE.delivery : ORDER_TYPE.pickup,
         createdAt: new Date().toISOString(),
         isShared: false
      }
      createNewCart(businessId!)
      return c
   }, [cart, orderType, deliveryAddress])

   useEffect(() => {
      if (itemId) {
         const item = cart?.items.find((i) => i.itemId === itemId)

         if (item) {
            setSelected(item.size)
            setQuantity(item.quantity)
            setInstructions(item.instructions)
            setSelectedAddons(item.addons)
         }
      }
   }, [itemId])

   if (loading || !product) return <Loading />

   return (
      <View style={{ flex: 1, backgroundColor, justifyContent: 'space-between' }}>
         <BackButton />
         <View style={{ position: 'absolute', right: 30, top: SIZES.statusBarHeight, zIndex: 99 }}>
            <NeoView rounded size={50}>
               <ShareButton
                  id={productId}
                  type="product"
                  params={{
                     productId,
                     businessId
                  }}
               />
            </NeoView>
         </View>
         <View
            style={{
               height: SIZES.height * 0.45,
               marginBottom: 10,
               alignSelf: 'center'
            }}>
            <Image
               source={{ uri: product.image! }}
               from={{
                  opacity: 0,
                  translateY: -SIZES.height * 0.8
               }}
               style={{
                  height: 0,
                  width: 0,
                  alignSelf: 'center'
               }}
               resizeMode="cover"
               blurRadius={2}
               animate={{
                  height: SIZES.height * 0.8,
                  borderRadius: SIZES.height * 0.8 * 0.5,
                  width: SIZES.height * 0.8,
                  alignSelf: 'center',
                  top: -SIZES.height * 0.4,
                  zIndex: 5,

                  opacity: 1,
                  translateY: 0
               }}
               //@ts-ignore
               transition={{ duration: 800, type: 'timing' }}
            />

            <Image
               from={{ rotate: '0deg' }}
               animate={{ rotate: '360deg' }}
               //@ts-ignore
               transition={{
                  duration: 600,
                  delay: 300,
                  type: 'timing'
               }}
               resizeMode="cover"
               source={{ uri: product.image! }}
               style={{
                  position: 'absolute',
                  height: PIC_DIMENSIONS / 2,
                  width: PIC_DIMENSIONS / 2,
                  borderRadius: PIC_DIMENSIONS / 4,
                  alignSelf: 'center',
                  bottom: -PIC_DIMENSIONS / 4,
                  top: SIZES.height * 0.2,
                  zIndex: 10
               }}
            />
            {itemAlreadyInCart() && (
               <TouchableOpacity
                  onPress={() => {
                     router.push(`/restaurant-cart/${businessId}`)
                  }}
                  style={{
                     position: 'absolute',
                     zIndex: 100,
                     backgroundColor,
                     bottom: 10,
                     alignSelf: 'center',
                     borderRadius: SIZES.sm,
                     padding: SIZES.sm * 0.5
                  }}>
                  <Text type="defaultSemiBold">{itemAlreadyInCart()?.quantity} In Cart</Text>
               </TouchableOpacity>
            )}
         </View>
         <ScrollView
            style={{ flex: 1, backgroundColor }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: SIZES.sm, gap: SIZES.md }}>
            <View>
               <Row align="between">
                  <View style={{ width: '70%' }}>
                     <Text type="header">{product.name}</Text>
                  </View>

                  <ItemQuantitySetter
                     disabled={quantity === 1}
                     quantity={quantity}
                     onPressAdd={() => setQuantity((prev) => prev + 1)}
                     onPressSub={() => setQuantity((prev) => (prev > 1 ? prev - 1 : prev))}
                  />
               </Row>

               <View style={{ marginTop: SIZES.lg, gap: SIZES.sm }}>
                  <Text type="defaultSemiBold">Description</Text>
                  <Text type="italic" fontSize="medium">
                     {product.description &&
                     product.description.length > 200 &&
                     !showFullDescription
                        ? product.description.slice(0, 200) + '...'
                        : product.description}
                     {product.description && product.description.length > 200 && (
                        <Text
                           style={{ fontWeight: '800' }}
                           onPress={() => setShowFullDescription((prev) => !prev)}
                           type="muted">
                           {' '}
                           {showFullDescription ? 'show less' : 'more'}
                        </Text>
                     )}
                  </Text>
               </View>
            </View>
            {product.multipleAddons && product.multipleAddons > 0 && (
               <AddonsSelector
                  addons={ADDONS}
                  maxSelectable={product.multipleAddons}
                  selectedAddons={selectedAddons}
                  toggleAddonSelection={(name) =>
                     toggleAddonSelection(name, product.multipleAddons!)
                  }
               />
            )}
            {product.sizes.length > 0 && (
               <View>
                  <SizePicker
                     selected={selected}
                     sizes={product.sizes}
                     onPress={(size) => {
                        setSelected(size)
                     }}
                  />
               </View>
            )}
            <View>
               <Row align="between">
                  <Text type="defaultSemiBold">Special Instructions</Text>
                  <TouchableOpacity onPress={() => bottomSheetRef.current?.present()}>
                     <FontAwesome name="edit" size={24} color={ascent} />
                  </TouchableOpacity>
               </Row>

               <TouchableOpacity
                  onPress={() => bottomSheetRef.current?.present()}
                  style={{
                     backgroundColor: secondary + '90',
                     padding: SIZES.sm,
                     borderRadius: SIZES.sm * 0.5,
                     marginTop: SIZES.sm * 0.5
                  }}>
                  <Text style={{ opacity: 0.9 }} type="italic">
                     {instructions ? instructions : 'Dressing on the side, etc.'}
                  </Text>
               </TouchableOpacity>
            </View>
         </ScrollView>

         <View
            style={{
               marginBottom: bottom,
               marginTop: SIZES.sm,
               flexDirection: 'row',
               alignItems: 'center',
               justifyContent: 'space-between',
               marginLeft: SIZES.md,
               height: 50,
               gap: SIZES.md,
               width: '100%'
            }}>
            <NeoView
               containerStyle={{ borderRadius: SIZES.lg * 2, width: SIZES.width * 0.45 }}
               innerStyleContainer={{
                  borderRadius: SIZES.lg * 2,
                  paddingHorizontal: SIZES.lg * 2,
                  paddingVertical: SIZES.sm,
                  height: 50
               }}>
               <Text type="defaultSemiBold" fontSize="large">
                  $ {((selected ? +selected.price : +product.price) * quantity).toFixed(2)}
               </Text>
            </NeoView>

            <View style={{ flexGrow: 1, marginRight: SIZES.lg }}>
               <Button
                  title={itemId ? 'Update Item' : 'Add To Cart'}
                  onPress={handleAddToCart}
                  contentTextStyle={{ color: '#ffffff' }}
               />
            </View>
         </View>
         <Sheet
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            topInset={SIZES.statusBarHeight}
            backgroundStyle={{
               backgroundColor
            }}>
            <View
               style={{
                  padding: SIZES.md,
                  marginTop: 20
               }}>
               <Text type="defaultSemiBold">Special Instructions</Text>
               <BottomSheetTextInput
                  style={[styles.container, { color: textColor }]}
                  placeholder="Dressing on the side, another request."
                  value={instructions}
                  multiline
                  maxLength={160}
                  onChangeText={setInstructions}
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
         {/* <InstructionBottomSheet
            instructions={instructions}
            setInstructions={setInstructions}
            bottomSheetRef={bottomSheetRef}
            placeholder="Dressing on the side, another request."
         /> */}
      </View>
   )
}

export default ProductDetail

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