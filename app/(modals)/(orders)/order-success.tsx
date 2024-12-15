/* eslint-disable @typescript-eslint/no-require-imports */
import Button from '@/components/Button'
import ConfettiComponent, { ConfettiComponentRef } from '@/components/ConfettiComponent'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useCartsStore } from '@/stores/cartsStore'
import { router, useLocalSearchParams } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useEffect, useRef } from 'react'
import { useColorScheme } from 'react-native'

const OrderSuccess = () => {
   const { orderId } = useLocalSearchParams<{ orderId: string }>()
   const backgroundColor = useThemeColor('background')
   const isDark = useColorScheme() === 'dark'
   const confettiRef = useRef<ConfettiComponentRef>(null)

   const { removeCart } = useCartsStore()
   useEffect(() => {
      if (!orderId) return
      removeCart(orderId)
      confettiRef.current?.triggerConfetti()
   }, [orderId])
   return (
      <View style={{ flex: 1, backgroundColor }}>
         <ConfettiComponent ref={confettiRef} />
         <LottieView
            style={{ flex: 1, backgroundColor }}
            autoPlay
            loop
            resizeMode="contain"
            source={
               isDark
                  ? require('@/assets/animations/preparing-dark.json')
                  : require('@/assets/animations/preparing.json')
            }
         />
         <View
            style={{
               position: 'absolute',
               bottom: SIZES.height * 0.2,

               width: '60%',
               alignSelf: 'center',
               justifyContent: 'center'
            }}>
            <Button
               title="View Order"
               type="primary"
               contentTextStyle={{ color: '#ffffff' }}
               onPress={() => router.push({ pathname: '/order/[orderId]', params: { orderId } })}
            />
         </View>
      </View>
   )
}

export default OrderSuccess
