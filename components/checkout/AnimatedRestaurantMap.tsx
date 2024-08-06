import { SIZES } from '@/constants/Colors'
import { customMapStyle } from '@/helpers/customMapStyle'
import { RestaurantMapInfo } from '@/typing'
import { useRef, useEffect } from 'react'
import { View, StyleSheet, Animated, Dimensions } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const { height } = Dimensions.get('window')

interface AnimatedMarkerProps {
   restaurant: RestaurantMapInfo
}

const AnimatedRestaurantMap: React.FC<AnimatedMarkerProps> = ({ restaurant }) => {
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
            style={styles.map}
            showsBuildings={false}
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
