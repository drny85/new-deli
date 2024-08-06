import { Stack } from 'expo-router'

const RestaurantsLayout = () => {
   return (
      <Stack>
         <Stack.Screen
            options={{
               headerShown: false
            }}
            name="index"
         />
      </Stack>
   )
}

export default RestaurantsLayout
