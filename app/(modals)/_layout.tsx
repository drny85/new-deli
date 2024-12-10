import { Stack } from 'expo-router'

const _layout = () => {
   return (
      <Stack>
         <Stack.Screen name="(restaurants)" options={{ headerShown: false }} />
         <Stack.Screen name="(orders)" options={{ headerShown: false }} />
         <Stack.Screen name="(business)" options={{ headerShown: false }} />
         <Stack.Screen name="favorite-search" options={{ headerShown: false }} />
      </Stack>
   )
}

export default _layout
