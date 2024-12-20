import { Platform, TouchableOpacity, useColorScheme, View, ViewStyle } from 'react-native'
import React from 'react'
import NeoView from './NeoView'
import { router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useThemeColor } from '@/hooks/useThemeColor'
import { SIZES } from '@/constants/Colors'

type Props = {
   onPress?: () => void
   containerStyle?: ViewStyle
}
const BackButton = ({ onPress, containerStyle }: Props) => {
   const { top } = useSafeAreaInsets()
   const ascent = useThemeColor('ascent')
   const isDark = useColorScheme() === 'dark'
   return (
      <View
         style={[
            {
               position: 'absolute',
               left: 20,
               top: Platform.select({
                  ios: top,
                  android: top + SIZES.md
               }),
               zIndex: 10,
               marginTop: -6
            },
            containerStyle
         ]}>
         <TouchableOpacity
            onPress={() => {
               if (onPress) {
                  onPress()
               } else {
                  router.back()
               }
            }}>
            <NeoView
               rounded
               size={50}
               containerStyle={{ shadowColor: 'transparent' }}
               innerStyleContainer={{ backgroundColor: 'transparent' }}>
               <FontAwesome name="chevron-left" size={28} color={isDark ? '#ffffff' : ascent} />
            </NeoView>
         </TouchableOpacity>
      </View>
   )
}

export default BackButton
