import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Filter, Order } from '@/typing'
import { getRandomColor } from '@/utils/getRandomColor'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useState } from 'react'
import { ColorValue, ScrollView, StyleSheet } from 'react-native'
import { PieChart, pieDataItem } from 'react-native-gifted-charts'
import Animated from 'react-native-reanimated'
import { filterDataForGraph } from '../charts'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import useOrientation from '@/hooks/useOrientation'

interface GraphComponentProps {
   orders: Order[]
}

const SIZE = SIZES.width / 6 / 2.5

const GraphComponent: React.FC<GraphComponentProps> = ({ orders }) => {
   const textColor = useThemeColor('text')
   const [filter, setFilter] = useState<Filter>('thisWeek')

   const [selectedIndex, setSelectedIndex] = useState(1)

   const title =
      selectedIndex === 0
         ? 'Last Week'
         : selectedIndex === 1
           ? 'Today'
           : selectedIndex === 2
             ? 'This Week'
             : selectedIndex === 3
               ? 'Month To Date'
               : selectedIndex === 4
                 ? 'Year To Date'
                 : 'All Time'

   const transformDataForPieChart = (values: any[]): pieDataItem[] => {
      // Determine the maximum value in categorized data for the "focused" property
      const maxValue = Math.max(...values?.map(({ value }) => value), 0)

      return values.map(({ label, value }) => ({
         value,
         color: getRandomColor(), // Generate random colors for the chart
         text: label, // Use category (e.g., Morning, Afternoon, etc.) as text
         focused: value === maxValue

         // Mark the highest value as focused
      }))
   }

   const { productsData, ordersData } = filterDataForGraph(orders, filter)
   const data = transformDataForPieChart(productsData)
   const dataB = transformDataForPieChart(ordersData)
   console.log(JSON.stringify(data, null, 2))
   const orientation = useOrientation()

   return (
      <View style={{ flex: 1 }}>
         <View style={{ width: '80%', alignSelf: 'center', marginVertical: SIZES.md }}>
            <SegmentedControl
               values={['LW', 'Today', 'This Week', 'MTD', 'YTD', 'ALL']}
               selectedIndex={selectedIndex}
               activeFontStyle={{
                  color: '#212121',
                  fontSize: 18
               }}
               fontStyle={{
                  color: textColor,
                  fontSize: 16
               }}
               style={{ height: 36 }}
               onChange={(e) => {
                  const index = e.nativeEvent.selectedSegmentIndex
                  setSelectedIndex(index)
                  setFilter(
                     index === 0
                        ? 'lastWeek'
                        : index === 1
                          ? 'today'
                          : index === 2
                            ? 'thisWeek'
                            : index === 3
                              ? 'monthToDate'
                              : index === 4
                                ? 'yearToDate'
                                : 'all'
                  )
               }}
            />
         </View>
         <ScrollView
            horizontal={orientation === 'landscape'}
            contentContainerStyle={{ padding: SIZES.md, gap: SIZES.md, width: '100%' }}
            showsVerticalScrollIndicator={false}>
            <View
               style={{
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: SIZES.lg,
                  padding: SIZES.md,
                  gap: SIZES.md,
                  justifyContent: 'center',
                  alignItems: 'center',

                  width: orientation === 'landscape' ? '50%' : '100%'
               }}>
               <Text
                  type="header"
                  style={{ textAlign: 'center', fontSize: 26, marginBottom: SIZES.lg }}>
                  {title}
               </Text>

               <Row
                  containerStyle={{
                     width: orientation === 'landscape' ? '100%' : '70%',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     alignSelf: 'center'
                  }}>
                  <PieChart
                     data={dataB}
                     donut
                     innerRadius={SIZE}
                     radius={SIZE * 2}
                     focusOnPress
                     sectionAutoFocus
                     pieInnerComponentHeight={20}
                     isAnimated
                     showText
                     textColor="#FFFFFF"
                     centerLabelComponent={() => {
                        return (
                           <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <Text type="header" center fontSize="medium">
                                 {title}
                              </Text>
                           </View>
                        )
                     }}
                  />
                  {dataB.length > 0 && (
                     <Animated.View style={[styles.legendContainer]}>
                        {dataB.map((item, index) => (
                           <Animated.View key={index} style={[styles.legendItem]}>
                              {renderDot(item.color!)}
                              <Row containerStyle={{ gap: 4 }}>
                                 <Text style={[styles.centerLabel, { fontWeight: '500' }]}>
                                    ${item.value.toFixed(2)}
                                    <Text style={{ fontWeight: 'condensed' }}> - {item.text}</Text>
                                 </Text>
                              </Row>
                           </Animated.View>
                        ))}
                     </Animated.View>
                  )}
               </Row>
            </View>
            <View
               style={{
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                  borderRadius: SIZES.lg,
                  padding: SIZES.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: SIZES.md,
                  width: orientation === 'landscape' ? '50%' : '100%'
               }}>
               <Text
                  type="header"
                  style={{ textAlign: 'center', fontSize: 26, marginBottom: SIZES.lg }}>
                  5 Tops Products Sold
               </Text>
               <Row
                  containerStyle={{
                     width: orientation === 'landscape' ? '100%' : '70%',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     alignSelf: 'center'
                  }}>
                  <PieChart
                     data={data}
                     donut
                     innerRadius={SIZE}
                     radius={SIZE * 2}
                     focusOnPress
                     sectionAutoFocus
                     pieInnerComponentHeight={20}
                     isAnimated
                     centerLabelComponent={() => {
                        return (
                           <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                              <Text type="header" center fontSize="medium">
                                 {title}
                              </Text>
                           </View>
                        )
                     }}
                  />
                  {data.length > 0 && (
                     <Animated.View style={[styles.legendContainer]}>
                        {data.map((item, index) => (
                           <Animated.View key={index} style={[styles.legendItem]}>
                              {renderDot(item.color!)}
                              <Row containerStyle={{ gap: 4 }}>
                                 <Text style={styles.centerLabel}>{item.value}</Text>
                                 <Text style={[styles.centerLabel, { fontWeight: 'condensed' }]}>
                                    {item.text}
                                 </Text>
                              </Row>
                           </Animated.View>
                        ))}
                     </Animated.View>
                  )}
               </Row>
            </View>
            {/* <NeoView
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
         </NeoView> */}
         </ScrollView>
      </View>
   )
}

export default GraphComponent

const renderDot = (color: ColorValue) => {
   return (
      <View
         style={{ backgroundColor: color, height: 10, width: 10, borderRadius: 5, marginRight: 8 }}
      />
   )
}

const styles = StyleSheet.create({
   legendContainer: {
      alignItems: 'center',
      paddingVertical: SIZES.sm
   },
   legendItem: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginVertical: 4,
      width: '100%'
   },
   dot: {
      height: 10,
      width: 10,
      borderRadius: 5,
      marginRight: 6
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16
   },
   buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 16
   },
   centerLabel: {
      fontSize: 16,
      fontWeight: 'bold'
   }
})
