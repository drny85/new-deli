import { Stack } from 'expo-router'

const OrdersLayout = () => {
   return (
      <Stack>
         <Stack.Screen options={{ headerShown: false }} name="favorites" />
      </Stack>
   )
}

export default OrdersLayout
