import Button from '@/components/Button'
import CartListItemView from '@/components/cart/CartListItemView'
import { Container } from '@/components/Container'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { useCartsStore } from '@/stores/cartsStore'
import { toastMessage } from '@/utils/toast'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import LottieView from 'lottie-react-native'
import React from 'react'
import { Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Animated, { SlideInLeft } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Cart = () => {
   const { clearCarts, carts } = useCartsStore()
   const { top } = useSafeAreaInsets()
   const isDark = useColorScheme() === 'dark'

   const deleteAllCarts = () => {
      Alert.alert('Delete all carts?', 'Are you sure?', [
         { text: 'Cancel', style: 'cancel' },
         {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
               clearCarts()
               toastMessage({
                  title: 'Carts deleted',
                  message: 'All carts deleted',
                  preset: 'done'
               })
            }
         }
      ])
   }

   return (
      <Container>
         <Row containerStyle={{ paddingHorizontal: SIZES.md }} align="between">
            <View />

            {carts.length > 0 && (
               <TouchableOpacity onPress={deleteAllCarts}>
                  <SymbolView name="trash" />
               </TouchableOpacity>
            )}
         </Row>
         <View style={{ position: 'absolute', top, alignSelf: 'center' }}>
            <Text center type="header">
               Carts
            </Text>
         </View>
         {carts.length > 0 && (
            <ScrollView
               contentInsetAdjustmentBehavior="automatic"
               style={{ flex: 1 }}
               contentContainerStyle={{ padding: SIZES.md, gap: SIZES.md }}>
               {carts
                  .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                  .map((cart, index) => {
                     return (
                        <Animated.View
                           key={cart.restaurantId + index}
                           entering={SlideInLeft.delay(index * 200).duration(600)}>
                           <CartListItemView cart={cart} />
                        </Animated.View>
                     )
                  })}
            </ScrollView>
         )}
         {carts.length === 0 && (
            <View style={{ flex: 1, justifyContent: 'center' }}>
               <LottieView
                  style={{ flex: 0.8 }}
                  autoPlay
                  loop={false}
                  resizeMode="contain"
                  source={
                     isDark
                        ? require('@/assets/animations/empty_cart_dark.json')
                        : require('@/assets/animations/empty_cart_light.json')
                  }
               />
               <View style={{ width: '60%', alignSelf: 'center' }}>
                  <Button
                     title="Shop Now"
                     contentTextStyle={{ color: '#ffffff' }}
                     onPress={() => router.replace('/(restaurants)')}
                  />
               </View>
            </View>
         )}
      </Container>
   )
}

export default Cart
