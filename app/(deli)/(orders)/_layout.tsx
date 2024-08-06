import useNewOrderAlert from '@/hooks/orders/useNewOrderAlert'
import { Stack } from 'expo-router'

const _layout = () => {
   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="(tabs)" />
         <Stack.Screen name="no-courriers" />
      </Stack>
   )
}

export default _layout
