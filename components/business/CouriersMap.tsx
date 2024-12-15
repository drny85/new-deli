import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, FlatList, StyleSheet, View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

import { SIZES } from '@/constants/Colors'
import { useCouriers } from '@/hooks/couriers/useCouriers'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Courier } from '@/shared/types'
import { getDistanceFromLatLonInMeters } from '@/utils/getDistanceInMeters'
import { Image } from 'expo-image'
import * as Location from 'expo-location'
import { Container } from '../Container'
import CustomCard from '../CustomCard'
import Loading from '../Loading'

type Props = {
   onPress: (courier: Courier) => void
   assigedCourier: Courier | null
}

const CourierMap: React.FC<Props> = ({ onPress, assigedCourier }) => {
   const [region, setRegion] = useState({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
   })
   const { loading, couriers } = useCouriers()
   const restaurant = useRestaurantsStore((s) => s.restaurant)
   const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null)
   const data = useMemo(() => {
      if (!couriers || !restaurant?.coords) return []

      return couriers
         .filter((c) => c.coords) // Ensure couriers have coordinates
         .map((c) => ({
            ...c,
            distance: getDistanceFromLatLonInMeters(c.coords!, restaurant?.coords)
         }))
         .sort((a, b) => a.distance - b.distance) // Simplify sort logic
   }, [couriers, restaurant?.coords])

   const mapViewRef = useRef<MapView>(null)
   const animation = useRef(new Animated.Value(0)).current
   const CARD_WIDTH = Dimensions.get('window').width * 0.8

   const onCardPress = (courier: Courier) => {
      if (!courier || !selectedCourier?.coords) return
      setSelectedCourier(courier)
      mapViewRef.current?.animateToRegion({
         latitude: selectedCourier.coords?.latitude,
         longitude: selectedCourier.coords?.longitude,
         latitudeDelta: 0.0922,
         longitudeDelta: 0.0421
      })
      const index = couriers.findIndex((c) => c.id === courier.id)
      animation.setValue(index)
   }

   const onMarkerPress = (courier: Courier) => {
      if (!courier) return
      setSelectedCourier(courier)
      const index = couriers.findIndex((c) => c.id === courier.id)
      animation.setValue(index)
   }

   useEffect(() => {
      const init = async () => {
         const { status } = await Location.requestForegroundPermissionsAsync()
         if (status !== 'granted') {
            return
         }
         const location = await Location.getCurrentPositionAsync({})
         setRegion({
            ...region,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
         })
      }

      init()
   }, [])

   useEffect(() => {
      if (couriers.length > 0) {
         mapViewRef.current?.fitToSuppliedMarkers([...couriers.map((c) => c.id!)], {
            edgePadding: { top: 100, right: 100, bottom: 50, left: 50 }
         })
      }
   }, [couriers.length])

   if (loading) return <Loading />

   return (
      <Container>
         <View style={styles.cardContainer}>
            <FlatList
               data={data}
               keyExtractor={(item) => item.id!}
               horizontal
               snapToInterval={CARD_WIDTH}
               contentContainerStyle={{ gap: SIZES.md }}
               renderItem={({ item }) => (
                  <CustomCard
                     assigned={assigedCourier!}
                     courier={item}
                     onPress={() => onCardPress(item)}
                     onCourierPress={() => onPress(item)}
                  />
               )}
            />
         </View>
         <View style={{ flex: 1 }}>
            <MapView
               ref={mapViewRef}
               style={styles.map}
               region={region}
               showsTraffic={false}
               showsUserLocation={true}
               showsBuildings={false}
               onRegionChangeComplete={setRegion}>
               {couriers.map((courier) => (
                  <Marker
                     identifier={courier.id}
                     key={courier.id}
                     title={courier.name}
                     coordinate={{
                        latitude: courier.coords?.latitude || 0,
                        longitude: courier.coords?.longitude || 0
                     }}
                     onPress={() => onMarkerPress(courier)}>
                     <View style={styles.marker}>
                        <Image source={{ uri: courier.image }} style={styles.markerImage} />
                     </View>
                  </Marker>
               ))}
            </MapView>
         </View>
      </Container>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   },
   map: {
      flex: 1
   },
   marker: {
      alignItems: 'center'
   },
   markerImage: {
      width: 50,
      height: 50,
      borderRadius: 25
   },
   cardContainer: {
      width: '100%',
      margin: SIZES.md,
      justifyContent: 'center',
      alignItems: 'center'
      //height: SIZES.height * 0.2
   }
})

export default CourierMap
