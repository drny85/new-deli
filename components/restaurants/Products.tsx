import { SIZES } from '@/constants/Colors'
import { CategorizedProduct } from '@/helpers/categorizedProducts'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { forwardRef, useEffect, useRef } from 'react'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import ProductCard from './ProductCart'
import { ViewStyle } from 'react-native'
import { Product } from '@/shared/types'

let timer: NodeJS.Timeout

type Props = {
   items: CategorizedProduct[]
   categoryName: string | undefined
}
interface ProductsViewProps {
   item: CategorizedProduct
   style?: ViewStyle
}

const Products = ({ items, categoryName }: Props) => {
   const listRef = useRef<FlashList<CategorizedProduct>>(null)

   const index = items.findIndex((c) => c.title?.toLowerCase() === categoryName?.toLowerCase())

   useEffect(() => {
      if (items.length === 0 || !categoryName || categoryName === 'All Categories') return
      console.log(categoryName)
      if (index !== -1) {
         listRef.current?.scrollToIndex({ index, animated: true })
         timer = setTimeout(() => {
            listRef.current?.scrollToIndex({
               index,
               animated: true
            })
         }, 800)
      }
      return () => {
         clearTimeout(timer)
      }
   }, [index, categoryName, items.length, listRef])

   if (items.length === 0) return null
   return (
      <FlashList
         scrollEnabled={false}
         initialScrollIndex={0}
         estimatedItemSize={205}
         contentContainerStyle={{ paddingBottom: SIZES.lg }}
         data={items}
         ref={listRef}
         //getItemType={getItemLayout}

         keyExtractor={(item) => item.title}
         renderItem={({ item }) => <ProductsView item={item} />}
      />
   )
}

export default Products

const ProductsView = forwardRef<FlashList<Product>, ProductsViewProps>(({ item, style }, ref) => {
   const backgroundColor = useThemeColor('background')
   return (
      <View
         style={[
            {
               flex: 1,
               gap: SIZES.sm,
               backgroundColor,
               marginBottom: 30
            },
            style
         ]}>
         <Text type="defaultSemiBold" fontSize="large">
            {item.title}
         </Text>
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
