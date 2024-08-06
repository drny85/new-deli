import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import { useSegments } from 'expo-router'
import React from 'react'
import { TouchableOpacity, ViewStyle } from 'react-native'
import NeoView from './NeoView'
import Row from './Row'
import { Text } from './ThemedText'

type Props = {
   quantity: number
   onPressAdd: () => void
   onPressSub: () => void
   containerStyle?: ViewStyle
   disabled?: boolean
}
const ItemQuantitySetter = ({
   quantity,
   onPressAdd,
   onPressSub,
   disabled,
   containerStyle
}: Props) => {
   const ascent = useThemeColor('ascent')
   const segment = useSegments()
   const query = 'restaurant-cart' as never
   const showDelete = segment.includes(query)
   return (
      <NeoView
         containerStyle={[{ borderRadius: SIZES.lg * 2, maxWidth: 180 }, containerStyle]}
         innerStyleContainer={{ borderRadius: 20 }}>
         <Row containerStyle={{ gap: SIZES.md }} align="between">
            <TouchableOpacity
               style={{ opacity: disabled ? 0.6 : 1 }}
               disabled={disabled}
               onPress={onPressSub}>
               {showDelete && quantity === 1 ? (
                  <Feather
                     name="trash"
                     size={20}
                     color={ascent}
                     style={{ paddingLeft: SIZES.sm }}
                  />
               ) : (
                  <Feather name="minus-circle" size={26} color={ascent} />
               )}
            </TouchableOpacity>
            <Text type="title" fontSize="medium">
               {quantity}
            </Text>
            <TouchableOpacity onPress={onPressAdd}>
               <Feather name="plus-circle" size={26} color={ascent} />
               {/* <SymbolView name="plus.circle.fill" size={30} tintColor={ascent}  type="monochrome" /> */}
            </TouchableOpacity>
         </Row>
      </NeoView>
   )
}

export default ItemQuantitySetter
