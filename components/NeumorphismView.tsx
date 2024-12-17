import { useThemeColor } from '@/hooks/useThemeColor'
import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, ColorValue } from 'react-native'

interface NeumorphismViewProps {
   children?: React.ReactNode
   style?: StyleProp<ViewStyle>
   lightColor?: string // Color for top-left shadow
   darkColor?: string // Color for bottom-right shadow
   borderRadius?: number
   shadowOffset?: number // Size of the shadow
   backgroundColor?: ColorValue
   padding?: number
   containerStyle?: StyleProp<ViewStyle>
}

const NeumorphismView: React.FC<NeumorphismViewProps> = ({
   children,
   style,
   darkColor = 'rgba(0,0,0,0.1)', // Default dark shadow
   borderRadius = 12,
   shadowOffset = 8,
   backgroundColor,
   padding = 0,
   containerStyle
   // Default background color
}) => {
   const bg = useThemeColor('background')
   return (
      <View
         style={[
            styles.container,
            {
               backgroundColor: backgroundColor || bg,
               borderRadius,
               padding: padding
            },
            style
         ]}>
         <View
            style={[
               StyleSheet.absoluteFillObject,
               {
                  borderRadius,
                  backgroundColor: backgroundColor || bg,
                  shadowColor: darkColor,
                  shadowOffset: { width: shadowOffset, height: shadowOffset },
                  shadowOpacity: 1,
                  // For Android shadow effect
                  shadowRadius: shadowOffset
               },
               containerStyle
            ]}
         />
         {children}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      position: 'relative',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      elevation: 10 // For Android shadow effect
   }
})

export default NeumorphismView
