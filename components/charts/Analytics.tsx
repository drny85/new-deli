/* eslint-disable no-unsafe-optional-chaining */
import { SIZES } from '@/constants/Colors'
import { FilterData, sortByMonths, sortByWeekdays } from '@/helpers/charts'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FilterDay, Order } from '@/shared/types'
import { getRandomColor } from '@/utils/getRandomColor'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useState } from 'react'
import { ColorValue, Dimensions, ScrollView, StyleSheet } from 'react-native'
import { LineChart, PieChart } from 'react-native-gifted-charts'
import Animated from 'react-native-reanimated'
import { filterOrdersByTime } from '../charts'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import NeumorphismView from '../NeumorphismView'

interface GraphComponentProps {
   orders: Order[]
}
const SCREEN_WIDTH = Dimensions.get('window').width
const SIZE = SIZES.width / 6 / 2

const Analytics: React.FC<GraphComponentProps> = ({ orders }) => {
   const textColor = useThemeColor('text')
   const ascentColor = useThemeColor('ascent')
   const [filter, setFilter] = useState<FilterDay>('timeOfDay')

   const [selectedIndex, setSelectedIndex] = useState(0)

   const title =
      selectedIndex === 0
         ? 'Time of Day'
         : selectedIndex === 1
           ? 'Day of The Week'
           : selectedIndex === 2
             ? 'By Month'
             : selectedIndex === 3
               ? 'By Year'
               : ''

   const transformDataForPieChart = (values: FilterData[]): FilterData[] => {
      // Determine the maximum value in categorized data for the "focused" property
      if (!values) return []
      const maxValue = Math.max(...values?.map(({ value }) => value), 0)

      return values.map(({ label, value }) => ({
         value,
         color: getRandomColor(), // Generate random colors for the chart
         text: label || '', // Use category (e.g., Morning, Afternoon, etc.) as text
         focused: value === maxValue,
         label

         // Mark the highest value as focused
      }))
   }

   const data = filterOrdersByTime(orders, filter)
   const transformedData = transformDataForPieChart(data)
   const ordersGraph =
      filter === 'dayOfWeek'
         ? sortByWeekdays(transformedData)
         : filter === 'month'
           ? sortByMonths(transformedData)
           : transformedData
   const higherValueWIthLabel = ordersGraph
      .map((item) => ({ label: item.text, value: item.value }))
      .sort((a, b) => b.value - a.value)[0]

   return (
      <ScrollView
         style={{ flex: 1 }}
         showsVerticalScrollIndicator={false}
         contentContainerStyle={{ gap: SIZES.sm }}>
         <View style={{ width: '80%', alignSelf: 'center', marginVertical: SIZES.md }}>
            <SegmentedControl
               values={['Time of Day', 'Day of The Week', 'By Month', 'By Year']}
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
                        ? 'timeOfDay'
                        : index === 1
                          ? 'dayOfWeek'
                          : index === 2
                            ? 'month'
                            : index === 3
                              ? 'year'
                              : 'dayOfWeek'
                  )
               }}
            />
         </View>

         <View
            style={{
               boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
               borderRadius: SIZES.lg,
               padding: SIZES.md,
               gap: SIZES.md,
               justifyContent: 'center',
               alignItems: 'center',
               width: '100%'
            }}>
            <Text
               type="header"
               style={{ textAlign: 'center', fontSize: 26, marginBottom: SIZES.lg }}>
               {title}
            </Text>

            <Row
               containerStyle={{
                  width: '70%',
                  gap: SIZES.md,
                  alignItems: 'center',
                  alignSelf: 'center'
               }}>
               {ordersGraph.length === 0 ? (
                  <Text type="muted" center fontSize="large">
                     No orders
                  </Text>
               ) : (
                  <>
                     <PieChart
                        data={ordersGraph}
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

                     <Animated.View style={[styles.legendContainer]}>
                        {ordersGraph.map((item, index) => (
                           <Animated.View key={index} style={[styles.legendItem]}>
                              {renderDot(item.color!)}
                              <Row containerStyle={{ gap: SIZES.lg }}>
                                 <Text style={[styles.centerLabel, { fontWeight: 'condensed' }]}>
                                    {item.text}

                                    <Text style={{ fontWeight: '500' }}>
                                       {' '}
                                       - ${item.value.toFixed(2)}
                                    </Text>
                                 </Text>
                              </Row>
                           </Animated.View>
                        ))}
                     </Animated.View>
                  </>
               )}
            </Row>
            {higherValueWIthLabel && (
               <View style={{ marginVertical: SIZES.md }}>
                  <Text type="title">
                     {higherValueWIthLabel.label}{' '}
                     <Text type="default" style={{ fontWeight: 'condensed', fontSize: 20 }}>
                        has the most sales with
                     </Text>{' '}
                     ${higherValueWIthLabel.value.toFixed(2)}
                  </Text>
               </View>
            )}
         </View>
         <NeumorphismView
            borderRadius={SIZES.md}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
            <LineChart
               areaChart
               curved
               data={data}
               width={SCREEN_WIDTH * 0.9} // 90% of screen width
               height={SIZES.height * 0.25}
               spacing={(SCREEN_WIDTH * 0.9) / (data.length + 1)} // Equal spacing
               startFillColor={getRandomColor()}
               endFillColor={getRandomColor()}
               startOpacity={0.8}
               endOpacity={0.3}
               isAnimated
               xAxisTextNumberOfLines={2}
               xAxisLabelTextStyle={{
                  color: textColor,
                  fontSize: 12,
                  fontWeight: '600',
                  textAlign: 'center'
               }}
               xAxisLabelsVerticalShift={4}
               yAxisTextStyle={{
                  color: textColor,
                  fontSize: 12,
                  fontWeight: '600'
               }}
               initialSpacing={filter === 'timeOfDay' ? 30 : 20}
               yAxisLabelPrefix="$"
               adjustToWidth
               color={ascentColor}
               noOfSections={6}
               xAxisThickness={2}
               yAxisThickness={2}
            />
         </NeumorphismView>
      </ScrollView>
   )
}

export default Analytics

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
