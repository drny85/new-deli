import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { router, Stack } from 'expo-router'
import { useEffect } from 'react'

const OrdersTabsLayout = () => {
   const { restaurant } = useRestaurantsStore()

   useEffect(() => {
      if (restaurant?.couriers.length === 0 && restaurant?.ordersMethod !== 'pickup-only') {
         router.push('/(deli)/(orders)/no-courriers')
      }
   }, [restaurant?.ordersMethod])

   return (
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
         <Stack.Screen name="(tabs)" />
         <Stack.Screen name="no-courriers" />
      </Stack>
   )
}

export default OrdersTabsLayout
