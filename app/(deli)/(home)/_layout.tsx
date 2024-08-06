import useNewOrderAlert from '@/hooks/orders/useNewOrderAlert'
import { Stack } from 'expo-router'

const _layout = () => {
   useNewOrderAlert()
   return (
      <Stack>
         <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
   )
}

export default _layout
