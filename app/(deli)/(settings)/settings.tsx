import { updateBusiness } from '@/actions/business'
import Input from '@/components/Input'
import ItemQuantitySetter from '@/components/ItemQuantitySetter'
import NeoView from '@/components/NeoView'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { SIZES } from '@/constants/Colors'
import { isFromToday } from '@/helpers/isFromToday'
import { usePhoto } from '@/hooks/usePhoto'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { DELIVERY_TYPE, ORDER_STATUS } from '@/typing'
import { generateRandomNumbers } from '@/utils/generateRandomNumber'
import { toastAlert, toastMessage } from '@/utils/toast'
import {
   Feather,
   FontAwesome5,
   Ionicons,
   MaterialCommunityIcons,
   MaterialIcons,
   Octicons
} from '@expo/vector-icons'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
   Alert,
   Appearance,
   ScrollView,
   StyleSheet,
   Switch,
   TouchableOpacity,
   useWindowDimensions,
   View
} from 'react-native'

type Props = {
   darkMode: boolean
   emailNotifications: boolean
   otpPIN: boolean
   byMiles: boolean
   deliveryType: DELIVERY_TYPE
}

export default function BusinessSettings() {
   const { restaurant } = useRestaurantsStore()
   const [form, setForm] = useState<Props>({
      darkMode: false,
      emailNotifications: true,
      otpPIN: true,
      byMiles: restaurant?.deliveryType === 'miles',
      deliveryType: restaurant?.deliveryType!
   })
   const [zip, setZip] = useState('')
   const [miles, setMiles] = useState('')

   const backgroundColor = useThemeColor('background')
   const secondaryColor = useThemeColor('secondary')
   const ascentColor = useThemeColor('ascent')
   const { width } = useWindowDimensions()
   const { orders } = useBusinessOrdersStore()

   const canNotClosed = useMemo(() => {
      return orders
         .filter((o) => isFromToday(o.orderDate))
         .some(
            (order) =>
               order.status !== ORDER_STATUS.delivered &&
               order.status !== ORDER_STATUS.picked_up_by_client
         )
   }, [orders])

   const { handleImageUpload, photo, selectedImage, uploadPhoto, resetAll } = usePhoto()

   const handleOpenAndCloseStore = async (value: boolean) => {
      try {
         if (canNotClosed && !value) {
            return toastAlert({
               message:
                  'You cannot close the store until all orders are delivered or picked up by the client.',
               title: 'Error',
               preset: 'error',
               duration: 5
            })
         }
         if (restaurant) {
            updateBusiness({
               ...restaurant!,
               isOpen: value
            })
         }
      } catch (error) {
         console.log(error)
      }
   }

   const updatedOrdersDeliveryMethod = useCallback((index: number) => {
      if (index === 2) {
         if (restaurant) {
            updateBusiness({
               ...restaurant!,
               ordersMethod: 'both'
            })
         }
      } else if (index === 1) {
         if (restaurant) {
            updateBusiness({
               ...restaurant!,
               ordersMethod: 'pickup-only'
            })
         }
      } else if (index === 0) {
         if (restaurant) {
            updateBusiness({
               ...restaurant!,
               ordersMethod: 'delivery-only'
            })
         }
      } else {
         console.log('Invalid index')
      }
   }, [])

   useEffect(() => {
      if (form.otpPIN) {
         updateBusiness({
            ...restaurant!,
            requiredOTP: true
         })
      } else {
         updateBusiness({
            ...restaurant!,
            requiredOTP: false
         })
      }
   }, [form.otpPIN])

   useEffect(() => {
      if (selectedImage && photo && restaurant) {
         updateBusiness({ ...restaurant!, image: selectedImage })
         resetAll()
         toastMessage({
            message: 'Profile picture updated successfully',
            title: 'Success',
            preset: 'done'
         })
      }
   }, [selectedImage, photo])

   useEffect(() => {
      if (!restaurant) return
      if (restaurant.miles) {
         setMiles(restaurant.miles.toString())
      }

      setForm({
         ...form,
         byMiles: restaurant.deliveryType === 'miles',
         darkMode: Appearance.getColorScheme() === 'dark'
      })

      if (restaurant.otpOverride) {
         Alert.alert(
            'OTP PIN has been overrided.',
            `Provide this PIN only and only if the courier cannot get the PIN from the customer. \n PIN Will be deleted when you press OK \n Here is the PIN: ${restaurant.otpOverride}`,
            [
               {
                  text: 'OK',
                  onPress: () => {
                     updateBusiness({
                        ...restaurant!,
                        otpOverride: null
                     })
                  }
               }
            ]
         )
      }
   }, [restaurant])

   return (
      <View style={[styles.container, { backgroundColor }]}>
         <View style={[styles.profile, { backgroundColor }]}>
            <TouchableOpacity
               onPress={() => {
                  // handle onPress
               }}>
               <View style={[styles.profileAvatarWrapper, { width: width * 0.94 }]}>
                  <Image
                     alt=""
                     source={{
                        uri: photo?.assets![0].uri ? photo?.assets![0].uri : restaurant?.image!
                     }}
                     style={styles.profileAvatar}
                  />
                  {!restaurant?.isOpen && (
                     <View
                        style={{
                           position: 'absolute',
                           top: (SIZES.height * 0.25) / 2,

                           zIndex: 600,
                           backgroundColor: 'rgba(0,0,0,0.3)',
                           padding: SIZES.md,
                           width: '20%',
                           alignSelf: 'center',
                           borderRadius: SIZES.md
                        }}>
                        <Text
                           center
                           style={{
                              fontSize: 22,
                              fontWeight: '600',
                              color: '#fefefe'
                           }}>
                           CLOSED
                        </Text>
                     </View>
                  )}

                  <TouchableOpacity
                     onPress={
                        () => {
                           if (photo && photo?.assets![0].uri) {
                              const updated = uploadPhoto(photo, restaurant?.id!)
                              console.log(updated)
                           } else {
                              handleImageUpload()
                           }
                        }
                        // handle onPress
                     }>
                     <View style={styles.profileAction}>
                        <Feather
                           color="#fff"
                           name={photo?.assets![0].uri ? 'save' : 'edit-3'}
                           size={26}
                        />
                     </View>
                  </TouchableOpacity>
                  {photo && photo.assets![0].uri && (
                     <TouchableOpacity
                        style={{ marginHorizontal: SIZES.lg }}
                        onPress={
                           () => {
                              resetAll()
                           }
                           // handle onPress
                        }>
                        <View style={[styles.profileAction, { right: 70 }]}>
                           <Feather color="#fff" name={'x-circle'} size={26} />
                        </View>
                     </TouchableOpacity>
                  )}
               </View>
            </TouchableOpacity>

            <View>
               <Text style={styles.profileName}>{restaurant?.name}</Text>

               <Text style={styles.profileAddress}>{restaurant?.address}</Text>
               <Text style={styles.profileAddress}>{restaurant?.email}</Text>
               <Text style={styles.profileAddress}>{restaurant?.phone}</Text>
            </View>
         </View>

         <ScrollView keyboardDismissMode="on-drag">
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Actions</Text>

               <View style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                     <MaterialCommunityIcons name="door-closed" size={24} color={'#ffffff'} />
                  </View>

                  <Text style={styles.rowLabel}>Open / Close Store</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                     onValueChange={(isOpen) => {
                        // updateBusiness({ ...restaurant!, isOpen })
                        Alert.alert(
                           'Confirm',
                           `Are you sure you want to ${isOpen ? 'open' : 'close'} this store?`,
                           [
                              {
                                 text: 'Cancel',
                                 onPress: () => {},
                                 style: 'cancel'
                              },
                              {
                                 text: 'YES',
                                 style: 'destructive',
                                 onPress: () => {
                                    handleOpenAndCloseStore(isOpen)
                                 }
                              }
                           ]
                        )
                     }}
                     value={restaurant?.isOpen}
                  />
               </View>
               <View style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                     <MaterialIcons name="delivery-dining" size={24} color={'#ffffff'} />
                  </View>

                  <Text style={styles.rowLabel}>Minimun For Delivery</Text>

                  <View style={styles.rowSpacer} />

                  <ItemQuantitySetter
                     quantity={restaurant?.minimumDelivery ? restaurant.minimumDelivery : 0}
                     onPressAdd={() => {
                        if (restaurant?.minimumDelivery) {
                           updateBusiness({
                              ...restaurant!,
                              minimumDelivery: restaurant.minimumDelivery + 1
                           })
                        } else {
                           updateBusiness({
                              ...restaurant!,
                              minimumDelivery: 1
                           })
                        }
                     }}
                     onPressSub={() => {
                        if (restaurant?.minimumDelivery && restaurant?.minimumDelivery > 0) {
                           updateBusiness({
                              ...restaurant!,
                              minimumDelivery: restaurant.minimumDelivery - 1
                           })
                        }
                     }}
                  />
               </View>
               <View style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: '#8338ec' }]}>
                     <FontAwesome5 name="shipping-fast" size={22} color="#fff" />
                  </View>

                  <Text style={styles.rowLabel}>Delivery ETA</Text>

                  <View style={styles.rowSpacer} />

                  <ItemQuantitySetter
                     quantity={restaurant?.eta ? restaurant.eta : 10}
                     onPressAdd={() => {
                        if (restaurant?.eta) {
                           updateBusiness({
                              ...restaurant!,
                              eta: restaurant.eta + 1
                           })
                        } else {
                           updateBusiness({
                              ...restaurant!,
                              eta: 10
                           })
                        }
                     }}
                     onPressSub={() => {
                        if (restaurant?.eta && restaurant?.eta > 10) {
                           updateBusiness({
                              ...restaurant!,
                              eta: restaurant.eta - 1
                           })
                        }
                     }}
                  />
               </View>
            </View>
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Preferences</Text>

               <View style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: ascentColor }]}>
                     <Feather color="#fff" name="moon" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Dark Mode</Text>

                  <View style={styles.rowSpacer} />

                  <Switch
                     onValueChange={(darkMode) => setForm({ ...form, darkMode })}
                     value={form.darkMode}
                  />
               </View>
               <View style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: '#006d77' }]}>
                     <Feather color="#fff" name="truck" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Delivery Type</Text>

                  <View style={styles.rowSpacer} />

                  <View style={{ width: '35%' }}>
                     <SegmentedControl
                        values={['By Miles', 'By Zip Code']}
                        selectedIndex={restaurant?.deliveryType === 'miles' ? 0 : 1}
                        activeFontStyle={{
                           color: ascentColor,
                           fontSize: 16,
                           fontWeight: '600'
                        }}
                        fontStyle={{
                           fontSize: 16
                        }}
                        style={{ height: 48 }}
                        onChange={(e) => {
                           const index = e.nativeEvent.selectedSegmentIndex
                           setForm({
                              ...form,
                              deliveryType: index === 0 ? 'miles' : 'zips'
                           })
                           if (restaurant) {
                              updateBusiness({
                                 ...restaurant!,
                                 deliveryType: index === 0 ? 'miles' : 'zips'
                              })
                           }
                        }}
                     />
                  </View>
               </View>
               {restaurant?.deliveryType === 'miles' && form.deliveryType === 'miles' && (
                  <View style={[styles.row, { backgroundColor: secondaryColor }]}>
                     <View style={[styles.rowIcon, { backgroundColor: '#003459' }]}>
                        <Feather color="#fff" name="at-sign" size={20} />
                     </View>

                     <Text style={styles.rowLabel}>How Many Miles</Text>

                     <View style={styles.rowSpacer} />
                     <ItemQuantitySetter
                        quantity={restaurant.miles}
                        onPressAdd={() => {
                           updateBusiness({
                              ...restaurant!,
                              miles: restaurant.miles + 1
                           })
                        }}
                        onPressSub={() => {
                           if (restaurant.miles > 1) {
                              updateBusiness({
                                 ...restaurant!,
                                 miles: restaurant.miles - 1
                              })
                           }
                        }}
                     />
                  </View>
               )}
               {(restaurant?.deliveryType === 'zips' || form.deliveryType === 'zips') && (
                  <View style={{ width: '100%' }}>
                     <View style={[styles.row, { backgroundColor: secondaryColor }]}>
                        <View style={[styles.rowIcon, { backgroundColor: ascentColor }]}>
                           <Octicons name="number" size={22} color={'#ffffff'} />
                        </View>

                        <Text style={styles.rowLabel}>Zip Code</Text>

                        <View style={styles.rowSpacer} />

                        <View style={{ flex: 0.33 }}>
                           <Input
                              containerStyle={{ width: '100%' }}
                              value={zip}
                              placeholder="New Zip Code"
                              textAlign="center"
                              returnKeyType="send"
                              keyboardType="numeric"
                              onEndEditing={async (e) => {
                                 // handle onEndEditing
                                 const text = e.nativeEvent.text
                                 if (text.length !== 5) {
                                    Alert.alert(
                                       'Invalid Zip Code',
                                       'Please enter a valid 5-digit zip code.'
                                    )
                                    return
                                 }
                                 const found = restaurant?.zips.findIndex((z) => z === +zip)
                                 if (found !== -1) {
                                    Alert.alert(
                                       'Duplicate Zip Code',
                                       'This zip code is already associated with this restaurant.'
                                    )
                                    return
                                 }
                                 const newZips = [...(restaurant?.zips || []), +zip]
                                 const updated = await updateBusiness({
                                    ...restaurant!,
                                    zips: newZips
                                 })
                                 if (updated) {
                                    setZip('')
                                    toastMessage({
                                       title: 'Success',
                                       message: 'Zip was added'
                                    })
                                 }
                              }}
                              onChangeText={(zipCode) => {
                                 setZip(zipCode.replace(/[^0-9]/g, ''))
                              }}
                           />
                        </View>
                     </View>
                     {restaurant?.zips && restaurant.zips.length > 0 && (
                        <NeoView
                           containerStyle={{ borderRadius: SIZES.sm, marginBottom: 6 }}
                           innerStyleContainer={{
                              borderRadius: SIZES.sm,
                              padding: SIZES.sm,
                              backgroundColor: secondaryColor
                           }}>
                           <Row containerStyle={{ gap: SIZES.sm, flexWrap: 'wrap' }}>
                              {[
                                 restaurant?.zips
                                    .sort((a, b) => (a > b ? 1 : -1))
                                    .map((zip) => <Text key={zip}>{zip}</Text>)
                              ]}
                           </Row>
                        </NeoView>
                     )}
                  </View>
               )}

               <TouchableOpacity
                  onPress={() => {
                     // handle onPress
                  }}
                  style={[
                     styles.row,
                     { backgroundColor: secondaryColor, justifyContent: 'space-between' }
                  ]}>
                  <View style={[styles.rowIcon, { backgroundColor: ascentColor }]}>
                     <Ionicons name="lock-open-outline" size={24} color={'#ffffff'} />
                  </View>

                  <Text style={styles.rowLabel}>OTP Required</Text>

                  <View style={styles.rowSpacer} />

                  <TouchableOpacity
                     disabled={!restaurant}
                     onPress={async () => {
                        if (!restaurant) return
                        await updateBusiness({
                           ...restaurant!,
                           otpOverride: generateRandomNumbers()
                        })
                     }}
                     style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        left: 0,
                        right: 0,
                        zIndex: 20
                     }}>
                     <Text style={{ fontSize: 16, fontWeight: '600' }} type="muted" center>
                        PIN Overrride
                     </Text>
                  </TouchableOpacity>

                  <Switch
                     onValueChange={(otpPIN) => setForm({ ...form, otpPIN })}
                     value={form.otpPIN}
                  />
               </TouchableOpacity>

               <View style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: ascentColor }]}>
                     <Feather color="#fff" name="anchor" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Orders Method</Text>

                  <View style={styles.rowSpacer} />

                  <View style={{ width: '50%' }}>
                     <SegmentedControl
                        values={['Delivery Only', 'Pick Up Only', 'Botth']}
                        selectedIndex={
                           restaurant?.ordersMethod === 'both'
                              ? 2
                              : restaurant?.ordersMethod === 'pickup-only'
                                ? 1
                                : 0
                        }
                        activeFontStyle={{
                           color: ascentColor,
                           fontSize: 16,
                           fontWeight: '600'
                        }}
                        style={{ height: 48 }}
                        fontStyle={{
                           fontSize: 16
                        }}
                        onChange={(e) => {
                           updatedOrdersDeliveryMethod(e.nativeEvent.selectedSegmentIndex)
                        }}
                     />
                  </View>
               </View>
            </View>

            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Resources</Text>

               <TouchableOpacity
                  onPress={() => {
                     // handle onPress
                  }}
                  style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                     <Feather color="#fff" name="flag" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Report Bug</Text>

                  <View style={styles.rowSpacer} />

                  <Feather color="#C6C6C6" name="chevron-right" size={20} />
               </TouchableOpacity>

               <TouchableOpacity
                  onPress={() => {
                     // handle onPress
                  }}
                  style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                     <Feather color="#fff" name="mail" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Contact Us</Text>

                  <View style={styles.rowSpacer} />

                  <Feather color="#C6C6C6" name="chevron-right" size={20} />
               </TouchableOpacity>
            </View>
            <View style={styles.section}>
               <Text style={styles.sectionTitle}>Legal</Text>
               <TouchableOpacity
                  onPress={() => {
                     // handle onPress
                     router.push({
                        pathname: '/business-terms',
                        params: { returnUrl: '/(deli)/(settings)/settings' }
                     })

                     // setForm((prev) => {
                     //    return {
                     //       ...prev,
                     //       showTerms: true
                     //    }
                     // })
                  }}
                  style={[styles.row, { backgroundColor: secondaryColor }]}>
                  <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                     <Feather color="#fff" name="at-sign" size={20} />
                  </View>

                  <Text style={styles.rowLabel}>Terms of Use</Text>

                  <View style={styles.rowSpacer} />

                  <Feather color="#C6C6C6" name="chevron-right" size={20} />
               </TouchableOpacity>
            </View>
         </ScrollView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      padding: 0,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0
   },
   /** Profile */
   profile: {
      padding: SIZES.sm,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
   },
   profileAvatarWrapper: {
      position: 'relative',
      height: SIZES.height * 0.22
   },
   profileAvatar: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: SIZES.sm
   },
   profileAction: {
      position: 'absolute',
      right: 20,
      bottom: -10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 9999,
      backgroundColor: '#007bff'
   },
   profileName: {
      marginTop: 20,
      fontSize: 19,
      fontWeight: '600',
      color: '#414d63',
      textAlign: 'center'
   },
   profileAddress: {
      marginTop: 5,
      fontSize: 16,
      color: '#989898',
      textAlign: 'center'
   },
   /** Section */
   section: {
      paddingHorizontal: 24
   },
   sectionTitle: {
      paddingVertical: 12,
      fontSize: 12,
      fontWeight: '600',
      color: '#9e9e9e',
      textTransform: 'uppercase',
      letterSpacing: 1.1
   },
   /** Row */
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: 50,
      backgroundColor: '#fefefe',
      borderRadius: 8,
      marginBottom: 12,
      paddingHorizontal: 12
   },
   rowIcon: {
      width: 32,
      height: 32,
      borderRadius: 9999,
      marginRight: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
   },
   rowLabel: {
      fontSize: 17,
      fontWeight: '400'
   },
   rowSpacer: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0
   }
})
