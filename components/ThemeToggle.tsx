import { useThemeColor } from '@/hooks/useThemeColor'
import { MotiView, useAnimationState } from 'moti'
import React from 'react'
import { Appearance, Image, TouchableOpacity, useColorScheme } from 'react-native'

const containerWidth = 60
const containerHeight = 26
const innerWidth = 28
const ThemeToogle = () => {
   const bgColor = useThemeColor('primary')
   const dark = useColorScheme() === 'dark'
   const animateState = useAnimationState({
      from: {
         translateX: containerWidth - innerWidth
      },
      to: {
         translateX: 0
      }
   })
   console.log(animateState.current)
   return (
      <TouchableOpacity
         onPress={() =>
            animateState.transitionTo((state) => {
               console.log(state)
               if (state === 'from') {
                  Appearance.setColorScheme('light')

                  return 'from'
               } else {
                  Appearance.setColorScheme('dark')

                  return 'to'
               }
            })
         }>
         <MotiView
            style={{
               width: containerWidth,
               height: containerHeight,
               borderRadius: 50,
               alignItems: 'center',
               backgroundColor: bgColor,
               flexDirection: 'row'
            }}>
            <MotiView
               transition={{ duration: 400 }}
               state={animateState}
               style={{
                  width: innerWidth * 1.2,
                  height: innerWidth * 1.2,
                  borderRadius: (innerWidth * 1.2) / 2,
                  backgroundColor: bgColor
               }}>
               <Image
                  style={{
                     width: innerWidth * 1.2,
                     height: innerWidth * 1.2,
                     borderRadius: (innerWidth * 1.2) / 2,
                     tintColor: dark ? '#ffffff' : undefined
                  }}
                  resizeMode="contain"
                  source={
                     dark
                        ? require('../assets/images/dark_icon.png')
                        : require('../assets/images/light_icon.png')
                  }
               />
            </MotiView>
         </MotiView>
      </TouchableOpacity>
   )
}

export default ThemeToogle
