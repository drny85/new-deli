/* eslint-disable @typescript-eslint/no-require-imports */
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useFeaturesStore } from '@/stores/featuresStore'
import { Audio } from 'expo-av'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Text } from './ThemedText'

const PopopOver = () => {
   const opacity = useSharedValue(0)
   const [sound, setSound] = useState<Audio.Sound | null>(null)
   const backgroundColor = useThemeColor('background')
   const { showNewOrderPopup, setShowNewOrderPopup, popupParams, setPopupParams } =
      useFeaturesStore()
   const translateY = useSharedValue(-100)
   const animatedStyle = useAnimatedStyle(() => {
      return {
         opacity: opacity.value,
         transform: [{ translateY: translateY.value }]
      }
   })

   const playSound = async () => {
      try {
         const { sound: soundObject } = await Audio.Sound.createAsync(
            require('@/assets/audio/new_order.wav')
         )
         setSound(soundObject)
         console.log('Sound Loaded')
      } catch (error) {
         console.log('Error playing songs', error)
      }
   }

   useEffect(() => {
      if (!showNewOrderPopup) return
      playSound()
      opacity.value = withTiming(1, { duration: 500 })
      translateY.value = withTiming(0, { duration: 500 })
      const timeOut = setTimeout(() => {
         opacity.value = withTiming(0, { duration: 500 })
         translateY.value = withTiming(-100, { duration: 500 })
         setShowNewOrderPopup(false)
         setPopupParams(null)
      }, 4000)
      return () => {
         //setSound(null)

         clearTimeout(timeOut)
      }
   }, [showNewOrderPopup])

   useEffect(() => {
      if (!sound) return
      sound
         .playAsync()
         .then((res) => {
            if (res.isLoaded && res.didJustFinish) {
               console.log('Playing', res.isLoaded)
               sound?.unloadAsync()
               setSound(null)
            }
         })
         .catch((error) => {
            console.log('Error playing songs', error)
         })

      return () => {}
   }, [sound])

   if (!showNewOrderPopup || !popupParams) return null
   return (
      <Animated.View style={[styles.container, { backgroundColor }, animatedStyle]}>
         <Text type="defaultSemiBold">{popupParams?.title}</Text>
         <Text type="muted">{popupParams?.description}</Text>
      </Animated.View>
   )
}

export default PopopOver

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      zIndex: 600,
      gap: SIZES.sm,
      paddingVertical: SIZES.sm / 2,
      paddingHorizontal: SIZES.lg,
      top: SIZES.statusBarHeight + 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: SIZES.lg * 2,
      alignSelf: 'center'
   }
})
