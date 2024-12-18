import { SIZES } from '@/constants/Colors'
import { useAllProducts } from '@/hooks/restaurants/useAllProducts'
import { Category, Product } from '@/shared/types'
import { useNavigation } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { FlatList, View } from 'react-native'
import Loading from '../Loading'
import CategoryTitle from './CategoryTitle'
import { categoriesArray } from '@/helpers/categoriesArray'

type Props = {
   products: Product[]
   onCategoryPress: (category: Category) => void
}
const AllCategoriesView = ({ onCategoryPress }: Props) => {
   const navigation = useNavigation()
   const { products, loading } = useAllProducts()
   const [index, setIndex] = useState<number>(0)
   const [selected, setSelected] = useState('All Categories')
   const viewRef = useRef<FlatList<Category>>(null)
   const data = useMemo(() => categoriesArray(products), [products])

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
            <FlatList
               ref={viewRef}
               initialScrollIndex={index}
               showsHorizontalScrollIndicator={false}
               horizontal
               data={data}
               onScrollToIndexFailed={(info) => {
                  const wait = new Promise((resolve) => setTimeout(resolve, 500))
                  wait.then(() => {
                     viewRef.current?.scrollToIndex({
                        index: info.index,
                        animated: true,
                        viewPosition: 0.5
                     })
                  })
               }}
               renderItem={({ item, index }) => {
                  return (
                     <CategoryTitle
                        index={index}
                        item={item}
                        selected={selected}
                        setSelected={() => setSelected(item.name)}
                        setIndex={() => setIndex(index)}
                        onCategoryPress={() => onCategoryPress(item)}
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
