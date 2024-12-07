import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import { useSegments } from 'expo-router'
import React from 'react'
import { TouchableOpacity, useColorScheme, ViewStyle } from 'react-native'
import NeoView from './NeoView'
import Row from './Row'
import { Text } from './ThemedText'

import Animated, {
   FadeIn,
   FadeInLeft,
   FadeInRight,
   FadeOut,
   FadeOutLeft
} from 'react-native-reanimated'

type Props = {
   quantity: number
   onPressAdd: () => void
   onPressSub: () => void
   containerStyle?: ViewStyle
   disabled?: boolean
   iconSize?: number
}
const ItemQuantitySetter = ({
   quantity,
   onPressAdd,
   onPressSub,
   disabled,
   containerStyle,
   iconSize = 30
}: Props) => {
   const ascent = useThemeColor('ascent')
   const isDark = useColorScheme() === 'dark'
   const segment = useSegments()
   const query = 'restaurant-cart' as never
   const showDelete = segment.includes(query)
   return (
      <NeoView
         containerStyle={[{ borderRadius: SIZES.lg * 2, maxWidth: 180 }, containerStyle]}
         innerStyleContainer={{ borderRadius: 20 }}>
         <Row containerStyle={{ gap: SIZES.md, alignItems: 'center' }} align="between">
            <TouchableOpacity
               style={{ opacity: disabled ? 0.6 : 1 }}
               disabled={disabled}
               onPress={onPressSub}>
               {showDelete && quantity === 1 ? (
                  <Feather
                     name="trash"
                     size={20}
                     color={isDark ? '#c1121f' : ascent}
                     style={{ paddingLeft: SIZES.sm }}
                  />
               ) : (
                  <Feather
                     name="minus-circle"
                     size={iconSize}
                     color={isDark ? '#ffffff' : ascent}
                  />
               )}
            </TouchableOpacity>

            <Text type="title" style={{ fontSize: iconSize / 1.5 }} center>
               {quantity}
            </Text>

            <TouchableOpacity onPress={onPressAdd}>
               <Feather name="plus-circle" size={iconSize} color={isDark ? '#ffffff' : ascent} />
               {/* <SymbolView name="plus.circle.fill" size={30} tintColor={ascent}  type="monochrome" /> */}
            </TouchableOpacity>
         </Row>
      </NeoView>
   )
}

export default ItemQuantitySetter
