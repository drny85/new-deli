import { Stack } from 'expo-router'

const OrdersLayout = () => {
   return (
      <Stack>
         <Stack.Screen options={{ headerShown: false }} name="orders" />
      </Stack>
   )
}

export default OrdersLayout
