import { Container } from '@/components/Container'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { useLayoutEffect } from 'react'

type PropsParams = {
   id: string
}
const StoreInfo = () => {
   const { id } = useLocalSearchParams<PropsParams>()
   const getRestaurant = useRestaurantsStore((s) => s.getRestaurant)
   const restaurant = getRestaurant(id)
   useLayoutEffect(() => {
      if (!restaurant) {
         router.back()
      }
   }, [restaurant])
   return (
      <Container>
         <View style={{ flex: 1 }}>
            <Image
               source={restaurant?.image}
               style={{ height: SIZES.height * 0.3 }}
               contentFit="cover"
            />
            <Text type="header">{restaurant?.name}</Text>
         </View>
      </Container>
   )
}

export default StoreInfo
