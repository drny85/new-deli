import AnimatedRestaurantMap from '@/components/checkout/AnimatedRestaurantMap'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import PhoneCall from '@/components/PhoneCall'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useCourier } from '@/hooks/couriers/useCourier'
import { Order, ORDER_STATUS } from '@/shared/types'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { orderNameSwitch } from '@/utils/orderNameSwitch'
import { FlashList } from '@shopify/flash-list'
import { format } from 'date-fns'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { StyleSheet, TouchableOpacity } from 'react-native'

const CourierDetails = () => {
   const { courierId } = useLocalSearchParams<{ courierId: string }>()
   const { courier, loading } = useCourier(courierId!)
   const orders = useBusinessOrdersStore((state) =>
      state.orders.filter((o) => o.status === ORDER_STATUS.delivered && o.courier?.id === courierId)
   )

   const renderItem = (order: Order) => {
      return (
         <View style={styles.hero}>
            <View style={{ gap: SIZES.sm }}>
               <Text>
                  Order #: <Text type="defaultSemiBold">{order.orderNumber}</Text>
               </Text>
               <Text>
                  Order Date: <Text type="defaultSemiBold">{format(order.orderDate, 'PPpp')}</Text>
               </Text>

               <Text>
                  Order Status: <Text type="defaultSemiBold">{orderNameSwitch(order.status)}</Text>
               </Text>
               <Text>
                  Delivered On:{' '}
                  <Text type="defaultSemiBold">{format(order.deliveredOn!, 'PPpp')}</Text>
               </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
               <Text type="title">${order.total.toFixed(2)}</Text>
               <TouchableOpacity
                  onPress={() =>
                     router.push({
                        pathname: '/order',
                        params: { orderId: order.id }
                     })
                  }
                  style={styles.btn}>
                  <Text type="defaultSemiBold">View Order</Text>
               </TouchableOpacity>
            </View>
         </View>
      )
   }

   if (loading) return <Loading />
   return (
      <Container>
         <View style={{ flex: 1, padding: SIZES.md }}>
            <Text>ID:{courierId}</Text>
            <View style={styles.card}>
               <Row containerStyle={{ gap: SIZES.lg }}>
                  <View style={styles.imageContainer}>
                     <Image source={courier?.image} style={styles.image} />
                  </View>

                  <View style={{ minWidth: SIZES.width * 0.3 }}>
                     <Text type="title">
                        {courier?.name} {courier?.lastName}
                     </Text>
                     <View style={{ gap: SIZES.sm * 0.5 }}>
                        <Text>{courier?.email}</Text>
                        <Text>{courier?.phone}</Text>
                        <PhoneCall phone={courier?.phone!} size={50} />
                     </View>
                  </View>
               </Row>
               <View style={{ flex: 1 }}>
                  {courier?.coords && (
                     <AnimatedRestaurantMap
                        containerStyle={{ height: '100%' }}
                        restaurant={{
                           latitude: courier?.coords?.latitude,
                           longitude: courier.coords?.longitude,
                           name: courier?.name,
                           description: ''
                        }}
                     />
                  )}
               </View>
            </View>
            <View style={styles.container}>
               <FlashList
                  data={orders}
                  contentContainerStyle={{
                     paddingTop: SIZES.lg
                  }}
                  ListHeaderComponent={
                     <Row
                        containerStyle={{
                           marginBottom: SIZES.sm,
                           justifyContent: 'center',
                           gap: SIZES.sm - 4
                        }}>
                        <Text center type="defaultSemiBold">
                           {courier?.name}'s Deliveries
                        </Text>
                        <Text type="subtitle">({orders.length})</Text>
                     </Row>
                  }
                  estimatedItemSize={80}
                  renderItem={({ item }) => renderItem(item)}
               />
            </View>
         </View>
      </Container>
   )
}

export default CourierDetails

const styles = StyleSheet.create({
   container: {
      flex: 1
   },
   image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
   },
   card: {
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: 10,
      padding: SIZES.md,
      gap: SIZES.lg,
      marginVertical: SIZES.md,
      height: SIZES.height * 0.2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
   },
   imageContainer: {
      width: 180,
      height: 180,
      borderRadius: 180 / 2,
      overflow: 'hidden'
   },
   hero: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: SIZES.md,
      boxShadow: '0px 2px 4px 1px rgba(0, 0, 0, 0.1)',
      borderRadius: SIZES.sm,
      marginBottom: SIZES.sm,
      gap: SIZES.md
   },
   btn: {
      padding: SIZES.sm,
      borderRadius: SIZES.sm,
      boxShadow: '0px 2px 4px 1px rgba(0, 0, 0, 0.1)',
      marginTop: SIZES.lg,
      paddingHorizontal: SIZES.lg
   }
})
