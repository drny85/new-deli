import { SIZES } from '@/constants/Colors'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Business } from '@/typing'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Animated, ListRenderItem, Platform, View } from 'react-native'
import MapView from 'react-native-maps'
import Button from '../Button'
import NeoView from '../NeoView'
import RestaurantCard from './RestaurantCard'
import { useThemeColor } from '@/hooks/useThemeColor'

const CARD_HEIGHT = 220
const CARD_WIDTH = SIZES.width * 0.8
const INSET = SIZES.width * 0.1 - 10
let TIME_OUT: NodeJS.Timeout
const DELTA = {
   longitudeDelta: 0.005,
   latitudeDelta: 0.005
}

type Props = {
   listRef: React.RefObject<Animated.FlatList<any>>
   restaurants: Business[]
   mapRef: React.RefObject<MapView>
}
const PickupRestaurantsList = ({ listRef, mapRef, restaurants }: Props) => {
   let animatedX = new Animated.Value(0)
   const backgroundColor = useThemeColor('background')
   const { setRestaurant } = useRestaurantsStore()
   const [index, setIndex] = useState<number>(0)
   let mapIndex = 0

   const renderBusinesses: ListRenderItem<Business> = useCallback(({ index, item }) => {
      return (
         <View style={{ borderRadius: SIZES.lg * 1.5 }}>
            <NeoView
               containerStyle={{ width: CARD_WIDTH, borderRadius: SIZES.lg * 1.5 }}
               innerStyleContainer={{ borderRadius: SIZES.lg * 1.5 }}>
               <RestaurantCard
                  item={item}
                  onPress={() => {
                     setIndex(index)
                     mapRef.current?.animateToRegion({ ...item.coords!, ...DELTA }, 600)
                  }}
               />
            </NeoView>
            <View style={{ position: 'absolute', top: 30, zIndex: 20, alignSelf: 'center' }}>
               <Button
                  title="Order Now"
                  type="secondary"
                  onPress={() => {
                     setRestaurant(item)
                     router.push({
                        pathname: '/restaurant',
                        params: { restaurantId: item.id }
                     })
                  }}
                  containerStyle={{
                     shadowRadius: 0,
                     borderRadius: SIZES.lg * 2,
                     backgroundColor: 'transparent'
                  }}
                  contentTextStyle={{ fontSize: 18, paddingHorizontal: SIZES.lg * 1.5 }}
               />
            </View>
         </View>
      )
   }, [])

   useEffect(() => {
      listRef.current?.scrollToIndex({
         index,
         animated: true,
         viewOffset: index === 0 ? 20 : 10,
         viewPosition: 0.5
      })

      // mapRef.current?.animateToRegion();
   }, [index])

   useEffect(() => {
      const sub = animatedX.addListener(({ value }) => {
         let i = Math.floor(value / CARD_WIDTH + 0.3)

         if (i > restaurants.length) {
            i = restaurants.length - 1
         }
         if (i < 0) {
            i = 0
         }
         clearTimeout(TIME_OUT)

         TIME_OUT = setTimeout(() => {
            if (mapIndex !== i) {
               mapIndex = i
               const { coords } = restaurants[i]
               mapRef.current?.animateToRegion(
                  {
                     latitude: coords?.latitude!,
                     longitude: coords?.longitude!,
                     ...DELTA
                  },
                  350
               )
            }
         }, 350)
      })

      return () => {
         animatedX.removeListener(sub)
      }
   })
   if (restaurants.length === 0) return null

   return (
      <Animated.FlatList
         ref={listRef}
         data={[...restaurants]}
         contentContainerStyle={{
            paddingRight: Platform.OS === 'android' ? INSET : 0,
            gap: SIZES.md,
            height: CARD_HEIGHT,
            backgroundColor
         }}
         pagingEnabled
         contentInset={{
            left: INSET,
            right: INSET,
            top: 0,
            bottom: 0
         }}
         onScroll={Animated.event(
            [
               {
                  nativeEvent: {
                     contentOffset: { x: animatedX }
                  }
               }
            ],
            { useNativeDriver: true }
         )}
         snapToAlignment={'center'}
         snapToInterval={CARD_WIDTH + 20}
         initialScrollIndex={0}
         showsHorizontalScrollIndicator={false}
         horizontal
         //style={styles.scrollView}
         keyExtractor={(item, index) => index.toString() + item.id}
         renderItem={renderBusinesses}
      />
   )
}

export default PickupRestaurantsList
