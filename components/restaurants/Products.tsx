import { SIZES } from '@/constants/Colors'
import { CategorizedProduct } from '@/helpers/categorizedProducts'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import ProductCard from './ProductCart'

let timer: NodeJS.Timeout

type Props = {
   items: CategorizedProduct[]
   categoryName: string | undefined
}

const Products = ({ items, categoryName }: Props) => {
   const listRef = useRef<FlashList<CategorizedProduct>>(null)

   const index = items.findIndex((c) => c.title?.toLowerCase() === categoryName?.toLowerCase())

   useEffect(() => {
      if (items.length === 0 || !categoryName) return
      if (index !== -1) {
         listRef.current?.scrollToIndex({ index, animated: true })
         timer = setTimeout(() => {
            listRef.current?.scrollToIndex({
               index: index,
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
         ref={listRef}
         scrollEnabled={false}
         initialScrollIndex={0}
         estimatedItemSize={SIZES.height * 0.22}
         contentContainerStyle={{ paddingBottom: SIZES.lg }}
         data={items}
         //getItemType={getItemLayout}

         keyExtractor={(item) => item.title}
         renderItem={({ item }) => <ProductsView item={item} />}
      />
   )
}

export default Products

const ProductsView = ({ item }: { item: CategorizedProduct }) => {
   const backgroundColor = useThemeColor('background')
   return (
      <View style={{ flex: 1, gap: SIZES.sm, backgroundColor, marginBottom: 30 }}>
         <Text type="defaultSemiBold" fontSize="large">
            {item.title}
         </Text>
         <FlashList
            data={item.data}
            horizontal
            pagingEnabled
            keyExtractor={(item) => item.id!}
            estimatedItemSize={SIZES.height * 0.22}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
               <View style={{ marginHorizontal: 2, borderRadius: SIZES.md }}>
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
}
