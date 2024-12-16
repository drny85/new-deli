import { TouchableOpacity, useColorScheme } from 'react-native'
import React from 'react'
import NeoView from './NeoView'
import * as Linking from 'expo-linking'
import { AntDesign } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'

type Props = {
   phone: string
   size?: number
}

const PhoneCall = ({ phone, size }: Props) => {
   const ascent = useThemeColor('ascent')
   const isDark = useColorScheme() === 'dark'
   const onPressCall = () => {
      try {
         if (!phone) return
         const url = `tel:${phone.replace(/-/g, '')}`
         Linking.canOpenURL(url).then((supported) => {
            if (supported) {
               Linking.openURL(url)
            } else {
               console.log('Dont know how to open URI: ' + url)
            }
         })
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <NeoView rounded size={size || 48}>
         <TouchableOpacity onPress={onPressCall}>
            <AntDesign
               name="phone"
               size={size ? size * 0.6 : 46 * 0.6}
               color={isDark ? '#ffffff' : ascent}
            />
         </TouchableOpacity>
      </NeoView>
   )
}

export default PhoneCall
