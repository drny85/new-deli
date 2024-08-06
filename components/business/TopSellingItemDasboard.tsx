import { FlashList } from '@shopify/flash-list'
import NeoView from '../NeoView'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import { Image } from 'expo-image'
import Row from '../Row'
import { SIZES } from '@/constants/Colors'
import { Order } from '@/typing'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import useOrientation from '@/hooks/useOrientation'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { useThemeColor } from '@/hooks/useThemeColor'

type Props = {
   orders: Order[]
}
type filter = 'thisWeek' | 'lastWeek' | 'monthToDate' | 'yearToDate' | 'today'

const TopSellingItemDashboard = ({ orders }: Props) => {
   const [selectedIndex, setSelectedIndex] = useState(1)
   const [filter, setFilter] = useState<filter>('thisWeek')
   const orientation = useOrientation()
   const textColor = useThemeColor('text')

   const filterData = (orders: Order[], filter: string) => {
      const now = dayjs()
      let startDate

      switch (filter) {
         case 'thisWeek':
            startDate = now.startOf('week')
            break
         case 'lastWeek':
            startDate = now.subtract(1, 'week').startOf('week')
            break
         case 'monthToDate':
            startDate = now.startOf('month')
            break
         case 'yearToDate':
            startDate = now.startOf('year')
            break
         case 'today':
            startDate = now.startOf('day')
            break
         default:
            startDate = now.startOf('year')
      }

      const filteredOrders = orders.filter(
         (order) =>
            dayjs(order.orderDate).isAfter(startDate) || dayjs(order.orderDate).isSame(startDate)
      )
      const topSelling = filteredOrders.reduce(
         (acc, order) => {
            order.items.forEach((item) => {
               if (!acc[item.name]) {
                  acc[item.name] = { quantity: 0, image: item.image!, id: item.id! }
               }
               acc[item.name].quantity += item.quantity
            })
            return acc
         },
         {} as Record<string, { quantity: number; image: string; id: string }>
      )

      const topSeelingArray = Object.entries(topSelling).map(([name, { quantity, image, id }]) => ({
         name,
         quantity,
         image,
         id
      }))

      return topSeelingArray
   }

   const data = filterData(orders, filter).sort((a, b) => b.quantity - a.quantity)

   useEffect(() => {
      if (selectedIndex === 1) {
         setFilter('thisWeek')
         filterData(orders, 'thisWeek')
      }
   }, [selectedIndex])

   return (
      <NeoView
         innerStyleContainer={{ borderRadius: SIZES.lg, padding: SIZES.md }}
         containerStyle={{ borderRadius: SIZES.lg }}>
         <View>
            <Text center type="header">
               Top Selling Items
            </Text>
            <FlashList
               key={orientation}
               estimatedItemSize={300}
               scrollEnabled={false}
               ListHeaderComponent={
                  <View style={{ width: '75%', alignSelf: 'center', marginVertical: SIZES.md }}>
                     <SegmentedControl
                        values={['LW', 'Today', 'This Week', 'MTD', 'YTD']}
                        selectedIndex={selectedIndex}
                        activeFontStyle={{
                           fontSize: 18,
                           fontFamily: 'Montserrat-Bold',
                           color: '#212121'
                        }}
                        fontStyle={{ fontSize: 16, fontFamily: 'Montserrat', color: textColor }}
                        onChange={(e) => {
                           const index = e.nativeEvent.selectedSegmentIndex
                           setSelectedIndex(index)

                           switch (index) {
                              case 0:
                                 setFilter('lastWeek')
                                 return filterData(orders, 'lastWeek')
                              case 1:
                                 setFilter('today')
                                 return filterData(orders, 'today')
                              case 2:
                                 setFilter('thisWeek')
                                 return filterData(orders, 'thisWeek')
                              case 3:
                                 setFilter('monthToDate')
                                 return filterData(orders, 'monthToDate')
                              case 4:
                                 setFilter('yearToDate')
                                 return filterData(orders, 'yearToDate')
                           }
                        }}
                     />
                  </View>
               }
               ListEmptyComponent={
                  <View center style={{ padding: SIZES.lg * 2 }}>
                     <Text>No Data</Text>
                  </View>
               }
               contentContainerStyle={{ padding: SIZES.sm }}
               numColumns={2}
               data={data}
               renderItem={({ item }) => (
                  <TouchableOpacity
                     onPress={() =>
                        router.push({
                           pathname: '/product',
                           params: { productId: item.id }
                        })
                     }>
                     <Row
                        align="between"
                        containerStyle={{ gap: SIZES.lg, marginVertical: SIZES.sm }}>
                        <Image
                           style={{ width: 60, height: 60, borderRadius: 30 }}
                           source={item.image}
                        />
                        <Text>{item.name}</Text>
                        <Text>{item.quantity}</Text>
                     </Row>
                  </TouchableOpacity>
               )}
            />
         </View>
      </NeoView>
   )
}

export default TopSellingItemDashboard
