import { SIZES } from '@/constants/Colors'
import { useAllProducts } from '@/hooks/restaurants/useAllProducts'
import { Category, Product } from '@/shared/types'
import { FlashList } from '@shopify/flash-list'
import { useNavigation } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import Loading from '../Loading'
import CategoryTitle from './CategoryTitle'

type Props = {
   ids: string[]
   products: Product[]
   onCategoryPress: (category: Category) => void
}
const AllCategoriesView = ({ onCategoryPress }: Props) => {
   const navigation = useNavigation()
   const [refetch, setRefetch] = useState(true)
   const { products, loading } = useAllProducts(refetch)
   const [index, setIndex] = useState<number>(0)
   const [selected, setSelected] = useState('All Categories')
   const viewRef = useRef<FlashList<Category>>(null)
   const data = useMemo(() => {
      // Deduplicate categories using a Set for IDs
      const seenIds = new Set<string>()

      const uniqueCategories = products
         .map((p) => p.category)
         .filter((category): category is { id: string; name: string } => {
            // TypeScript narrowing with type predicate
            if (!category || !category.id) return false // Exclude null/undefined
            if (seenIds.has(category.id)) return false // Deduplicate by ID
            seenIds.add(category.id)
            return true // Valid category
         })

      // Add "All Categories" and sort alphabetically
      return [
         { id: 'all', name: 'All Categories' },
         ...uniqueCategories.sort((a, b) => (a.name > b.name ? 1 : -1))
      ]
   }, [products])

   useEffect(() => {
      viewRef.current?.scrollToIndex({
         index,
         animated: true,
         viewPosition: index === 0 ? 0 : 0.5
      })
   }, [index])

   useEffect(() => {
      const subs = navigation.addListener('blur', () => {
         setIndex(0)
         setSelected('All Categories')
         setRefetch((prev) => !prev)
      })

      return () => navigation.removeListener('blur', subs)
   }, [navigation])

   return (
      <View style={{ height: SIZES.height * 0.07 }}>
         {loading ? (
            <Loading />
         ) : (
            <FlashList
               ref={viewRef}
               initialScrollIndex={index}
               estimatedItemSize={SIZES.width}
               estimatedListSize={{
                  width: SIZES.width,
                  height: SIZES.height * 0.07
               }}
               showsHorizontalScrollIndicator={false}
               horizontal
               data={data}
               renderItem={({ item, index }) => {
                  return (
                     <CategoryTitle
                        index={index}
                        item={item}
                        selected={selected}
                        setSelected={setSelected}
                        setIndex={setIndex}
                        onCategoryPress={onCategoryPress}
                     />
                  )
               }}
               keyExtractor={(item) => item.id!}
            />
         )}
      </View>
   )
}

export default AllCategoriesView
