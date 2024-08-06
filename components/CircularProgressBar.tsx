import { useThemeColor } from '@/hooks/useThemeColor'
import { calculatePercentage } from '@/utils/calculatePercentage'

import { Canvas, Path, Skia, Text, useFont } from '@shopify/react-native-skia'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated'
import { View } from './ThemedView'
import { Text as T } from './ThemedText'
import { SIZES } from '@/constants/Colors'

const RADIUS = 60
const STROKE_WIDTH = RADIUS * 0.2

type Props = {
   strokeWidth?: number
   currentValue: number
   maxValue: number
   title?: string
   radius?: number
}

const CircularProgressBar = ({
   radius = RADIUS,
   strokeWidth = STROKE_WIDTH,
   currentValue,
   maxValue,
   title
}: Props) => {
   const accent = useThemeColor('ascent')
   const textColor = useThemeColor('text')
   const secondary = useThemeColor('secondary')
   const percentage = useSharedValue(0)
   const end = useSharedValue(0)
   const innerRadius = radius - strokeWidth / 2
   const font = useFont(require('@/assets/fonts/Montserrat-Bold.ttf'), radius * 0.4)
   const path = Skia.Path.Make()
   path.addCircle(radius, radius, innerRadius)

   const targetText = useDerivedValue(() => `${Math.round(percentage.value)}%`, [])

   const fontSize = font?.measureText('00%')

   const textX = useDerivedValue(() => {
      const _fontSize = font?.measureText(targetText.value)
      return radius - _fontSize?.width! / 2
   }, [font, fontSize])
   const value = calculatePercentage(currentValue, maxValue)
   useEffect(() => {
      percentage.value = withTiming(value, { duration: 700 })
      end.value = withTiming(value / 100, { duration: 700 })
   }, [value, font])

   //if (!font || !fontSize) return <View />

   return (
      <View>
         <View
            style={{
               width: radius * 2,
               height: radius * 2
            }}>
            <Canvas style={styles.container}>
               <Path
                  path={path}
                  strokeWidth={strokeWidth}
                  color={secondary}
                  style="stroke"
                  strokeJoin="round"
                  strokeCap="round"
                  start={0}
                  end={1}
               />
               <Path
                  path={path}
                  strokeWidth={strokeWidth}
                  color={accent}
                  style="stroke"
                  strokeJoin="round"
                  strokeCap="round"
                  start={0}
                  end={end}
               />
               <Text
                  x={textX}
                  y={radius + fontSize?.height! / 2}
                  text={targetText}
                  font={font}
                  color={textColor}
               />
            </Canvas>
         </View>
         {title && (
            <View
               style={{
                  maxWidth: SIZES.width * 0.15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center'
               }}>
               <T
                  style={{ marginTop: SIZES.sm, fontWeight: '700', fontSize: 16 }}
                  type="muted"
                  center>
                  {title}
               </T>
            </View>
         )}
      </View>
   )
}

export default CircularProgressBar

const styles = StyleSheet.create({
   container: {
      flex: 1
   }
})
