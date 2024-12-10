import { formatPhone } from '@/utils/formatPhone'
import { Feather, FontAwesome, FontAwesome6, SimpleLineIcons } from '@expo/vector-icons'
import Constants from 'expo-constants'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
   Alert,
   Button,
   Dimensions,
   Keyboard,
   SafeAreaView,
   StyleSheet,
   Switch,
   TouchableOpacity
} from 'react-native'

import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'

import { useNotifications } from '../hooks/useNotification'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const IMAGE_HEIGHT = 100
const IMAGE_SIZE = IMAGE_HEIGHT

import Animated, {
   interpolate,
   useAnimatedScrollHandler,
   useAnimatedStyle,
   useSharedValue
} from 'react-native-reanimated'

import { updateUser } from '@/actions/auth'
import { SIZES } from '@/constants/Colors'
import { usePhoto } from '@/hooks/usePhoto'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import Row from './Row'
import { Text } from './ThemedText'
import { View } from './ThemedView'
import ThemeToogle from './ThemeToggle'
import NeumorphismView from './NeumorphismView'

export default function ModernSettingsPage() {
   const { user, logOut } = useAuth()
   const { registerForPushNotificationsAsync } = useNotifications()
   const { photo, selectedImage, handleImageUpload, resetAll, uploadPhoto } = usePhoto()
   const deleteColor = useThemeColor('error')
   const bgColor = useThemeColor('background')
   const secondaryColor = useThemeColor('primary')
   const [showEditModal, setShowEditModal] = useState(false)

   const bottomSheetRef = useRef<BottomSheet>(null)
   const snapoints = useMemo(() => ['1%', '50%', '70%'], [])
   const [name, setName] = useState('')
   const [phone, setPhone] = useState('')
   const scrollY = useSharedValue(0)

   const scrollHandler = useAnimatedScrollHandler((event) => {
      scrollY.value = event.contentOffset.y
   })

   const animatedImageStyle = useAnimatedStyle(() => {
      const translateY = interpolate(scrollY.value, [0, IMAGE_SIZE], [0, -IMAGE_SIZE / 2], 'clamp')

      const translateX = interpolate(
         scrollY.value,
         [0, IMAGE_SIZE],
         [0, -SCREEN_WIDTH / 2 + IMAGE_SIZE / 2],
         'clamp'
      )

      const scale = interpolate(scrollY.value, [0, IMAGE_SIZE], [1, 0.5], 'clamp')

      return {
         transform: [{ translateY }, { translateX }, { scale }]
      }
   })

   const animatedHeigth = useAnimatedStyle(() => {
      const height = interpolate(scrollY.value, [0, IMAGE_HEIGHT], [IMAGE_HEIGHT, 0], 'clamp')

      return {
         height
      }
   })

   const animatedInfoStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
         scrollY.value,
         [0, IMAGE_HEIGHT / 2, IMAGE_HEIGHT],
         [1, 0, 0],
         'clamp'
      )

      return {
         opacity
      }
   })

   const renderBackdrop = useCallback(
      (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
      []
   )

   const handleSignOut = () => {
      Alert.alert('Signing Out', 'Are you sure you want to sign out?', [
         {
            text: 'Yes',
            style: 'destructive',
            onPress: logOut
         },
         { text: 'Cancel', style: 'cancel' }
      ])
   }

   const deleteAccount = async () => {
      try {
         // const func = deleteUserAccount('deleleAccount')
         // await func({ uid: user?.id! })
         // logOut()
         // router.replace('/(app)/auth')
         router.push('/_sitemap')
      } catch (error) {
         console.log(error)
      }
   }

   const handleDeleteAccount = async () => {
      try {
         Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
            {
               text: 'Yes',
               onPress: deleteAccount
            },
            { text: 'Cancel', style: 'cancel' }
         ])
      } catch (error) {
         console.log(error)
      }
   }

   const resetForm = () => {
      Keyboard.dismiss()
      setName('')
      setPhone('')
      bottomSheetRef.current?.close()
      setShowEditModal(false)
   }

   const handlePushNotificationChange = (value: boolean) => {
      if (!user) return
      if (value) {
         Alert.alert(
            'Enable Push Notifications',
            'Are you sure you want to enable push notifications?',
            [
               {
                  text: 'Yes',
                  onPress: () => {
                     registerForPushNotificationsAsync()
                  }
               },
               { text: 'Cancel', style: 'cancel' }
            ]
         )
      } else {
         Alert.alert(
            'Disable Push Notifications',
            'Are you sure you want to disable push notifications?',
            [
               {
                  text: 'Yes',
                  onPress: () => {
                     // unregisterForPushNotificationsAsync()
                  }
               },
               { text: 'Cancel', style: 'cancel' }
            ]
         )
      }
   }

   useEffect(() => {
      if (user) {
         setName(user.name)
         setPhone(formatPhone(user.phone!))
      }
   }, [user])

   useEffect(() => {
      if (!photo || !user) return
      if (selectedImage) {
         console.log('Updating user image')
         updateUser({ ...user, image: selectedImage })
         resetAll()
      }

      if (photo && photo?.assets![0].uri && !selectedImage) {
         console.log('Uploading photo')
         uploadPhoto(photo, user?.id!)
      }
   }, [photo, selectedImage])

   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
         <TouchableOpacity style={styles.logout} onPress={handleSignOut}>
            <Text>Log Out</Text>
         </TouchableOpacity>
         <View style={[styles.container, { backgroundColor: bgColor }]}>
            <Animated.View style={[styles.profile, { backgroundColor: bgColor }]}>
               <TouchableOpacity style={{ position: 'relative' }} onPress={handleImageUpload}>
                  <Animated.View style={[styles.profileAvatarWrapper, animatedHeigth]}>
                     <Animated.Image
                        alt=""
                        source={{
                           uri: user?.image
                              ? user.image
                              : photo?.assets![0].uri
                                ? photo.assets[0].uri
                                : 'https://picsum.photos/160/160?random=1&blur=2'
                        }}
                        style={[styles.image, animatedImageStyle]}
                        resizeMode="cover"
                     />
                     <Animated.View style={[styles.profileAction, animatedInfoStyle]}>
                        <TouchableOpacity
                           onPress={() => {
                              setShowEditModal(true)
                              bottomSheetRef.current?.snapToIndex(1)
                           }}>
                           <Feather color="#fff" name="edit-3" size={15} />
                        </TouchableOpacity>
                     </Animated.View>
                  </Animated.View>
               </TouchableOpacity>

               <Animated.View style={[styles.infoContainer, animatedInfoStyle]}>
                  <Text style={styles.profileName}>
                     {user?.name} {user?.lastName}
                  </Text>

                  <Text style={styles.profileAddress}>{user?.phone}</Text>
                  <Text style={styles.profileAddress}>{user?.email}</Text>
               </Animated.View>
            </Animated.View>

            <Animated.ScrollView
               contentContainerStyle={styles.scrollViewContent}
               onScroll={scrollHandler}
               scrollEventThrottle={16}
               showsVerticalScrollIndicator={false}>
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Preferences</Text>
                  <NeumorphismView style={[styles.row]}>
                     <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                        <Feather color="#fff" name="moon" size={20} />
                     </View>

                     <Text style={styles.rowLabel}>Theme</Text>

                     <View style={styles.rowSpacer} />

                     <ThemeToogle />
                  </NeumorphismView>

                  <TouchableOpacity
                     onPress={() => {
                        // handle onPress
                        router.push('/address')
                     }}>
                     <NeumorphismView style={[styles.row]}>
                        <View style={[styles.rowIcon, { backgroundColor: 'green' }]}>
                           <SimpleLineIcons name="map" size={20} color="#ffffff" />
                        </View>

                        <Text style={styles.rowLabel}>Saved Addresses</Text>

                        <View style={styles.rowSpacer} />

                        <Feather color="#C6C6C6" name="chevron-right" size={20} />
                     </NeumorphismView>
                  </TouchableOpacity>
                  {user?.image && (
                     <NeumorphismView style={[styles.row]}>
                        <View style={[styles.rowIcon, { backgroundColor: 'orange' }]}>
                           <Feather color="#fff" name="camera-off" size={20} />
                        </View>

                        <Text style={styles.rowLabel}>Share My Picture</Text>

                        <View style={styles.rowSpacer} />

                        <Switch
                           onValueChange={(sharePicture) => {
                              if (!user) return
                              updateUser({ ...user, sharePicture })
                           }}
                           value={user?.sharePicture}
                        />
                     </NeumorphismView>
                  )}

                  <NeumorphismView style={[styles.row]}>
                     <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
                        <Feather color="#fff" name="bell" size={20} />
                     </View>

                     <Text style={styles.rowLabel}>Push Notifications</Text>

                     <View style={styles.rowSpacer} />

                     <Switch
                        onValueChange={(pushNotifications) =>
                           handlePushNotificationChange(pushNotifications)
                        }
                        value={user?.pushToken !== null}
                     />
                  </NeumorphismView>
               </View>

               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Resources</Text>

                  <TouchableOpacity
                     onPress={() => {
                        // handle onPress
                        Alert.alert('Upcoming feature')
                     }}>
                     <NeumorphismView style={[styles.row]}>
                        <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                           <Feather color="#fff" name="flag" size={20} />
                        </View>

                        <Text style={styles.rowLabel}>Report Bug</Text>

                        <View style={styles.rowSpacer} />

                        <Feather color="#C6C6C6" name="chevron-right" size={20} />
                     </NeumorphismView>
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={() => {
                        // handle onPress
                        Alert.alert('Upcoming feature')
                     }}>
                     <NeumorphismView style={[styles.row]}>
                        <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                           <Feather color="#fff" name="mail" size={20} />
                        </View>

                        <Text style={styles.rowLabel}>Contact Us</Text>

                        <View style={styles.rowSpacer} />

                        <Feather color="#C6C6C6" name="chevron-right" size={20} />
                     </NeumorphismView>
                  </TouchableOpacity>
               </View>
               <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Privacy</Text>
                  <TouchableOpacity
                     onPress={() => {
                        // handle onPress
                        router.push('/terms')
                     }}>
                     <NeumorphismView style={[styles.row]}>
                        <View style={[styles.rowIcon, { backgroundColor: 'royalblue' }]}>
                           <FontAwesome6 name="file-contract" size={24} color="#ffffff" />
                        </View>

                        <Text style={styles.rowLabel}>Terms of Use</Text>

                        <View style={styles.rowSpacer} />

                        <Feather color="#C6C6C6" name="chevron-right" size={20} />
                     </NeumorphismView>
                  </TouchableOpacity>
                  <TouchableOpacity
                     onPress={() => {
                        // handle onPress
                        router.push('/privacy')
                     }}>
                     <NeumorphismView style={[styles.row]}>
                        <View style={[styles.rowIcon, { backgroundColor: 'red' }]}>
                           <Feather color="#fff" name="user-x" size={20} />
                        </View>

                        <Text style={styles.rowLabel}>Privacy Policy</Text>

                        <View style={styles.rowSpacer} />

                        <Feather color="#C6C6C6" name="chevron-right" size={20} />
                     </NeumorphismView>
                  </TouchableOpacity>
                  <NeumorphismView
                     style={[
                        styles.row,
                        {
                           marginBottom: 80
                        }
                     ]}>
                     <View style={[styles.rowIcon, { backgroundColor: 'red' }]}>
                        <Feather color="#fff" name="x" size={20} />
                     </View>

                     <Text style={styles.rowLabel}>Delete Account</Text>

                     <View style={styles.rowSpacer} />

                     <TouchableOpacity onPress={handleDeleteAccount} style={{ padding: SIZES.sm }}>
                        <FontAwesome name="trash-o" size={20} color={deleteColor} />
                     </TouchableOpacity>
                  </NeumorphismView>
               </View>
               <Text style={{ marginLeft: SIZES.lg }} type="muted">
                  version: {Constants.expoConfig?.version}
               </Text>
            </Animated.ScrollView>
         </View>

         {showEditModal && (
            <BottomSheet
               index={-1}
               onClose={resetForm}
               keyboardBehavior="interactive"
               snapPoints={snapoints}
               topInset={SIZES.statusBarHeight + SIZES.md + 80}
               ref={bottomSheetRef}
               backdropComponent={renderBackdrop}
               style={{ flex: 1 }}
               backgroundStyle={{
                  backgroundColor: bgColor
               }}
               overDragResistanceFactor={5}
               handleIndicatorStyle={{ backgroundColor: 'gray' }}
               handleStyle={{ backgroundColor: bgColor }}>
               <View
                  style={{
                     padding: SIZES.md,
                     flex: 1,
                     backgroundColor: 'red '
                  }}>
                  <View>
                     <Text type="defaultSemiBold">Full Name</Text>
                     <BottomSheetTextInput
                        style={{
                           marginTop: 10,
                           marginBottom: 10,
                           borderRadius: 10,
                           fontSize: 16,
                           lineHeight: 20,
                           padding: SIZES.sm,
                           backgroundColor: 'rgba(151, 151, 151, 0.25)'
                        }}
                        defaultValue={user?.name}
                        placeholder="Joe Smith"
                        autoCapitalize="words"
                        value={name}
                        autoFocus
                        onChangeText={(text) => {
                           setName(text)
                        }}
                     />
                  </View>
                  <View>
                     <Text type="defaultSemiBold">Phone</Text>
                     <BottomSheetTextInput
                        style={{
                           marginTop: 10,
                           marginBottom: 30,
                           borderRadius: 10,
                           fontSize: 16,
                           lineHeight: 20,
                           padding: SIZES.sm,
                           backgroundColor: 'rgba(151, 151, 151, 0.25)'
                        }}
                        defaultValue={user?.phone!}
                        placeholder="Cell Phone Number"
                        value={phone}
                        keyboardType="numeric"
                        onChangeText={(text) => {
                           setPhone(formatPhone(text))
                        }}
                     />
                     <Row
                        containerStyle={{
                           alignSelf: 'center',
                           gap: SIZES.sm * 2,
                           height: 60
                        }}>
                        <Button title="Cancel" color={'orange'} onPress={resetForm} />
                        <Button
                           title="Update"
                           disabled={!name || !phone}
                           onPress={() => {
                              if (!name) {
                                 Alert.alert('Invalid name', 'You must write your full name')
                                 return
                              }
                              if (phone.length !== 14) {
                                 Alert.alert('Invalid phone number')
                                 return
                              }

                              Alert.alert(
                                 'Name and Phone Updates',
                                 'Are you sure that you want to update this info',
                                 [
                                    { text: 'Cancel' },
                                    {
                                       text: 'Yes, I am sure',
                                       onPress: async () => {
                                          try {
                                             if (!user) return

                                             resetForm()
                                          } catch (error) {
                                             console.log('Error updating info')
                                          }
                                       }
                                    }
                                 ]
                              )
                           }}
                        />
                     </Row>
                  </View>
               </View>
            </BottomSheet>
         )}
      </SafeAreaView>
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
      padding: 16,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
   },
   profileAvatarWrapper: {
      position: 'relative'
   },
   profileAvatar: {
      width: 96,
      height: 96,
      borderRadius: 9999
   },
   profileAction: {
      position: 'absolute',
      top: IMAGE_HEIGHT - 28,
      right: -IMAGE_HEIGHT / 2,
      zIndex: 999,
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: '#007bff',
      padding: 6
   },
   profileName: {
      marginTop: 12,
      fontSize: 19,
      fontWeight: '600',
      textAlign: 'center'
   },
   scrollViewContent: {
      paddingTop: IMAGE_HEIGHT / 2,
      marginTop: IMAGE_HEIGHT / 2,
      marginBottom: 20
   },
   profileAddress: {
      fontSize: 16,
      color: '#989898',
      textAlign: 'center'
   },
   logout: {
      position: 'absolute',
      right: 20,
      top: SIZES.statusBarHeight,
      zIndex: 100
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
   image: {
      width: IMAGE_HEIGHT,
      height: IMAGE_HEIGHT,
      borderRadius: IMAGE_HEIGHT / 2,
      position: 'absolute',
      zIndex: 998,

      alignSelf: 'center'
   },
   infoContainer: {
      position: 'absolute',
      top: IMAGE_HEIGHT,
      marginVertical: 10,
      zIndex: 997,
      left: 0,
      right: 0,
      alignItems: 'center'
   },
   rowSpacer: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0
   }
})
