import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import NeoView from './NeoView'
import { SymbolView } from 'expo-symbols'
import * as Linking from 'expo-linking'

type Props = {
   phone: string
   size?: number
}

const PhoneCall = ({ phone, size }: Props) => {
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
      <NeoView rounded size={size || 46}>
         <TouchableOpacity onPress={onPressCall}>
            <SymbolView name="phone" size={size ? size * 0.6 : 46 * 0.6} />
         </TouchableOpacity>
      </NeoView>
   )
}

export default PhoneCall
