import { SIZES } from '@/constants/Colors'
import { customMapStyle } from '@/helpers/customMapStyle'
import { RestaurantMapInfo } from '@/shared/types'
import { useRef, useEffect } from 'react'
import { View, StyleSheet, Animated, Dimensions, ViewStyle } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const { height } = Dimensions.get('window')

interface AnimatedMarkerProps {
   restaurant: RestaurantMapInfo
   containerStyle?: ViewStyle
}

const AnimatedRestaurantMap: React.FC<AnimatedMarkerProps> = ({ restaurant, containerStyle }) => {
   const slideAnim = useRef(new Animated.Value(-height * 0.2)).current // Initial position is off-screen

   useEffect(() => {
      Animated.timing(slideAnim, {
         toValue: 0,
         duration: 800,
         useNativeDriver: true
      }).start()
   }, [slideAnim])

   return (
      <View style={styles.container}>
         <MapView
            style={[styles.map, containerStyle]}
            showsBuildings={false}
            camera={{
               center: {
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude
               },
               pitch: 20,
               heading: 80,
               altitude: 180,
               zoom: 80
            }}
            customMapStyle={customMapStyle}
            // mapType="mutedStandard"
            initialRegion={{
               latitude: restaurant.latitude,
               longitude: restaurant.longitude,
               latitudeDelta: 0.002, // Smaller value for closer zoom
               longitudeDelta: 0.002 // Smaller value for closer zoom
            }}>
            <Marker
               coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude
               }}
               title={restaurant.name}
               description={restaurant.description}
            />
         </MapView>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      borderRadius: SIZES.md,
      marginBottom: SIZES.md
   },
   map: {
      height: height * 0.2,
      borderRadius: SIZES.md
   }
})

export default AnimatedRestaurantMap
