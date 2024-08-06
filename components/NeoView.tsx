import { StyleProp, StyleSheet, ViewStyle, View } from 'react-native'
import React from 'react'
import { useThemeColor } from '@/hooks/useThemeColor'

type Props = {
   children: React.ReactNode
   size?: number
   rounded?: boolean
   containerStyle?: StyleProp<ViewStyle>
   innerStyleContainer?: ViewStyle
}
const NeoView = ({
   children,
   containerStyle,
   innerStyleContainer,
   size,
   rounded = false
}: Props) => {
   const backgroundColor = useThemeColor('background')
   const primaryColor = useThemeColor('primary')
   const secondaryColor = useThemeColor('secondary')

   return (
      <View
         style={[
            styles.topShadow,
            {
               backgroundColor,
               shadowColor: primaryColor,
               borderRadius: rounded && size ? size : undefined
            },
            containerStyle
         ]}>
         <View
            style={[
               styles.bottomShadow,
               {
                  backgroundColor,
                  shadowColor: secondaryColor,
                  borderRadius: rounded && size ? size : undefined
               },
               containerStyle
            ]}>
            <View
               style={[
                  styles.inner,
                  {
                     width: size ? size : undefined,
                     height: size ? size : undefined,
                     borderRadius: rounded && size ? size : undefined,
                     justifyContent: rounded ? 'center' : undefined,
                     alignItems: rounded ? 'center' : undefined,
                     backgroundColor: backgroundColor,
                     borderColor: primaryColor
                  },
                  //containerStyle,
                  innerStyleContainer
               ]}>
               {children}
            </View>
         </View>
      </View>
   )
}

export default NeoView

const styles = StyleSheet.create({
   inner: {
      borderWidth: 0.8
   },
   topShadow: {
      shadowOffset: {
         width: -4,
         height: -4
      },

      shadowOpacity: 1,
      shadowRadius: 4
   },
   bottomShadow: {
      shadowOffset: {
         width: 4,
         height: 4
      },

      shadowOpacity: 1,
      shadowRadius: 4
   }
})
