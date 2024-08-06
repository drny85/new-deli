import { useThemeColor } from '@/hooks/useThemeColor'
import { Stack } from 'expo-router'

const CouriersLayout = () => {
   const backgroundColor = useThemeColor('background')
   return (
      <Stack
         screenOptions={{
            headerStyle: {
               backgroundColor: backgroundColor
            }
         }}>
         <Stack.Screen
            name="couriers"
            options={{
               headerShadowVisible: false,
               title: 'Couriers'
            }}
         />
         <Stack.Screen name="[courierId]" options={{ title: "Courier's Details" }} />
      </Stack>
   )
}

export default CouriersLayout
