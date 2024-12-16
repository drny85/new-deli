import { Container } from '@/components/Container'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useCartsStore } from '@/stores/cartsStore'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { OrderAddress } from '@/shared/types'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useRef } from 'react'
import {
   FlatList,
   KeyboardAvoidingView,
   ListRenderItem,
   StyleSheet,
   TouchableOpacity
} from 'react-native'
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete'
import Animated, { SlideOutLeft } from 'react-native-reanimated'

const AddressScreen = () => {
   const params = useLocalSearchParams()
   const bgColor = useThemeColor('primary')
   const textColor = useThemeColor('text')
   const ascentColor = useThemeColor('ascent')
   const backgroundColor = useThemeColor('background')
   const { recentAddresses, deleteFromRecentAddresses, setDeliveryAddress } = useOrderFlowStore()
   const { updateCart, getCart } = useCartsStore()

   const googleRef = useRef<GooglePlacesAutocompleteRef>(null)

   const renderRecents: ListRenderItem<OrderAddress> = useCallback(({ item }) => {
      return (
         <Animated.View exiting={SlideOutLeft}>
            <Row
               align="between"
               containerStyle={{
                  padding: SIZES.sm,
                  backgroundColor,
                  borderBottomColor: ascentColor,
                  borderBottomWidth: StyleSheet.hairlineWidth
               }}>
               <TouchableOpacity
                  style={{ flexGrow: 1 }}
                  onPress={() => {
                     setDeliveryAddress(item)
                     if (params && params.restaurantId) {
                        const cart = getCart(params.restaurantId as string)
                        updateCart(params.restaurantId as string, {
                           ...cart!,
                           deliveryAddress: item
                        })
                     }
                     router.back()
                  }}>
                  <Row>
                     <FontAwesome
                        name={
                           item.label && item.label.toLowerCase() === 'home' ? 'home' : 'map-marker'
                        }
                        size={22}
                        color={ascentColor}
                        style={{ marginRight: SIZES.sm }}
                     />
                     <View>
                        {item.label && <Text type="defaultSemiBold">{item.label}</Text>}
                        <Text>{item.street.slice(0, -15)}</Text>
                        {item.apt && <Text>Apt / FL: {item.apt}</Text>}
                     </View>
                  </Row>
               </TouchableOpacity>
               <FontAwesome
                  name="trash"
                  style={{ padding: 6 }}
                  size={20}
                  color={textColor}
                  onPress={() => deleteFromRecentAddresses(item)}
               />
            </Row>
         </Animated.View>
      )
   }, [])

   useEffect(() => {
      if (googleRef.current) {
         googleRef.current.focus()
      }

      return () => {}
   }, [])

   return (
      <Container>
         <KeyboardAvoidingView
            style={{ flex: 1, padding: SIZES.md }}
            contentContainerStyle={{ padding: SIZES.md }}
            behavior="padding"
            keyboardVerticalOffset={40}>
            <Animated.View>
               <TouchableOpacity
                  onPress={() => router.push({ pathname: '/second-address' })}
                  style={{
                     padding: SIZES.sm,
                     gap: SIZES.lg * 2,
                     borderRadius: SIZES.lg * 2,
                     backgroundColor: bgColor
                  }}>
                  <Text>Type your delivery address</Text>
               </TouchableOpacity>
            </Animated.View>
            <Animated.View>
               <FlatList
                  data={recentAddresses.sort((a, b) => b.addedOn.localeCompare(a.addedOn))}
                  ListHeaderComponent={
                     recentAddresses.length > 0 ? (
                        <Text type="title" style={{ fontSize: 20 }}>
                           Recent Addresses
                        </Text>
                     ) : undefined
                  }
                  renderItem={renderRecents}
                  contentContainerStyle={{ marginTop: SIZES.lg }}
               />
            </Animated.View>
         </KeyboardAvoidingView>
      </Container>
   )
}

export default AddressScreen
