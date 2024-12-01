import { Colors, SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ORDER_STATUS, ORDER_TYPE, statusListForDelivery, statusListForPickup } from '@/typing'
import { orderNameSwitch } from '@/utils/orderNameSwitch'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import NeoView from './NeoView'
import { View } from './ThemedView'
import { Text } from './ThemedText'
import { dayjsFormat } from '@/utils/dayjs'
import Row from './Row'

const ICON_SIZE = 48

const SubtitleForDelivery: { [key: string]: string } = {
   Processing: 'Your order is on the making',
   OutForDelivery: 'Your order is out for delivery',
   Delivered: 'Your order has been delivered',
   OrderReceived: 'Your order has been received',
   AcceptedByCourier: 'Your order has been accepted by courier',
   PickedByCourier: 'Your order has been picked by courier',
   ReadyForDelivery: 'Your order is ready for delivery'
}

const SubtitleForPickup: { [key: string]: string } = {
   OrderReceived: 'Your order has been received',
   Processing: 'Your order is on the making',
   ReadyForPickUp: 'Your order is ready for pickup',
   PickedUp: 'Your order has been picked'
}

const OrderProgress: React.FC<{
   status: ORDER_STATUS
   orderType: ORDER_TYPE
   orderDate: string
   eta: number
   onRefresh: () => void
}> = ({ status, orderType, eta, onRefresh }) => {
   const [currentStatus, setCurrentStatus] = useState<number>(0)
   const ascent = useThemeColor('ascent')
   const backgroundColor = useThemeColor('background')

   const statusList =
      orderType === ORDER_TYPE.delivery ? statusListForDelivery : statusListForPickup

   const Subtitle = orderType === ORDER_TYPE.delivery ? SubtitleForDelivery : SubtitleForPickup

   const etaTime = useMemo(
      () =>
         dayjsFormat()
            .add(eta || 10, 'minutes')
            .format('LT'),
      [eta]
   )

   useEffect(() => {
      if (!status) return
      const index = statusList.findIndex((s) => {
         return removeSpaces(s) === orderNameSwitch(status)
      })

      setCurrentStatus(index)
   }, [status, orderType])

   const renderStatus = () => {
      return statusList.map((orderStatus, index) => {
         return (
            <View key={orderStatus}>
               <View style={[styles.statusItem, { backgroundColor }]}>
                  <Ionicons
                     name="checkmark-circle"
                     size={ICON_SIZE}
                     color={index <= currentStatus ? ascent : 'gray'}
                  />
                  <View style={{ justifyContent: 'flex-start', marginLeft: 10, padding: SIZES.sm }}>
                     <Text
                        style={[
                           styles.statusText,
                           {
                              color: index <= currentStatus ? ascent : 'gray',
                              fontWeight: index <= currentStatus ? '700' : 'normal'
                           }
                        ]}>
                        {orderStatus}
                     </Text>
                     <Text type={index <= currentStatus ? 'default' : 'muted'}>
                        {Subtitle[removeSpaces(orderStatus)]}
                     </Text>
                  </View>
               </View>
               {index < statusList.length - 1 && (
                  <View>
                     {index < currentStatus && (
                        <View
                           style={{
                              width: 4,
                              backgroundColor: index <= currentStatus ? ascent : 'gray',
                              height: 50,
                              zIndex: -1,
                              marginLeft: ICON_SIZE * 0.45
                           }}
                        />
                     )}
                     {index >= currentStatus && (
                        <View
                           style={{
                              width: 4,
                              backgroundColor: index <= currentStatus ? Colors.dark.ascent : 'gray',
                              borderWidth: 2,
                              height: 50,
                              borderStyle: 'dashed',
                              borderColor: 'gray',

                              zIndex: -1,
                              marginLeft: ICON_SIZE * 0.45
                           }}
                        />
                     )}
                  </View>
               )}
            </View>
         )
      })
   }

   return (
      <View style={[styles.container]}>
         {status !== ORDER_STATUS.delivered && (
            <View style={styles.eta}>
               <Text style={styles.etaTitle}>
                  {orderType === ORDER_TYPE.delivery
                     ? 'Estimated Delivery'
                     : 'Estimated Pick-up Time'}
               </Text>
               <Row containerStyle={{ gap: 16 }}>
                  <NeoView
                     innerStyleContainer={{
                        borderRadius: SIZES.lg * 2,
                        paddingHorizontal: SIZES.sm,
                        paddingVertical: SIZES.sm * 0.5
                     }}
                     containerStyle={{ borderRadius: SIZES.lg * 2 }}>
                     <Text style={[styles.eatTime]}>{etaTime}</Text>
                  </NeoView>
                  <TouchableOpacity onPress={onRefresh}>
                     <FontAwesome name="refresh" size={26} color={ascent} />
                  </TouchableOpacity>
               </Row>
            </View>
         )}
         <View style={[styles.main, { backgroundColor }]}>{renderStatus()}</View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      //flex: 1,
      padding: SIZES.sm
   },
   main: {
      padding: SIZES.sm,
      borderRadius: SIZES.lg,
      marginTop: SIZES.lg
   },
   statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
   },
   statusText: {
      fontSize: 18
   },

   eta: { justifyContent: 'center', alignItems: 'center', marginVertical: SIZES.lg, gap: SIZES.sm },
   etaTitle: { fontSize: 18, fontWeight: '700', color: 'gray' },
   eatTime: {
      fontSize: 20,
      fontWeight: '700'
   }
})

export default OrderProgress

function removeSpaces(str: string): string {
   return str.replace(/\s/g, '')
}
