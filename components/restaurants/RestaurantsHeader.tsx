import { SIZES } from '@/constants/Colors'
import { useLocation } from '@/hooks/useLocation'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import NeoView from '../NeoView'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import ToggleDeliveryPickup from '../ToggleDeliveryPickup'

type Props = {
   onOptionChange: (option: 'delivery' | 'pickup') => void
}
const RestaurantsHeader = ({ onOptionChange }: Props) => {
   const deliveryAddress = useOrderFlowStore((s) => s.deliveryAddress)
   const { loading, adddress } = useLocation(deliveryAddress)
   const textColor = useThemeColor('text')

   return (
      <Row align="between" containerStyle={{ width: '100%', marginBottom: SIZES.md }}>
         <View style={{ gap: SIZES.sm * 0.5 }}>
            <Text style={{ fontWeight: '600', color: 'grey', fontSize: 14 }}>Deliver Now</Text>
            <TouchableOpacity onPress={() => router.push('/address')}>
               <Row containerStyle={{ gap: SIZES.sm }}>
                  <Text style={{ fontWeight: '600', fontSize: 14 }}>
                     {loading && !adddress
                        ? 'Loading...'
                        : deliveryAddress
                          ? deliveryAddress?.street.split(',')[0]
                          : adddress
                            ? adddress
                            : 'Set Delivery Address'}
                  </Text>

                  <FontAwesome name="chevron-down" size={18} color={textColor} />
               </Row>
            </TouchableOpacity>
         </View>

         <NeoView
            containerStyle={{ borderRadius: SIZES.lg * 1.5 }}
            innerStyleContainer={{ borderRadius: SIZES.lg * 1.5 }}>
            <ToggleDeliveryPickup onOptionChange={onOptionChange} />
         </NeoView>
      </Row>
   )
}

export default RestaurantsHeader
