import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import RestaurantCard from '@/components/restaurants/RestaurantCard'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useRestaurants } from '@/hooks/restaurants/useRestaurants'
import { useAuth } from '@/providers/authProvider'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { getDistanceFromLatLonInMeters } from '@/utils/getDistanceInMeters'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import React, { useMemo } from 'react'

const Favorites = () => {
   const { user } = useAuth()
   const { restaurants, loading } = useRestaurants()

   const { deliveryAddress, currentLocationCoords } = useOrderFlowStore()

   const onRestaurantPress = (restaurantId: string) => {
      router.push({
         pathname: '/restaurant',
         params: { restaurantId, categoryName: '' }
      })
   }

   const results = useMemo(() => {
      if (!user) return []
      const data = restaurants.filter((r) => user?.favoritesStores.includes(r.id!))
      if (deliveryAddress) {
         return data.map((r) => ({
            ...r,
            distance: getDistanceFromLatLonInMeters(r.coords!, deliveryAddress.coords)
         }))
      } else if (currentLocationCoords) {
         return data.map((r) => ({
            ...r,
            distance: getDistanceFromLatLonInMeters(r.coords!, currentLocationCoords)
         }))
      }

      return data
   }, [user, restaurants, deliveryAddress, currentLocationCoords])

   if (loading) return <Loading />

   if (!user)
      return (
         <Container>
            <View center>
               <Text>Please Sign In</Text>
               <View style={{ width: '60%', marginTop: SIZES.lg }}>
                  <Button
                     title="Sign In"
                     contentTextStyle={{ color: '#ffffff' }}
                     onPress={() =>
                        router.push({
                           pathname: '/login',
                           params: { returnUrl: '/(tabs)/(favorites)/favorites' }
                        })
                     }
                  />
               </View>
            </View>
         </Container>
      )
   return (
      <Container>
         <Text type="header" center>
            Favorites
         </Text>
         <FlashList
            data={results}
            ListEmptyComponent={
               <View
                  style={{
                     flex: 1,
                     marginTop: SIZES.height / 3,
                     gap: SIZES.lg,
                     width: '60%',
                     alignSelf: 'center'
                  }}>
                  <Text type="defaultSemiBold" fontSize="large" center>
                     No favorites yet
                  </Text>

                  <Button
                     type="soft"
                     title="Start Searching"
                     onPress={() => router.push({ pathname: '/favorite-search' })}
                  />
               </View>
            }
            contentContainerStyle={{ paddingTop: SIZES.md, paddingHorizontal: SIZES.sm }}
            renderItem={({ item }) => {
               return (
                  <RestaurantCard
                     contentContainerStyle={{ marginVertical: SIZES.sm * 0.5 }}
                     item={item}
                     onPress={() => onRestaurantPress(item.id!)}
                  />
               )
            }}
            estimatedItemSize={100}
         />
      </Container>
   )
}

export default Favorites
