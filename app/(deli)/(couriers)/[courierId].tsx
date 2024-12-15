import { updateBusinessCourier } from '@/actions/business'
import AnimatedRestaurantMap from '@/components/checkout/AnimatedRestaurantMap'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import PhoneCall from '@/components/PhoneCall'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useCourier } from '@/hooks/couriers/useCourier'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { Order, ORDER_STATUS } from '@/shared/types'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { orderNameSwitch } from '@/utils/orderNameSwitch'
import { Feather, Foundation } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { format } from 'date-fns'
import { Image } from 'expo-image'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'
import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { toast } from 'sonner-native'

type ParamsProps = {
   courierId: string
   back?: string
}
const CourierDetails = () => {
   const navigation = useNavigation()
   const { courierId, back } = useLocalSearchParams<ParamsProps>()
   const { courier, loading } = useCourier(courierId!)
   const orders = useBusinessOrdersStore((state) =>
      state.orders.filter((o) => o.status === ORDER_STATUS.delivered && o.courier?.id === courierId)
   )
   const { restaurant } = useRestaurant(orders[0].businessId)

   const isActive = restaurant?.couriers.map((c) => c.active && c.id).includes(courierId)

   const handleDeactiveCourier = async () => {
      try {
         if (!restaurant) return
         Alert.alert('Are you sure?', 'This action cannot be undone', [
            {
               text: 'Cancel',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel'
            },
            {
               text: 'OK',
               style: 'destructive',
               onPress: async () => {
                  const updated = await updateBusinessCourier(courierId, restaurant.id!)
                  console.log(updated)
                  if (updated) {
                     toast.success('Deactivated', {
                        description: 'Courier Deactivated',
                        duration: 2000,
                        position: 'top-center'
                     })
                     // toastMessage({
                     //    title: 'Success',
                     //    message: 'Courier Deactivated',
                     //    preset: 'done'
                     // })
                  }
               }
            }
         ])
      } catch (error) {
         console.log(error)
      }
   }

   useLayoutEffect(() => {
      if (!back) return
      navigation.setOptions({
         headerLeft: () => {
            return (
               <TouchableOpacity onPress={() => router.dismiss()} style={{ padding: 10 }}>
                  <Feather name="chevron-left" size={28} />
               </TouchableOpacity>
            )
         }
      })
   }, [back])

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
                  style={[styles.btn, { marginTop: 20 }]}>
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
            <Row containerStyle={{ justifyContent: 'space-between', alignItems: 'center' }}>
               <Text>ID:{courierId}</Text>
               <Text style={{ fontSize: 20, fontWeight: '600', color: isActive ? 'green' : 'red' }}>
                  {isActive ? 'Active' : 'Inactive'}
               </Text>
               <TouchableOpacity style={styles.btn} onPress={handleDeactiveCourier}>
                  <Row containerStyle={{ gap: 10 }}>
                     <Foundation name="prohibited" size={24} color="orange" />
                     <Text>{isActive ? 'De-Activate' : 'Re-Activate'}</Text>
                  </Row>
               </TouchableOpacity>
            </Row>
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

      paddingHorizontal: SIZES.lg
   }
})
