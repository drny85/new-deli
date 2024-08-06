import React from 'react'

import { SIZES } from '@/constants/Colors'
import { Product } from '@/typing'
import { FlashList } from '@shopify/flash-list'
import MostPopularCard from './MostPopularCard'
import { View } from '../ThemedView'

type Props = {
   products: Product[]
   onPress: (product: Product) => void
}

const MostPopularProducts = ({ products, onPress }: Props) => {
   return (
      <FlashList
         horizontal
         contentContainerStyle={{ padding: SIZES.sm }}
         showsHorizontalScrollIndicator={false}
         estimatedItemSize={products.length + 2}
         data={products}
         keyExtractor={(item) => item.id!}
         renderItem={({ index, item }) => {
            return (
               <View style={{ marginHorizontal: SIZES.sm }}>
                  <MostPopularCard index={index} item={item} onPress={onPress} />
               </View>
            )
         }}

         // renderItem={renderMostPopularProducts}
      />
   )
}

export default MostPopularProducts
