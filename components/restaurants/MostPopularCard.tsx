import { TouchableOpacity, ImageBackground } from 'react-native'
import React from 'react'
import { SIZES } from '@/constants/Colors'
import { Product } from '@/typing'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
type Props = {
   index: number
   item: Product
   onPress: (product: Product) => void
}
const MostPopularCard = ({ item, index, onPress }: Props) => {
   const ascent = useThemeColor('ascent')
   return (
      <TouchableOpacity
         style={{
            height: '100%',
            width: SIZES.width * 0.4,
            borderRadius: SIZES.md,
            overflow: 'hidden'
         }}
         onPress={() => onPress(item)}>
         <ImageBackground
            source={{ uri: item.image! }}
            style={{
               width: '100%',
               height: '100%',
               alignItems: 'center',
               justifyContent: 'center'
            }}
            resizeMode="cover">
            <View
               style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  opacity: 0.8,
                  borderRadius: SIZES.md,
                  padding: SIZES.sm * 0.5
               }}>
               <Text
                  type="defaultSemiBold"
                  textColor="white"
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {item.name}
               </Text>
            </View>
            {index <= 2 && (
               <View
                  style={{
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     width: '50%',
                     backgroundColor: ascent,
                     alignItems: 'center',
                     justifyContent: 'center',
                     zIndex: 1,
                     borderBottomRightRadius: SIZES.md,

                     elevation: 2
                  }}>
                  <Text type="defaultSemiBold" fontSize="small" textColor="white">
                     # {index <= 3 ? index + 1 : ''}
                  </Text>
               </View>
            )}
         </ImageBackground>
      </TouchableOpacity>
   )
}

export default MostPopularCard
