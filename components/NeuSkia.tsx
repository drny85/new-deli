import React from 'react'
import { Canvas, RoundedRect, Shadow, Paint, Group } from '@shopify/react-native-skia'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'

interface NeumorphismViewProps {
   width: number
   height: number
   borderRadius?: number
   lightColor?: string
   darkColor?: string
   backgroundColor?: string
   blur?: number
   children?: React.ReactNode
   style?: StyleProp<ViewStyle> // Additional styles for overlay container
}

const NeuSkia: React.FC<NeumorphismViewProps> = ({
   width,
   height,
   borderRadius = 20,
   lightColor = 'rgba(255, 255, 255, 0.8)',
   darkColor = 'rgba(0, 0, 0, 0.2)',
   backgroundColor = '#e0e0e0',
   blur = 10,
   children,
   style
}) => {
   return (
      <View style={[styles.wrapper, { width, height, borderRadius }, style]}>
         {/* Neumorphism Canvas */}
         <Canvas style={StyleSheet.absoluteFill}>
            <Group>
               <Paint color={backgroundColor} />
               <RoundedRect x={0} y={0} width={width} height={height} r={borderRadius} />
            </Group>

            {/* Light Shadow */}
            <Shadow dx={-blur} dy={-blur} blur={blur} color={lightColor} inner={false} />

            {/* Dark Shadow */}
            <Shadow dx={blur} dy={blur} blur={blur} color={darkColor} inner={false} />
         </Canvas>

         {/* Children Overlay */}
         <View style={[styles.childrenContainer, { borderRadius }]}>{children}</View>
      </View>
   )
}

const styles = StyleSheet.create({
   wrapper: {
      position: 'relative'
   },
   childrenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center'
   }
})

export default NeuSkia
