import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SIZES } from '@/constants/Colors'
import { globalStyle } from '@/constants/styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Category } from '@/shared/types'

type Props = {
   item: Category
   index: number
   selected: string
   setIndex: (index: number) => void
   setSelected: (category: string) => void
   onCategoryPress: (category: Category) => void
}
const CategoryTitle = ({
   index,
   item,
   onCategoryPress,
   selected,
   setSelected,
   setIndex
}: Props) => {
   const ascentColor = useThemeColor('ascent')
   const backgroundColor = useThemeColor('primary')
   const textColor = useThemeColor('text')
   return (
      <View style={{ marginHorizontal: SIZES.sm * 0.5 }}>
         <TouchableOpacity
            style={[
               {
                  borderRadius: 30,
                  ...globalStyle.shadow,
                  paddingHorizontal: SIZES.md,
                  paddingVertical: SIZES.sm,
                  backgroundColor: selected === item.name ? ascentColor : backgroundColor,
                  shadowColor: 'rgba(0,0,0,0.2)',
                  shadowRadius: 2,
                  marginVertical: 2
               }
            ]}
            onPress={() => {
               setSelected(item.name)
               setIndex(index)
               onCategoryPress(item)
               // dispatch(setCurrentCategory(item));
            }}>
            <Text
               style={{
                  fontFamily: 'Montserrat',
                  color: item.name === selected ? 'white' : textColor,
                  fontWeight: item.name === selected ? '800' : '500'
               }}>
               {item.name}
            </Text>
         </TouchableOpacity>
      </View>
   )
}

export default CategoryTitle
