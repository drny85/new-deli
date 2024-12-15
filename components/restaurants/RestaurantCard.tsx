/* eslint-disable @typescript-eslint/no-require-imports */
import { SIZES } from '@/constants/Colors'
import { CardData } from '@/shared/types'
import { Image } from 'expo-image'
import { StyleSheet, TouchableOpacity, useColorScheme, ViewStyle } from 'react-native'
import NeoView from '../NeoView'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import { FontAwesome } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { toggleFavorite } from '@/actions'
import { useUser } from '@/hooks/auth/useUser'
import { BlurView } from 'expo-blur'

type Props = {
   item: CardData
   onPress: () => void
   contentContainerStyle?: ViewStyle
}

const RestaurantCard = ({ item, onPress, contentContainerStyle }: Props) => {
   const bg = useThemeColor('background')
   const isDark = useColorScheme() === 'dark'
   useUser()
   const { user } = useAuth()
   const isFavorite = user?.favoritesStores.includes(item.id!)

   return (
      <NeoView
         innerStyleContainer={{ borderRadius: SIZES.md }}
         containerStyle={[
            {
               borderRadius: SIZES.md,
               shadowColor: isDark ? undefined : bg
            },
            contentContainerStyle
         ]}>
         {user && (
            <TouchableOpacity
               onPress={() => toggleFavorite(item.id!, user)}
               style={{
                  position: 'absolute',
                  right: 10,
                  top: 10,
                  zIndex: 30
               }}>
               <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={28} color={'#c1121f'} />
            </TouchableOpacity>
         )}
         {!item.isOpen && (
            <NeoView
               innerStyleContainer={{
                  borderRadius: SIZES.lg,
                  alignSelf: 'center',
                  paddingVertical: 4
               }}
               containerStyle={{
                  position: 'absolute',
                  top: 20,
                  width: 120,
                  borderRadius: SIZES.lg,
                  alignSelf: 'center',
                  zIndex: 30
               }}>
               <Text fontSize="large" style={{ color: 'red' }} type="defaultSemiBold" center>
                  Closed
               </Text>
            </NeoView>
         )}
         <TouchableOpacity disabled={!item.isOpen} onPress={onPress} style={styles.card}>
            <View style={[{ borderRadius: SIZES.md, height: '100%' }]}>
               <Image
                  style={styles.image}
                  source={item.image}
                  contentFit="cover"
                  transition={300}
               />
               <BlurView
                  style={[styles.overlay]}
                  intensity={20}
                  tint="systemThickMaterialDark"
                  experimentalBlurMethod="dimezisBlurView">
                  <Row align="between">
                     <Text textColor="white" type="header">
                        {item.name}
                     </Text>
                     {item.distance !== null && item.distance !== undefined && (
                        <Text fontSize="small" textColor="white" type="defaultSemiBold">
                           {item.distance.toFixed(2)} miles
                        </Text>
                     )}
                  </Row>
                  <Text textColor="white" allowFontScaling>
                     {item.address?.slice(0, -15)}
                  </Text>
                  <Row align="between">
                     <Text fontSize={'small'} type="defaultSemiBold" textColor="white">
                        {item.minimumDelivery && item.minimumDelivery > 0
                           ? `${item.minimumDelivery} Minimun Delivery`
                           : item.ordersMethod !== 'pickup-only'
                             ? 'Free Delivery'
                             : 'Pickup Only'}
                     </Text>
                     <Row>
                        {item.ordersMethod === 'both' && (
                           <>
                              <Image
                                 tintColor={'#ffffff'}
                                 source={require('@/assets/images/walking.png')}
                                 style={{ width: 15, height: 15 }}
                              />
                              <Image
                                 tintColor={'#ffffff'}
                                 source={require('@/assets/images/delivery.png')}
                                 style={{ width: 20, height: 20 }}
                              />
                           </>
                        )}
                        {item.ordersMethod === 'pickup-only' && (
                           <Image
                              tintColor={'#ffffff'}
                              source={require('@/assets/images/walking.png')}
                              style={{ width: 15, height: 15 }}
                           />
                        )}
                        {item.ordersMethod === 'delivery-only' && (
                           <Image
                              tintColor={'#ffffff'}
                              source={require('@/assets/images/delivery.png')}
                              style={{ width: 20, height: 20 }}
                           />
                        )}
                     </Row>
                     <View>
                        <Text fontSize="small" textColor="white" type="defaultSemiBold">
                           ETA {item.eta}-{item.eta && item.eta + 5} mins
                        </Text>
                     </View>
                  </Row>
               </BlurView>
            </View>
         </TouchableOpacity>
      </NeoView>
   )
}

export default RestaurantCard

const styles = StyleSheet.create({
   card: {
      borderRadius: SIZES.md,
      height: SIZES.height * 0.22
   },
   overlay: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      width: '100%',
      position: 'absolute',
      borderBottomLeftRadius: SIZES.md,
      borderBottomRightRadius: SIZES.md,
      paddingHorizontal: SIZES.sm,
      paddingBottom: SIZES.sm * 0.5,
      bottom: 0,
      overflow: 'hidden'
   },

   image: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      borderRadius: SIZES.md
   }
})
