import { useThemeColor } from '@/hooks/useThemeColor'
import { Stack } from 'expo-router'

const OrdersLayout = () => {
   const backgroundColor = useThemeColor('background')

   return (
      <Stack
         screenOptions={{
            headerShown: false,
            headerStyle: {
               backgroundColor
            }
         }}>
         <Stack.Screen name="order-success" options={{ headerShown: false }} />
         <Stack.Screen name="order/[orderId]" options={{ headerShown: false }} />
      </Stack>
   )
}

export default OrdersLayout
