import { FlashList } from '@shopify/flash-list'
import { forwardRef } from 'react'
import { View } from '../ThemedView'
import ProductCard from './ProductCart'
import { router } from 'expo-router'
import { Product } from '@/shared/types'
import { SIZES } from '@/constants/Colors'
import { CategorizedProduct } from '@/helpers/categorizedProducts'
import { ViewStyle } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'

interface ProductsViewProps {
   item: CategorizedProduct
   style?: ViewStyle
}

const ProductsView = forwardRef<FlashList<Product>, ProductsViewProps>(({ item, style }, ref) => {
   const backgroundColor = useThemeColor('background')
   return (
      <View
         style={[
            {
               flex: 1,
               backgroundColor,
               gap: SIZES.sm,
               marginBottom: 30
            },
            style
         ]}>
         <FlashList
            data={item.data}
            ref={ref}
            horizontal
            pagingEnabled
            keyExtractor={(item) => item.id!}
            estimatedItemSize={210}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
               <View style={{ marginRight: 20, borderRadius: SIZES.lg * 2 }}>
                  <ProductCard
                     product={item}
                     onPress={() =>
                        router.push({
                           pathname: '/product-details',
                           params: {
                              productId: item.id,
                              businessId: item.businessId,
                              editing: undefined
                           }
                        })
                     }
                  />
               </View>
            )}
         />
      </View>
   )
})
export default ProductsView
