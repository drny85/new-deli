import NeoView from '@/components/NeoView'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Feather } from '@expo/vector-icons'
import { router, Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

const ProductsLayout = () => {
   const backgroundColor = useThemeColor('background')
   const restaurant = useRestaurantsStore((s) => s.restaurant)
   const textColor = useThemeColor('text')
   return (
      <Stack>
         <Stack.Screen
            name="products"
            options={{
               title: 'Products',
               headerShadowVisible: false,
               headerStyle: {
                  backgroundColor
               },
               headerLeft: () => {
                  return (
                     <TouchableOpacity
                        onPress={() => router.push('/(modals)/(business)/categories')}>
                        <NeoView
                           innerStyleContainer={{
                              borderRadius: SIZES.lg,
                              padding: 3,
                              paddingHorizontal: SIZES.md
                           }}
                           containerStyle={{ borderRadius: SIZES.lg }}>
                           <Row containerStyle={{ gap: SIZES.sm }}>
                              <Text type="defaultSemiBold">Add Category</Text>
                              <Feather name="plus" size={28} color={textColor} />
                           </Row>
                        </NeoView>
                     </TouchableOpacity>
                  )
               },
               headerRight: () => (
                  <TouchableOpacity
                     onPress={() => {
                        if (restaurant?.agreedToTerms) {
                           router.push('/(modals)/(business)/add-product')
                        } else {
                           router.push({
                              pathname: '/business-terms',
                              params: { returnUrl: '/(modals)/(business)/add-product' }
                           })
                        }
                     }}>
                     <NeoView
                        innerStyleContainer={{
                           borderRadius: SIZES.lg,
                           padding: 3,
                           paddingHorizontal: SIZES.md
                        }}
                        containerStyle={{ borderRadius: SIZES.lg }}>
                        <Row containerStyle={{ gap: SIZES.sm }}>
                           <Text type="defaultSemiBold">Add Product</Text>
                           <Feather name="plus" size={28} color={textColor} />
                        </Row>
                     </NeoView>
                  </TouchableOpacity>
               )
            }}
         />
      </Stack>
   )
}

export default ProductsLayout
