import { useAuth } from '@/providers/authProvider'
import { Redirect, Stack } from 'expo-router'

const _layout = () => {
   const { user } = useAuth()
   if (!user) return <Redirect href={'/(tabs)/(restaurants)'} />
   return (
      <Stack>
         <Stack.Screen name="index" options={{ headerShown: false }} />
         <Stack.Screen name="stripe" options={{ headerShown: false }} />
         <Stack.Screen name="account-success" options={{ headerShown: false }} />
      </Stack>
   )
}

export default _layout
