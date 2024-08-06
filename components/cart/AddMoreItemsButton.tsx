import { TouchableOpacity } from 'react-native'
import React from 'react'
import NeoView from '../NeoView'
import Row from '../Row'
import { Text } from '../ThemedText'
import { FontAwesome } from '@expo/vector-icons'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'

type Props = {
   onPress: () => void
}
const AddMoreItemsButton = ({ onPress }: Props) => {
   const plus = useThemeColor('ascent')
   return (
      <TouchableOpacity onPress={onPress}>
         <NeoView
            innerStyleContainer={{
               borderRadius: SIZES.lg * 2,
               paddingHorizontal: SIZES.sm,
               paddingVertical: 2
            }}
            containerStyle={{
               borderRadius: SIZES.lg * 2,
               alignSelf: 'flex-end'
            }}>
            <Row containerStyle={{ gap: SIZES.sm }}>
               <Text type="defaultSemiBold">Add Items</Text>
               <FontAwesome name="plus" size={18} color={plus} />
            </Row>
         </NeoView>
      </TouchableOpacity>
   )
}

export default AddMoreItemsButton
