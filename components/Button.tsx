import {
   TouchableOpacity,
   ViewStyle,
   StyleSheet,
   Text,
   TextStyle,
   ActivityIndicator
} from 'react-native'
import React from 'react'

import { SIZES } from '@/constants/Colors'
import NeoView from './NeoView'
import { useThemeColor } from '@/hooks/useThemeColor'

type Props = {
   title: string

   onPress: () => void
   disabled?: boolean
   loading?: boolean
   containerStyle?: ViewStyle
   contentTextStyle?: TextStyle
   type?: 'primary' | 'secondary' | 'soft'
}
const Button = ({
   title,
   onPress,
   containerStyle,
   disabled,
   contentTextStyle,
   type = 'primary',
   loading
}: Props) => {
   const bgColor = useThemeColor('primary')
   const ascentColor = useThemeColor('ascent')
   const softColor = useThemeColor('background')
   const textColor = useThemeColor('text')

   return (
      <NeoView
         containerStyle={[
            {
               borderRadius: SIZES.lg * 2,
               backgroundColor:
                  type === 'primary' ? bgColor : type === 'soft' ? softColor : ascentColor
            }
         ]}
         innerStyleContainer={{ borderRadius: SIZES.lg * 2, ...containerStyle }}>
         <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={[
               styles.container,
               { backgroundColor: type === 'primary' ? ascentColor : bgColor },
               containerStyle
            ]}>
            {loading ? (
               <ActivityIndicator size={'small'} />
            ) : (
               <Text
                  style={[
                     styles.text,
                     {
                        color:
                           type === 'primary' ? textColor : type === 'soft' ? ascentColor : 'white'
                     },
                     contentTextStyle
                  ]}>
                  {title}
               </Text>
            )}
         </TouchableOpacity>
      </NeoView>
   )
}

export default Button

const styles = StyleSheet.create({
   container: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: SIZES.lg * 2
   },
   text: {
      color: 'white',
      fontFamily: 'MontserratBold',
      fontSize: 20
   }
})
