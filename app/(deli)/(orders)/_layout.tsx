import { Stack } from 'expo-router'

const OrdersTabsLayout = () => {
   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="(tabs)" />
         <Stack.Screen name="no-courriers" />
      </Stack>
   )
}

export default OrdersTabsLayout
