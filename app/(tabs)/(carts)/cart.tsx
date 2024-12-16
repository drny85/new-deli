/* eslint-disable @typescript-eslint/no-require-imports */
import Button from '@/components/Button'
import CartListItemView from '@/components/cart/CartListItemView'
import { Container } from '@/components/Container'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme.web'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useCartsStore } from '@/stores/cartsStore'
import { Feather } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import LottieView from 'lottie-react-native'
import React, { useMemo } from 'react'
import { Alert, Platform, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { toast } from 'sonner-native'

const Cart = () => {
   const { clearCarts, carts } = useCartsStore()
   const { top } = useSafeAreaInsets()
   const isDark = useColorScheme() === 'dark'
   const ascent = useThemeColor('ascent')

   const deleteAllCarts = () => {
      Alert.alert('Delete all carts?', 'Are you sure?', [
         { text: 'Cancel', style: 'cancel' },
         {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
               clearCarts()
               toast.success('Carts deleted', {
                  description: 'All carts deleted',
                  duration: 2000,
                  position: 'top-center'
               })
            }
         }
      ])
   }

   const data = useMemo(() => {
      return carts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
   }, [carts])

   return (
      <Container>
         <Row containerStyle={{ paddingHorizontal: SIZES.md }} align="between">
            <View />

            {carts.length > 0 && (
               <TouchableOpacity onPress={deleteAllCarts}>
                  {Platform.OS === 'ios' && <SymbolView name="trash" />}
                  {Platform.OS !== 'ios' && (
                     <Feather name="trash" size={24} color={isDark ? 'white' : ascent} />
                  )}
               </TouchableOpacity>
            )}
         </Row>
         <View style={{ position: 'absolute', top, alignSelf: 'center' }}>
            <Text center type="header">
               Carts
            </Text>
         </View>
         <FlashList
            data={data}
            ListEmptyComponent={
               <View
                  style={{
                     justifyContent: 'center',
                     height: SIZES.height * 0.8
                  }}>
                  <LottieView
                     style={{
                        height: SIZES.height * 0.6,
                        alignItems: 'center',
                        justifyContent: 'center'
                     }}
                     autoPlay
                     loop={false}
                     resizeMode="contain"
                     source={
                        isDark
                           ? require('@/assets/animations/empty_cart_dark.json')
                           : require('@/assets/animations/empty_cart_light.json')
                     }
                  />
                  <View style={{ width: '60%', alignSelf: 'center', height: SIZES.height * 0.2 }}>
                     <Button
                        title="Shop Now"
                        contentTextStyle={{ color: '#ffffff' }}
                        onPress={() => router.replace('/(restaurants)')}
                     />
                  </View>
               </View>
            }
            contentContainerStyle={{
               padding: 10,
               paddingVertical: SIZES.md
            }}
            estimatedItemSize={206}
            renderItem={({ item }) => <CartListItemView cart={item} />}
         />
      </Container>
   )
}

export default Cart
