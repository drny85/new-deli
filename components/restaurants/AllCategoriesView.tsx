import { SIZES } from '@/constants/Colors'

import { useAllCategories } from '@/hooks/category/useAllCategories'
import { Category, Product } from '@/typing'
import { FlashList } from '@shopify/flash-list'
import { useNavigation } from 'expo-router'
import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import Loading from '../Loading'
import CategoryTitle from './CategoryTitle'

type Props = {
   ids: string[]
   products: Product[]
   onCategoryPress: (category: Category) => void
}
const AllCategoriesView = ({ ids, products, onCategoryPress }: Props) => {
   const { categories, loading } = useAllCategories(ids)
   const navigation = useNavigation()
   const [index, setIndex] = useState<number>(0)
   const [selected, setSelected] = useState('All Categories')
   const availableCategories = useMemo(() => {
      return categories.filter((c) => products.some((p) => p.category?.id === c.id))
   }, [categories, products])

   const viewRef = React.useRef<FlashList<Category>>(null)

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
               showsHorizontalScrollIndicator={false}
               horizontal
               data={[{ id: 'all', name: 'All Categories' }, ...availableCategories].sort((a, b) =>
                  a.name.localeCompare(b.name)
               )}
               estimatedItemSize={availableCategories.length + 1}
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
