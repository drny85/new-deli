import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useCourier } from '@/hooks/couriers/useCourier'
import { useLocalSearchParams } from 'expo-router'

const CourierDetails = () => {
   const { courierId } = useLocalSearchParams<{ courierId: string }>()
   const { courier, loading } = useCourier(courierId!)
   if (loading) return <Loading />
   return (
      <Container>
         <View style={{ flex: 1, padding: SIZES.md }}>
            <Text>{courierId}</Text>
            <Text>{courier?.name}</Text>
         </View>
      </Container>
   )
}

export default CourierDetails
