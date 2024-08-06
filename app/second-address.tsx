import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Input from '@/components/Input'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, TextInput } from 'react-native'
import {
   GooglePlacesAutocomplete,
   GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete'
import MapView, { Marker, Region } from 'react-native-maps'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const AddressScreen = () => {
   const bgColor = useThemeColor('primary')
   const textColor = useThemeColor('text')
   const {
      setDeliveryAddress,
      deliveryAddress,
      addToRecentAddresses,
      changingAddressFromCheckoutScreen,
      setChangingAddressFromCheckoutScreen
   } = useOrderFlowStore()
   const [apt, setApt] = useState<string>('')
   const [label, setLabel] = useState<string>('')
   const [address, setAddress] = useState<typeof deliveryAddress>(null)
   const [region, setRegion] = useState<Region | null>(null)

   const googleRef = useRef<GooglePlacesAutocompleteRef>(null)
   const aptRef = useRef<TextInput>(null)
   const mapRef = useRef<MapView>(null)

   useEffect(() => {
      if (googleRef.current) {
         if (address) {
            setRegion({
               ...address.coords,
               latitudeDelta: 0.001,
               longitudeDelta: 0.004
            })
         }
      }

      return () => {}
   }, [googleRef, address])

   useEffect(() => {
      googleRef.current?.blur()
      aptRef.current?.focus()
   }, [mapRef.current])

   return (
      <Container>
         <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
            {address && region && (
               <View style={{ height: SIZES.height * 0.25, width: 'auto' }}>
                  <MapView
                     ref={mapRef}
                     style={{
                        width: 'auto',
                        height: '100%'
                     }}
                     region={{
                        latitude: region?.latitude!,
                        longitude: region?.longitude!,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.005
                     }}>
                     <Marker coordinate={{ ...address.coords }} identifier="address" />
                  </MapView>
               </View>
            )}
            <View style={{ padding: SIZES.sm, gap: SIZES.lg * 1.5, flex: 1 }}>
               <GooglePlacesAutocomplete
                  ref={googleRef}
                  placeholder="Enter your address"
                  minLength={2}
                  listViewDisplayed="auto"
                  nearbyPlacesAPI="GooglePlacesSearch"
                  keyboardShouldPersistTaps="handled"
                  debounce={400}
                  fetchDetails={true}
                  enablePoweredByContainer={false}
                  onPress={(_, details = null) => {
                     if (details) {
                        setAddress({
                           street: details?.formatted_address,
                           coords: {
                              latitude: details?.geometry.location.lat,
                              longitude: details?.geometry.location.lng
                           },
                           addedOn: new Date().toISOString()
                        })
                        aptRef.current?.focus()
                     }
                  }}
                  query={{
                     key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
                     language: 'en',
                     components: 'country:us'
                  }}
                  styles={{
                     container: {
                        flex: 0
                     },

                     textInput: {
                        borderRadius: 30,
                        paddingHorizontal: SIZES.md,
                        backgroundColor: bgColor,
                        color: textColor
                     },
                     row: {
                        position: 'relative',
                        backgroundColor: bgColor
                     },
                     description: {
                        color: textColor
                     },
                     listView: {
                        borderRadius: 10,
                        marginHorizontal: 4,
                        zIndex: 900
                     },
                     loader: {
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        height: 20
                     }
                  }}
               />
               <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  contentContainerStyle={{ gap: SIZES.md }}
                  keyboardVerticalOffset={40}>
                  {address && (
                     <View style={{ gap: SIZES.lg * 1.3 }}>
                        <Input
                           ref={aptRef}
                           placeholder="App / Suite / Floor"
                           value={apt}
                           onChangeText={(text) => setApt(text.toUpperCase())}
                           containerStyle={{
                              backgroundColor: bgColor,
                              paddingHorizontal: SIZES.md
                           }}
                        />
                        <Input
                           placeholder="Label or Building Name"
                           value={label}
                           autoCapitalize="words"
                           onChangeText={setLabel}
                           containerStyle={{
                              backgroundColor: bgColor,
                              paddingHorizontal: SIZES.md
                           }}
                        />
                        <View style={{ width: '60%', alignSelf: 'center' }}>
                           <Button
                              disabled={!address}
                              title="Save"
                              onPress={() => {
                                 if (!address) return
                                 setDeliveryAddress({ ...address, apt, label })
                                 addToRecentAddresses({ ...address, apt, label })
                                 if (changingAddressFromCheckoutScreen) {
                                    setChangingAddressFromCheckoutScreen(false)
                                    router.back()
                                 } else {
                                    router.dismissAll()
                                 }
                              }}
                              type="soft"
                           />
                        </View>
                     </View>
                  )}
               </KeyboardAvoidingView>
            </View>
         </Animated.View>
      </Container>
   )
}

export default AddressScreen
