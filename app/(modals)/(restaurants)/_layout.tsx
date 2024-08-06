import { useNotifications } from '@/hooks/useNotification'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Stack } from 'expo-router'

const ModalRestaurantLayout = () => {
   const backgroundColor = useThemeColor('background')
   useNotifications()
   return (
      <Stack
         screenOptions={{
            headerStyle: {
               backgroundColor
            }
         }}>
         <Stack.Screen
            name="restaurant"
            options={{
               headerShown: false,
               animation: 'slide_from_bottom'
            }}
         />
         <Stack.Screen
            name="checkout"
            options={{
               headerShown: false,
               animation: 'slide_from_bottom'
            }}
         />
         <Stack.Screen
            name="product-details"
            options={{
               headerShown: false
            }}
         />
         <Stack.Screen
            name="pickup-view"
            options={{
               headerShown: false
            }}
         />
         <Stack.Screen
            name="restaurant-cart/[restaurantId]"
            options={{
               title: 'Cart',
               headerShown: false,
               animation: 'slide_from_bottom',
               headerShadowVisible: false
            }}
         />
      </Stack>
   )
}

export default ModalRestaurantLayout
