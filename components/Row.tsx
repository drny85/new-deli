import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { View } from './ThemedView'

type Props = {
   children: React.ReactNode
   containerStyle?: StyleProp<ViewStyle>

   align?: 'around' | 'between' | 'evenly' | 'center'
}

const Row = ({ children, containerStyle, align }: Props) => {
   return (
      <View
         style={[
            {
               flexDirection: 'row',
               alignItems: 'center',
               justifyContent:
                  align === 'between'
                     ? 'space-between'
                     : align === 'evenly'
                       ? 'space-evenly'
                       : align === 'around'
                         ? 'space-around'
                         : align === 'center'
                           ? 'center'
                           : undefined
            },
            containerStyle
         ]}>
         {children}
      </View>
   )
}

export default Row
