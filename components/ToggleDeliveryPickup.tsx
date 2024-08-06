import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { SymbolView } from 'expo-symbols'
import React, { useState } from 'react'
import { Alert, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import { View } from './ThemedView'
import { useRestaurantsStore } from '@/stores/restaurantsStore'

interface ToggleDeliveryPickupProps {
   onOptionChange: (option: 'delivery' | 'pickup') => void
}

const ToggleDeliveryPickup: React.FC<ToggleDeliveryPickupProps> = ({ onOptionChange }) => {
   // const [option, setOption] = useState<'delivery' | 'pickup'>(initialOption);
   const { setOrderType, orderType } = useOrderFlowStore()
   const animatedValue = new Animated.Value(orderType === 'delivery' ? 0 : 1)
   const activeColor = useThemeColor('ascent')
   const bgColor = useThemeColor('background')
   const restaurant = useRestaurantsStore((s) => s.restaurant)

   const toggleOption = (value: typeof orderType) => {
      setOrderType(value)
      onOptionChange(value)
      Animated.timing(animatedValue, {
         toValue: orderType === 'delivery' ? 1 : 0,
         duration: 300,
         useNativeDriver: true
      }).start()
   }

   const deliveryIconOpacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.5]
   })

   const pickupIconOpacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 1]
   })

   return (
      <View style={[styles.container, { backgroundColor: bgColor }]}>
         <TouchableOpacity
            onPress={() => {
               if (restaurant?.ordersMethod === 'pickup-only') {
                  Alert.alert('Pickup Only', 'This restaurant only accepts pickup orders.')
                  return
               } else {
                  toggleOption('delivery')
               }
            }}>
            <Animated.View style={{ opacity: deliveryIconOpacity }}>
               <SymbolView
                  name="car.fill"
                  weight="bold"
                  tintColor={orderType === 'delivery' ? activeColor : 'gray'}
               />
            </Animated.View>
         </TouchableOpacity>
         <TouchableOpacity
            onPress={() => {
               if (restaurant?.ordersMethod === 'delivery-only') {
                  Alert.alert('Delivery Only', 'This restaurant only accepts delivery orders.')
                  return
               } else {
                  toggleOption('pickup')
               }
            }}>
            <Animated.View style={{ opacity: pickupIconOpacity }}>
               <SymbolView
                  name="figure.walk.motion"
                  type="monochrome"
                  weight="bold"
                  tintColor={orderType === 'pickup' ? activeColor : 'gray'}
               />
            </Animated.View>
         </TouchableOpacity>
      </View>
   )
}

export default ToggleDeliveryPickup

const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
      borderRadius: 30,

      width: SIZES.width * 0.3,
      height: 40
   }
})
