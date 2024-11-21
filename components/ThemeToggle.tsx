import { FontAwesome } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
   Appearance,
   StyleSheet,
   View,
   TouchableWithoutFeedback,
   useColorScheme
} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
const ICON_SIZE = 70
const ThemeToggle = () => {
   const systemTheme = useColorScheme() // Get the device's theme
   const [isDarkTheme, setIsDarkTheme] = useState(systemTheme === 'dark')
   const toggleValue = useSharedValue(isDarkTheme ? 1 : 0)

   const toggleTheme = () => {
      const newTheme = !isDarkTheme
      setIsDarkTheme(newTheme)
      Appearance.setColorScheme(newTheme ? 'dark' : 'light')
      toggleValue.value = newTheme ? 1 : 0
   }

   const animatedCircleStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: withTiming(toggleValue.value * 25) }]
   }))

   const animatedBackgroundStyle = useAnimatedStyle(() => ({
      backgroundColor: toggleValue.value
         ? withTiming('#222222') // Dark theme background
         : withTiming('#f5f5f5') // Light theme background
   }))

   return (
      <TouchableWithoutFeedback onPress={toggleTheme}>
         <Animated.View style={[styles.toggleContainer, animatedBackgroundStyle]}>
            <FontAwesome
               name="sun-o"
               size={ICON_SIZE / 2.8}
               color={isDarkTheme ? '#888' : '#FFC107'}
               style={styles.icon}
            />

            <Animated.View style={[styles.circle, animatedCircleStyle]} />
            <FontAwesome
               name="moon-o"
               size={ICON_SIZE / 2.8}
               color={isDarkTheme ? '#FFC107' : '#888'}
               style={styles.icon}
            />
         </Animated.View>
      </TouchableWithoutFeedback>
   )
}

const styles = StyleSheet.create({
   toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: ICON_SIZE * 1.3,
      height: ICON_SIZE / 2,
      borderRadius: ICON_SIZE / 3,
      padding: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2
   },
   circle: {
      width: ICON_SIZE / 2,
      height: ICON_SIZE / 2,
      borderRadius: ICON_SIZE / 2 / 2,
      backgroundColor: '#f5f5f5',
      position: 'absolute',
      left: ICON_SIZE / 2 - 4
   },
   icon: {
      zIndex: 1
   }
})

export default ThemeToggle
