import { updateBusiness } from '@/actions/business'
import { userCouriersCollection } from '@/collections'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Input from '@/components/Input'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import ProgressBar from '@/components/ProgressBar'
import RestaurantCard from '@/components/restaurants/RestaurantCard'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { globalStyle } from '@/constants/styles'
import { auth, connectedStore, isEmailVerified } from '@/firebase'
import { useUser } from '@/hooks/auth/useUser'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { usePhoto } from '@/hooks/usePhoto'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { Business, ConnectedAccountParams } from '@/shared/types'
import { formatPhone } from '@/utils/formatPhone'
import { toastAlert } from '@/utils/toast'
import { Redirect, router } from 'expo-router'
import { sendEmailVerification, User } from 'firebase/auth'
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native'
import {
   GooglePlacesAutocomplete,
   GooglePlacesAutocompleteRef
} from 'react-native-google-places-autocomplete'
import Animated, { SlideInUp } from 'react-native-reanimated'

const Onboarding = () => {
   useUser()
   const { user, logOut } = useAuth()
   const [processing, setProcessing] = useState(false)
   const { restaurant, loading } = useRestaurant(user?.id!)
   const googleRef = useRef<GooglePlacesAutocompleteRef>(null)
   const textColor = useThemeColor('text')
   const [userRecord, setUserRecord] = useState<User | null>(null)
   const nameRef = useRef<TextInput>(null)
   const phoneRef = useRef<TextInput>(null)
   const [continueToPayment, setContinueToPayment] = useState(false)
   const [restaurantData, setRestaurantData] = useState<Business | null>(null)
   const bgColor = useThemeColor('background')

   const { handleImageUpload, photo, selectedImage, uploadPhoto, resetAll, progress } = usePhoto()

   const updateRestaurant = async () => {
      try {
         if (!photo || !restaurant?.id) return
         const updated = await uploadPhoto(photo, restaurant?.id)
         console.log('GGG', restaurant.id, photo)
         setContinueToPayment(updated)
      } catch (error) {
         console.log(error)
      }
   }

   const checkForEmailVerification = async () => {
      try {
         const currentUser = auth.currentUser
         if (!currentUser) return
         if (currentUser.emailVerified || user?.emailVerified) return
         await isEmailVerified({ email: currentUser.email! })
         setUserRecord(currentUser)
      } catch (error) {
         console.log(error)
      }
   }

   const getParamsUrl = useCallback(
      async (res: Business) => {
         const { name, phone, address, owner } = res
         const params: ConnectedAccountParams = {
            businessName: name,
            phone: phone?.replace(/[^\d\+]/g, '')!,
            address: address!,
            lastName: owner.lastName,
            name: owner.name,
            mode: 'test',
            type: 'business'
         }
         try {
            setProcessing(true)
            const func = connectedStore()
            const { data } = await func(params)
            const { result, success } = data
            if (success) {
               router.push({ pathname: '/stripe', params: { url: result } })
            } else {
               toastAlert({
                  message: 'Error conencting Store',
                  title: 'Error',
                  preset: 'error'
               })
            }
         } catch (error) {
            console.log(error)
         } finally {
            setProcessing(false)
         }
      },
      [restaurantData]
   )
   useEffect(() => {
      if (!selectedImage || !continueToPayment) return
      if (selectedImage && continueToPayment) {
         setRestaurantData({ ...restaurantData!, image: selectedImage })
         updateBusiness({ ...restaurantData!, image: selectedImage })

         getParamsUrl({ ...restaurantData!, image: selectedImage, phone: user?.phone! })
      }
   }, [selectedImage, continueToPayment])

   useEffect(() => {
      if (!restaurant) return
      console.log('RAN')
      setRestaurantData(restaurant)
   }, [restaurant])
   useEffect(() => {
      checkForEmailVerification()
   }, [auth.currentUser])

   if (loading) return <Loading />

   if (processing)
      return (
         <Container>
            <LottieView
               source={require('@/assets/animations/searching_light.json')}
               autoPlay
               style={{ flex: 1 }}
               resizeMode="cover"
               loop
            />
         </Container>
      )

   if (restaurant?.charges_enabled) return <Redirect href={'/(deli)/(products)/products'} />
   return (
      <Container>
         <View style={{ flex: 1 }}>
            <Row align="between" containerStyle={{ paddingHorizontal: SIZES.lg }}>
               <Text />
               <Text center type="header">
                  Welcome {user?.name}
               </Text>
               <TouchableOpacity onPress={logOut}>
                  <Text style={{ fontWeight: '600' }} type="muted">
                     Exit
                  </Text>
               </TouchableOpacity>
            </Row>
            <View style={{ padding: SIZES.md }}>
               {progress && <ProgressBar progress={progress} />}
               {user?.emailVerified && (
                  <View>
                     <NeoView
                        innerStyleContainer={{
                           borderRadius: SIZES.md
                        }}
                        containerStyle={{ borderRadius: SIZES.md }}>
                        {!photo?.assets![0].uri && (
                           <Text
                              type="defaultSemiBold"
                              style={{
                                 position: 'absolute',
                                 zIndex: 20,
                                 alignSelf: 'center',
                                 top: (SIZES.height * 0.2) / 2 - 20
                              }}>
                              Select an Image for your business
                           </Text>
                        )}
                        <TouchableOpacity
                           onPress={handleImageUpload}
                           style={{ borderRadius: SIZES.md }}>
                           {/* <Image
                              source={{
                                 uri:
                                    restaurantData?.image ||
                                    selectedImage ||
                                    photo?.assets![0].uri! ||
                                    ''
                              }}
                              style={{
                                 objectFit: 'cover',
                                 height: SIZES.height * 0.2,
                                 width: '100%',
                                 borderRadius: SIZES.md
                              }}
                           /> */}
                           <RestaurantCard
                              item={{ ...restaurantData!, image: photo?.assets![0].uri || '' }}
                              onPress={handleImageUpload}
                              contentContainerStyle={{ borderRadius: SIZES.md }}
                           />
                        </TouchableOpacity>
                     </NeoView>
                     <NeoView
                        innerStyleContainer={{
                           padding: SIZES.md,
                           borderRadius: SIZES.md,
                           gap: SIZES.lg
                        }}
                        containerStyle={{ borderRadius: SIZES.md }}>
                        <Animated.Text
                           style={{
                              fontSize: 18,
                              fontFamily: 'Montserrat',
                              color: textColor,
                              textAlign: 'center',
                              marginBottom: SIZES.lg
                           }}
                           entering={SlideInUp.delay(800).duration(800)}>
                           Lets start with the most usefull information
                        </Animated.Text>

                        <Input
                           title="Business Name"
                           ref={nameRef}
                           value={restaurantData?.name}
                           onChangeText={(text) => {
                              setRestaurantData({
                                 ...restaurantData!,
                                 name: text
                              })
                           }}
                           onEndEditing={async () => {
                              if (!restaurant) return
                              phoneRef.current?.focus()
                           }}
                           autoCapitalize="words"
                           returnKeyLabel="Next"
                           returnKeyType="next"
                           placeholder={`${user.name}'s Grocery`}
                           containerStyle={{ borderRadius: SIZES.md }}
                        />

                        {restaurantData?.name && (
                           <Input
                              ref={phoneRef}
                              title={`${restaurantData?.name}'s phone number`}
                              value={restaurantData?.phone!}
                              onChangeText={(text) => {
                                 setRestaurantData({
                                    ...restaurantData!,
                                    phone: formatPhone(text)
                                 })
                              }}
                              autoCapitalize="words"
                              keyboardType="number-pad"
                              placeholder={'(800) 987-6543'}
                              containerStyle={{ borderRadius: SIZES.md }}
                           />
                        )}
                        {restaurantData?.name && (
                           <GooglePlacesAutocomplete
                              ref={googleRef}
                              placeholder={`${restaurantData?.name}'s address`}
                              minLength={2}
                              listViewDisplayed="auto"
                              nearbyPlacesAPI="GooglePlacesSearch"
                              keyboardShouldPersistTaps="handled"
                              debounce={400}
                              fetchDetails={true}
                              enablePoweredByContainer={false}
                              onPress={(_, details = null) => {
                                 if (details) {
                                    setRestaurantData({
                                       ...restaurantData,
                                       coords: {
                                          latitude: details?.geometry.location.lat,
                                          longitude: details?.geometry.location.lng
                                       },
                                       address: details?.formatted_address
                                    })
                                    //      setAddress({
                                    //         street: details?.formatted_address,
                                    //         coords: {
                                    //            latitude: details?.geometry.location.lat,
                                    //            longitude: details?.geometry.location.lng
                                    //         },
                                    //         addedOn: new Date().toISOString()
                                    //      })
                                    //      aptRef.current?.focus()
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
                                    borderRadius: SIZES.md,
                                    paddingHorizontal: SIZES.md,
                                    backgroundColor: bgColor,
                                    color: textColor,
                                    ...globalStyle.shadow,
                                    shadowOpacity: 0.2
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
                        )}
                     </NeoView>
                     <View style={{ width: '50%', alignSelf: 'center', marginTop: SIZES.lg }}>
                        <Button
                           title="Update"
                           type="soft"
                           onPress={() => {
                              if (!restaurant) return
                              if (!photo?.assets) {
                                 toastAlert({
                                    title: 'Error',
                                    message: 'Please select an image'
                                 })
                                 handleImageUpload()
                                 return
                              }
                              if (!restaurantData?.name) {
                                 nameRef.current?.focus()
                                 toastAlert({
                                    title: 'Error',
                                    message: 'Please enter a valid name'
                                 })
                                 return
                              }
                              if (!restaurantData?.phone) {
                                 phoneRef.current?.focus()
                                 toastAlert({
                                    title: 'Error',
                                    message: 'Please enter a valid phone number'
                                 })
                                 return
                              }
                              if (!restaurantData?.address) {
                                 googleRef.current?.focus()
                                 toastAlert({
                                    title: 'Error',
                                    message: 'Please enter a valid address'
                                 })
                                 return
                              }

                              updateRestaurant()
                           }}
                        />
                     </View>
                  </View>
               )}
            </View>
            {!user?.emailVerified && (
               <View center style={{ gap: SIZES.md }}>
                  <Animated.Text
                     style={{
                        fontSize: 18,
                        fontFamily: 'Montserrat-Bold',
                        color: textColor,
                        textAlign: 'center'
                     }}
                     entering={SlideInUp.delay(600).duration(800)}>
                     Lets get you ready for business
                  </Animated.Text>
                  <View
                     style={{
                        justifyContent: 'center',
                        padding: SIZES.sm,
                        gap: SIZES.md
                     }}>
                     <Text>First thing we need to do is to verify your email</Text>
                     <Text>Please check your inbox / junk mail / spam folder</Text>
                  </View>
                  <TouchableOpacity
                     style={{
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                        paddingVertical: SIZES.sm,
                        paddingHorizontal: SIZES.lg,
                        backgroundColor: bgColor,
                        borderRadius: 20
                     }}
                     onPress={() => {
                        if (!userRecord) return
                        console.log('HERE')
                        if (!userRecord.emailVerified) {
                           checkForEmailVerification()
                           console.log('HERE 2')
                           return
                        }
                        sendEmailVerification(userRecord).then(() => {
                           console.log('Email verification sent')
                           toastAlert({
                              title: 'Success',
                              message: 'Email verification sent'
                           })
                        })
                     }}>
                     <Text type="header">I verified my email</Text>
                  </TouchableOpacity>
               </View>
            )}
         </View>
      </Container>
   )
}

export default Onboarding
