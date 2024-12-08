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
import { router, useFocusEffect } from 'expo-router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Keyboard, TouchableOpacity } from 'react-native'
import { useRestaurantsStore } from '@/stores/restaurantsStore'

const ALL = { id: 'all', name: 'All Categories' }

const Restaurants = () => {
   const { loading, products, restaurants: res } = useAllProducts()
   const { restaurants, setRestaurants } = useRestaurantsStore()
   const [search, setValue] = useState('')
   const { orderType, setOrderType, currentLocationCoords, deliveryAddress } = useOrderFlowStore()
   const flashListRef = useRef<FlashList<Business>>(null)
   const [selectedCategory, setSelectedCategory] = useState<Category>(ALL)
   const [viewByDistance, setViewDyDistance] = useState(true)

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

      if (currentLocationCoords && !deliveryAddress) {
         return resultsAll.map((r) => ({
            ...r,
            distance: getDistanceFromLatLonInMeters(r.coords!, {
               latitude: currentLocationCoords.latitude!,
               longitude: currentLocationCoords.longitude!
            })
         }))
      }
      return resultsAll
         .map((r) => ({
            ...r,
            distance: getDistanceFromLatLonInMeters(r.coords!, deliveryAddress?.coords!)
         }))
         .sort((a, b) => a.distance - b.distance)
   }, [currentLocationCoords, deliveryAddress, selectedCategory, restaurants])

   // const results = useMemo(() => {
   //    if (viewByDistance) {
   //       return restaurantsByDistance
   //    }
   //    return resultsAll
   // }, [restaurantsByDistance, resultsAll, viewByDistance])

   const onValueChange = (value: string) => {
      // Update the input value state
      setValue(value)

      // Sanitize and prepare the search term
      const searchTerm = value
         .trim()
         .replace(/[^a-z]/gi, '')
         .toLowerCase()
      if (!searchTerm) {
         // Reset restaurants when search term is empty
         setRestaurants(res)
         return
      }

      // Combine filters for restaurants and products
      const filteredRestaurants = restaurants.filter((restaurant) => {
         const restaurantMatch = restaurant.name.toLowerCase().includes(searchTerm)

         // Check if any product matches for the current restaurant
         const productMatch = products.some(
            (product) =>
               product.businessId === restaurant.id &&
               (product.name.toLowerCase().includes(searchTerm) ||
                  product.keywords?.some((keyword) => keyword.toLowerCase().includes(searchTerm)))
         )

         return restaurantMatch || productMatch
      })

      // Update the restaurant list with filtered results
      setRestaurants(filteredRestaurants)
   }

   const onCategoryPress = (category: Category) => {
      if (!category) {
         setSelectedCategory(ALL)
         return
      }
      if (category.id!.toLowerCase() === 'all') {
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
         <View style={{ flex: 1, paddingHorizontal: SIZES.sm }}>
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
               <AllCategoriesView
                  onCategoryPress={onCategoryPress}
                  ids={restaurants.map((r) => r.id!)}
                  products={[...products]}
               />
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
                        onPress={() => onRestaurantPress(item.id!)}
                     />
                  )
               }}
            />
         </View>
      </Container>
   )
}

export default Restaurants
