import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { Container } from '@/components/Container'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { Text } from '@/components/ThemedText'
import { SIZES } from '@/constants/Colors'
import { FlashList } from '@shopify/flash-list'
import { Order } from '@/shared/types'
import { format } from 'date-fns'
import { orderNameSwitch } from '@/utils/orderNameSwitch'
import Row from '@/components/Row'

type ParamsProps = {
   customerId: string
}

const CustomerView = () => {
   const { customerId } = useLocalSearchParams<ParamsProps>()
   const orders = useBusinessOrdersStore((state) => state.orders)
   const customerOrders = orders.filter((o) => o.contactPerson.userId === customerId)
   const customer = customerOrders[0].contactPerson

   const renderOrder = (order: Order) => (
      <View
         style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: SIZES.md,
            boxShadow: '0px 2px 4px 1px rgba(0, 0, 0, 0.1)',
            borderRadius: SIZES.sm,
            marginBottom: SIZES.sm,
            gap: SIZES.md
         }}>
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
               style={{
                  padding: SIZES.sm,
                  borderRadius: SIZES.sm,
                  boxShadow: '0px 2px 4px 1px rgba(0, 0, 0, 0.1)',
                  marginTop: SIZES.lg,
                  paddingHorizontal: SIZES.lg
               }}>
               <Text type="defaultSemiBold">View Order</Text>
            </TouchableOpacity>
         </View>
      </View>
   )
   return (
      <Container>
         <View style={{ flex: 1, padding: 20 }}>
            <View
               style={{
                  gap: SIZES.sm,
                  boxShadow: '1px 2px 4px 3px rgba(0,0,0,0.1)',
                  padding: SIZES.md,
                  borderRadius: SIZES.sm
               }}>
               <Text type="title">Customer Details</Text>
               <Text>
                  Name:{' '}
                  <Text type="defaultSemiBold">
                     {customer.name} {customer.lastName}
                  </Text>
               </Text>
               <Text>
                  Phone: <Text type="defaultSemiBold">{customer.phone}</Text>
               </Text>
            </View>
            <FlashList
               data={customerOrders}
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
                        Customer's Orders
                     </Text>
                     <Text type="subtitle">({customerOrders.length})</Text>
                  </Row>
               }
               estimatedItemSize={80}
               renderItem={({ item }) => renderOrder(item)}
            />
         </View>
      </Container>
   )
}

export default CustomerView
