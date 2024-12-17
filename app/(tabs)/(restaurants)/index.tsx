import { Container } from '@/components/Container'
import AllCategoriesView from '@/components/restaurants/AllCategoriesView'
import HomeSkelenton from '@/components/skeletons/HomeSkelenton'
import RestaurantCard from '@/components/restaurants/RestaurantCard'
import RestaurantSearch from '@/components/restaurants/RestaurantSearch'
import RestaurantsHeader from '@/components/restaurants/RestaurantsHeader'
import Row from '@/components/Row'

import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useAllProducts } from '@/hooks/restaurants/useAllProducts'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { Business, Category, ORDER_TYPE } from '@/shared/types'
import { getDistanceFromLatLonInMeters } from '@/utils/getDistanceInMeters'
import { FlashList } from '@shopify/flash-list'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Feather } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { onRestaurantSearch } from '@/helpers/restaurantsSearch'

const ALL = { id: 'all', name: 'All Categories' }
type ParamsProps = {
   from: string
}

const Restaurants = () => {
   const { loading, products, restaurants: res } = useAllProducts()
   const { from } = useLocalSearchParams<ParamsProps>()
   const { restaurants, setRestaurants } = useRestaurantsStore()
   const [search, setValue] = useState('')
   const { orderType, setOrderType, currentLocationCoords, deliveryAddress } = useOrderFlowStore()
   const flashListRef = useRef<FlashList<Business>>(null)
   const [selectedCategory, setSelectedCategory] = useState<Category>(ALL)
   const [viewByDistance, setViewDyDistance] = useState(true)
   const ascentColor = useThemeColor('ascent')

   const onOptionChange = (value: ORDER_TYPE) => {
      setOrderType(value)
   }
   const resultsAll = useMemo(() => {
      if (selectedCategory && selectedCategory.id!.toLowerCase() === 'all') return restaurants
      if (selectedCategory) {
         return restaurants.filter((r) =>
            products.some((p) => p.category?.id === selectedCategory.id && p.businessId === r.id)
         )
      }
      return restaurants
   }, [restaurants, selectedCategory])

   const restaurantsByDistance = useMemo(() => {
      if (!currentLocationCoords && !deliveryAddress) return resultsAll

      const referenceCoords = deliveryAddress?.coords || currentLocationCoords
      if (!referenceCoords) return resultsAll

      return resultsAll
         .filter((r) => r.coords) // Ensure restaurants have valid coordinates
         .map((r) => ({
            ...r,
            distance: getDistanceFromLatLonInMeters(r.coords, referenceCoords)
         }))
         .sort((a, b) => a.distance - b.distance)
   }, [currentLocationCoords, deliveryAddress, resultsAll])

   const onValueChange = (value: string) => {
      onRestaurantSearch(value, restaurants, products, res, setRestaurants, setValue)
   }

   const onCategoryPress = (category: Category) => {
      if (!category) {
         setSelectedCategory(ALL)
         return
      }
      if (category.id && category.id.toLowerCase() === 'all') {
         setSelectedCategory(ALL)
      } else {
         setSelectedCategory(category)
      }
   }

   const onRestaurantPress = (restaurantId: string) => {
      router.push({
         pathname: '/restaurant',
         params: { restaurantId, categoryName: selectedCategory.name }
      })
      if (search) {
         setValue('')
      }
      setSelectedCategory(ALL)
   }

   useFocusEffect(
      useCallback(() => {
         if (orderType === 'pickup') {
            router.push('/pickup-view')
         }
      }, [orderType])
   )

   if (loading) return <HomeSkelenton />

   return (
      <Container>
         {from && (
            <TouchableOpacity style={{ padding: 6, marginLeft: 2 }} onPress={router.back}>
               <Feather name="x-circle" size={26} color={ascentColor} />
            </TouchableOpacity>
         )}
         <View style={{ flex: 1, padding: SIZES.sm }}>
            <RestaurantsHeader onOptionChange={onOptionChange} />
            <View style={{ marginBottom: SIZES.md }}>
               <RestaurantSearch
                  onClose={() => {
                     setValue('')
                     setRestaurants(res)
                     Keyboard.dismiss()
                  }}
                  value={search}
                  onValueChange={onValueChange}
                  placeholder="Search for food or restaurants"
               />
            </View>
            <View>
               <AllCategoriesView onCategoryPress={onCategoryPress} products={products} />
            </View>
            <Row containerStyle={{ paddingBottom: SIZES.sm }} align="between">
               <Text type="muted" fontSize="large">
                  {viewByDistance ? 'Nearby Restaurants' : 'All Restaurants'}
               </Text>
               <TouchableOpacity onPress={() => setViewDyDistance((prev) => !prev)}>
                  <Text type="muted" fontSize="medium">
                     {viewByDistance ? ' View All' : 'View Nearby'}
                  </Text>
               </TouchableOpacity>
            </Row>
            <FlashList
               ref={flashListRef}
               data={restaurantsByDistance.slice(
                  0,
                  viewByDistance ? 10 : restaurantsByDistance.length
               )}
               showsVerticalScrollIndicator={false}
               ListFooterComponent={<View style={{ height: SIZES.md }} />}
               keyExtractor={(item) => item.id!}
               estimatedItemSize={210}
               ListEmptyComponent={
                  <View style={{ marginTop: 60 }}>
                     <Text style={{ textAlign: 'center' }} type="defaultSemiBold">
                        No restaurants found
                     </Text>
                  </View>
               }
               renderItem={({ item }) => {
                  return (
                     <RestaurantCard
                        contentContainerStyle={{
                           marginVertical: SIZES.sm * 0.5
                        }}
                        item={item}
                        onPress={() => {
                           onRestaurantPress(item.id!)
                        }}
                     />
                  )
               }}
            />
         </View>
      </Container>
   )
}

export default Restaurants
