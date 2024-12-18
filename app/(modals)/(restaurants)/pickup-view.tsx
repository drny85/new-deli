/* eslint-disable @typescript-eslint/no-require-imports */
import MapHeader from '@/components/maps/MapHeader'
import PickupRestaurantsList from '@/components/restaurants/PickupRestaurantsList'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ORDER_TYPE } from '@/shared/types'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { customMapStyleLight } from '@/utils/customMap'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FlatList } from 'react-native'
import MapView, { Marker, MarkerPressEvent, Region } from 'react-native-maps'

const CARD_HEIGHT = 220
const INSET = SIZES.width * 0.1 - 10

const DELTA = {
   longitudeDelta: 0.005,
   latitudeDelta: 0.005
}

const PickUpView = () => {
   const mapRef = useRef<MapView>(null)
   const [region, setRegion] = useState<Region>()
   const ascentColor = useThemeColor('ascent')

   const { restaurants } = useRestaurantsStore()
   const { setOrderType } = useOrderFlowStore()
   const flatListRef = useRef<FlatList>(null)

   const data = useMemo(
      () => restaurants.filter((restaurant) => restaurant.ordersMethod !== 'delivery-only'),
      [restaurants]
   )

   const onMarkerPress = (e: MarkerPressEvent) => {
      const coords = e.nativeEvent.coordinate
      if (coords && coords.latitude) {
         mapRef.current?.animateToRegion(
            {
               latitude: coords.latitude,
               longitude: coords.longitude,
               ...DELTA
            },
            600
         )
      }
   }
   const zoomIn = () => {
      if (!region) return
      const newRegion = {
         ...region,
         latitudeDelta: region.latitudeDelta / 2,
         longitudeDelta: region.longitudeDelta / 2
      }
      mapRef.current?.animateToRegion(newRegion, 600)
   }

   const zoomOut = () => {
      if (!region) return
      const newRegion = {
         ...region,
         latitudeDelta: region.latitudeDelta * 2,
         longitudeDelta: region.longitudeDelta * 2
      }
      mapRef.current?.animateToRegion(newRegion, 600)
   }

   const centerMap = useCallback(() => {
      flatListRef.current?.scrollToIndex({
         index: 0,
         animated: true,
         viewPosition: 0.5,
         viewOffset: INSET
      })
      mapRef.current?.fitToSuppliedMarkers([...restaurants.map((r) => r.id!)], {
         edgePadding: {
            right: INSET,
            left: INSET,
            top: INSET,
            bottom: INSET
         },
         animated: true
      })
   }, [])

   useEffect(() => {
      if (data.length > 0) {
         centerMap()
      }
   }, [data])

   return (
      <View style={{ flex: 1 }}>
         <MapHeader
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onCenter={centerMap}
            onPressBack={() => {
               setOrderType(ORDER_TYPE.delivery)
               router.back()
            }}
         />
         <View style={{ flex: 0.7 }}>
            {data.length > 0 && (
               <MapView
                  ref={mapRef}
                  onRegionChange={(newRegion) => {
                     setRegion(newRegion)
                  }}
                  customMapStyle={customMapStyleLight}
                  region={{ ...data[0].coords!, ...DELTA }}
                  style={{ flex: 1 }}>
                  {data.map((restaurant, index) => (
                     <Marker
                        key={index}
                        onPress={onMarkerPress}
                        coordinate={restaurant.coords!}
                        identifier={restaurant.id}
                        title={restaurant.name}
                        description={restaurant.address?.slice(0, -15)}>
                        <View
                           style={{
                              width: 60,
                              height: 60,
                              backgroundColor: 'white',
                              borderRadius: 30,
                              justifyContent: 'center',
                              alignItems: 'center',
                              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                           }}>
                           <Image
                              source={require('@/assets/images/folks.png')}
                              style={{
                                 resizeMode: 'cover',
                                 height: 50,
                                 width: 50
                              }}
                              tintColor={ascentColor}
                           />
                        </View>
                     </Marker>
                  ))}
               </MapView>
            )}
         </View>
         <View style={{ flex: 0.3, height: CARD_HEIGHT }}>
            <PickupRestaurantsList restaurants={data} listRef={flatListRef} mapRef={mapRef} />
         </View>
      </View>
   )
}

export default PickUpView
