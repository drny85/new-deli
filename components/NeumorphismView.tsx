import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'

interface NeumorphismViewProps {
   children?: React.ReactNode
   style?: StyleProp<ViewStyle>
   lightColor?: string // Color for top-left shadow
   darkColor?: string // Color for bottom-right shadow
   borderRadius?: number
   shadowOffset?: number // Size of the shadow
   backgroundColor?: string
   padding?: number
}

const NeumorphismView: React.FC<NeumorphismViewProps> = ({
   children,
   style,
   lightColor = 'rgba(0,0,0,0.1)', // Default light shadow
   darkColor = 'rgba(0,0,0,0.1)', // Default dark shadow
   borderRadius = 12,
   shadowOffset = 8,
   padding = 0
   // Default background color
}) => {
   const backgroundColor = useThemeColor('background')
   return (
      <View
         style={[
            styles.container,
            {
               backgroundColor,
               borderRadius,
               shadowColor: lightColor,
               shadowOffset: { width: -shadowOffset, height: -shadowOffset },
               shadowOpacity: 1,
               padding: padding,
               shadowRadius: shadowOffset
            },
            style
         ]}>
         <View
            style={[
               StyleSheet.absoluteFillObject,
               {
                  borderRadius,
                  backgroundColor,
                  shadowColor: darkColor,
                  shadowOffset: { width: shadowOffset, height: shadowOffset },
                  shadowOpacity: 1,
                  shadowRadius: shadowOffset
               }
            ]}
         />
         {children}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'relative',
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 10 // For Android shadow effect
   }
})

export default NeumorphismView
