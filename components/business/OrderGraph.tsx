import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Order } from '@/typing'
import { getRandomColor } from '@/utils/getRandomColor'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import dayjs from 'dayjs'
import React, { useMemo, useState } from 'react'
import { BarChart } from 'react-native-gifted-charts'
import NeoView from '../NeoView'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import { ScrollView, useWindowDimensions } from 'react-native'

interface GraphComponentProps {
   orders: Order[]
}

type filter = 'thisWeek' | 'lastWeek' | 'monthToDate' | 'yearToDate' | 'today'

const GraphComponent: React.FC<GraphComponentProps> = ({ orders }) => {
   const ascentColor = useThemeColor('ascent')
   const textColor = useThemeColor('text')
   const [filter, setFilter] = useState<filter>('thisWeek')
   const { width, height } = useWindowDimensions()
   const [selectedIndex, setSelectedIndex] = useState(1)

   const colors = useMemo(() => {
      return [
         getRandomColor(),
         getRandomColor(),
         getRandomColor(),
         getRandomColor(),
         getRandomColor()
      ]
   }, [])
   const title =
      selectedIndex === 0
         ? 'Last Week'
         : selectedIndex === 1
           ? 'Today'
           : selectedIndex === 2
             ? 'This Week'
             : selectedIndex === 3
               ? 'Month To Date'
               : 'Year To Date'
   const days =
      (selectedIndex === 0 || selectedIndex) === 1
         ? 'ddd'
         : selectedIndex === 2
           ? 'MMM'
           : selectedIndex === 3
             ? 'YYYY'
             : 'ddd'

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

      const groupedData = filteredOrders.reduce(
         (acc, order) => {
            const dateLabel = dayjs(order.orderDate).format(days)
            if (!acc[dateLabel]) {
               acc[dateLabel] = 0
            }
            acc[dateLabel] += order.total
            return acc
         },
         {} as Record<string, number>
      )

      const ordersData = Object.entries(groupedData).map(([label, total]) => ({
         value: total,
         label,
         frontColor: getRandomColor()
      }))

      const products = filteredOrders.reduce(
         (acc, order) => {
            order.items.forEach((item) => {
               if (!acc[item.name]) {
                  acc[item.name] = 0
               }
               acc[item.name] += item.quantity
            })
            return acc
         },
         {} as Record<string, number>
      )

      const productsData = Object.entries(products)
         .map(([name, totalQuantity], index) => ({
            value: totalQuantity,
            label: name,
            frontColor: colors[index]
         }))
         .sort((a, b) => (b.value > a.value ? 1 : -1))
         .slice(0, 5)

      return { ordersData, productsData }
   }

   const { productsData, ordersData } = filterData(orders, filter)

   return (
      <ScrollView
         contentContainerStyle={{ padding: SIZES.md, gap: SIZES.md }}
         showsVerticalScrollIndicator={false}>
         <View style={{ width: '60%', alignSelf: 'center', marginVertical: SIZES.md }}>
            <SegmentedControl
               values={['LW', 'Today', 'This Week', 'MTD', 'YTD']}
               selectedIndex={selectedIndex}
               activeFontStyle={{
                  color: '#212121'
               }}
               fontStyle={{
                  color: textColor
               }}
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
         <NeoView
            innerStyleContainer={{ borderRadius: SIZES.lg }}
            containerStyle={{ borderRadius: SIZES.lg }}>
            <Text type="header" center>
               {title}
            </Text>
            <View style={{ padding: SIZES.md, flex: 1 }}>
               <BarChart
                  key={selectedIndex}
                  data={ordersData}
                  width={width * 0.8}
                  isAnimated
                  height={height * 0.3}
                  barBorderRadius={4}
                  adjustToWidth
                  animationDuration={300}
                  yAxisLabelPrefix="$"
                  yAxisColor={ascentColor}
                  xAxisColor={ascentColor}
                  frontColor={ascentColor}
                  xAxisLabelTextStyle={{ color: textColor, fontWeight: '700' }}
                  yAxisTextStyle={{ color: textColor }}
               />
            </View>
         </NeoView>
         <NeoView
            innerStyleContainer={{ borderRadius: SIZES.lg }}
            containerStyle={{ borderRadius: SIZES.lg }}>
            <View style={{ padding: SIZES.md }}>
               <Text type="header" center>
                  5 Top Products
               </Text>
               <BarChart
                  key={selectedIndex}
                  data={productsData}
                  width={width * 0.8}
                  isAnimated
                  height={height * 0.3}
                  barBorderRadius={4}
                  adjustToWidth
                  animationDuration={300}
                  yAxisColor={ascentColor}
                  xAxisColor={ascentColor}
                  frontColor={ascentColor}
                  xAxisLabelTextStyle={{ color: textColor, fontWeight: '700' }}
                  yAxisTextStyle={{ color: textColor }}
               />
            </View>
         </NeoView>
      </ScrollView>
   )
}

export default GraphComponent
