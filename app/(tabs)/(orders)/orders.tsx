import Button from '@/components/Button'
import { Container } from '@/components/Container'
import OrderListItem from '@/components/orders/OrderListItem'
import OrdersSkelenton from '@/components/skeletons/OrdersSkeleton'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useOrders } from '@/hooks/orders/useOrders'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { useRestaurantsStore } from '@/stores/restaurantsStore'

import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { FlashList } from '@shopify/flash-list'
import { router } from 'expo-router'
import { useMemo, useState } from 'react'
import { SectionList } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

const INDEX = ['All', 'By Restaurant']

const Orders = () => {
   const backgroundColor = useThemeColor('background')
   const { user } = useAuth()
   const ascent = useThemeColor('ascent')
   const [selectedIndex, setSelectedIndex] = useState(0)
   const { loading, orders } = useOrders()
   const restaurants = useRestaurantsStore((s) =>
      s.restaurants.filter((r) => orders.some((o) => o.businessId === r.id))
   )

   const sectionListOrderData = useMemo(() => {
      const data = restaurants.map((restaurant) => ({
         title: restaurant.name,
         data: orders
            .filter((order) => order.businessId === restaurant.id)
            .sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1))
      }))

      return data
   }, [orders, restaurants])

   if (loading) return <OrdersSkelenton />

   if (!user)
      return (
         <Container>
            <View center>
               <Text type="muted">Please Login to see your orders</Text>
               <View style={{ marginTop: SIZES.lg, width: '60%' }}>
                  <Button
                     title="Login"
                     contentTextStyle={{ color: '#ffffff' }}
                     onPress={() =>
                        router.push({
                           pathname: '/login',
                           params: { returnUrl: '/(tabs)/(orders)/orders' }
                        })
                     }
                  />
               </View>
            </View>
         </Container>
      )

   if (orders.length === 0)
      return (
         <Container>
            <View center style={{ gap: 60 }}>
               <Text type="title">No Orders</Text>
               <Button
                  onPress={() =>
                     router.push({ pathname: '/favorite-search', params: { from: 'orders' } })
                  }
                  title="Place My First Order"
                  contentTextStyle={{ paddingHorizontal: SIZES.lg, color: '#ffffff' }}
               />
            </View>
         </Container>
      )

   return (
      <Container>
         {orders.length > 0 && (
            <SegmentedControl
               values={INDEX}
               fontStyle={{ fontSize: 16 }}
               tintColor={ascent}
               activeFontStyle={{ color: '#ffffff', fontWeight: '700', fontSize: 18 }}
               style={{ backgroundColor, height: 40, width: '70%', alignSelf: 'center' }}
               selectedIndex={selectedIndex}
               onChange={(event) => {
                  setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
               }}
            />
         )}
         <View style={{ flex: 1, marginTop: SIZES.lg }}>
            {selectedIndex === 1 ? (
               <Animated.View entering={FadeIn.duration(700)}>
                  <SectionList
                     keyExtractor={(item) => item.id!}
                     renderSectionHeader={({ section: { title } }) => (
                        <View style={{ backgroundColor, padding: SIZES.sm }}>
                           <Text type="title">{title}</Text>
                        </View>
                     )}
                     showsVerticalScrollIndicator={false}
                     sections={sectionListOrderData}
                     renderItem={({ item }) => (
                        <OrderListItem
                           order={item}
                           onPress={() => {
                              router.push({
                                 pathname: '/order/[orderId]',
                                 params: { orderId: item.id!, showDetails: 'yes' }
                              })
                           }}
                        />
                     )}
                  />
               </Animated.View>
            ) : (
               <FlashList
                  showsVerticalScrollIndicator={false}
                  data={orders}
                  estimatedItemSize={420}
                  renderItem={({ item }) => (
                     <OrderListItem
                        order={item}
                        onPress={() => {
                           router.push({
                              pathname: '/order/[orderId]',
                              params: { orderId: item.id!, showDetails: 'yes' }
                           })
                        }}
                     />
                  )}
               />
            )}
         </View>
      </Container>
   )
}

export default Orders
