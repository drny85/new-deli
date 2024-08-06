import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FontAwesome } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const _layout = () => {
   const backgroundColor = useThemeColor('background')
   const iconColor = useThemeColor('text')
   return (
      <Stack
         screenOptions={{
            headerShadowVisible: false,
            headerStyle: {
               backgroundColor
            }
         }}>
         <Stack.Screen
            name="order"
            options={{
               title: 'Order Details',
               headerLeft: () => (
                  <TouchableOpacity style={{ padding: SIZES.sm }} onPress={router.back}>
                     <FontAwesome name="chevron-left" size={24} color={iconColor} />
                  </TouchableOpacity>
               )
            }}
         />
         <Stack.Screen
            name="courier-assigment"
            options={{
               animation: 'slide_from_bottom',
               title: 'Assign Order',
               headerLeft: () => (
                  <TouchableOpacity style={{ padding: SIZES.sm }} onPress={router.back}>
                     <FontAwesome name="chevron-left" size={24} color={iconColor} />
                  </TouchableOpacity>
               )
            }}
         />
         <Stack.Screen
            name="categories"
            options={{
               title: 'Categories',

               headerLeft: () => (
                  <TouchableOpacity style={{ padding: SIZES.sm }} onPress={router.back}>
                     <FontAwesome name="chevron-left" size={24} color={iconColor} />
                  </TouchableOpacity>
               )
            }}
         />
         <Stack.Screen
            name="product"
            options={{
               headerShown: false,
               title: 'Product Details'
            }}
         />
         <Stack.Screen
            name="modify-order"
            options={{
               animation: 'slide_from_bottom',
               title: 'Order Change'
            }}
         />
         <Stack.Screen
            name="add-product"
            options={{
               headerShown: false
            }}
         />
      </Stack>
   )
}

export default _layout
