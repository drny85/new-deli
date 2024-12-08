import { SIZES } from '@/constants/Colors'
import { Product } from '@/shared/types'
import { FlashList } from '@shopify/flash-list'
import { View } from '../ThemedView'
import MostPopularCard from './MostPopularCard'

type Props = {
   products: Product[]
   onPress: (product: Product) => void
}

const MostPopularProducts = ({ products, onPress }: Props) => {
   return (
      <FlashList
         horizontal
         contentContainerStyle={{ paddingVertical: SIZES.sm }}
         showsHorizontalScrollIndicator={false}
         estimatedItemSize={158}
         data={products}
         keyExtractor={(item) => item.id!}
         renderItem={({ index, item }) => {
            return (
               <View style={{ marginRight: SIZES.sm }}>
                  <MostPopularCard index={index} item={item} onPress={onPress} />
               </View>
            )
         }}

         // renderItem={renderMostPopularProducts}
      />
   )
}

export default MostPopularProducts
