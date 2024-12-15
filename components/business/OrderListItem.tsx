/* eslint-disable @typescript-eslint/no-require-imports */
import { SIZES } from '@/constants/Colors'
import { Order, ORDER_TYPE } from '@/shared/types'
import { dayjsFormat } from '@/utils/dayjs'
import { STATUS_NAME } from '@/utils/orderStatus'
import { statusColor } from '@/utils/statusColor'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { TouchableOpacity } from 'react-native'

import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import NeumorphismView from '../NeumorphismView'

type Props = {
   item: Order
}

const OrderListItem = ({ item }: Props) => {
   const textColor = useThemeColor('text')
   return (
      <View
         style={{
            flex: 1,
            margin: SIZES.sm,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            borderRadius: SIZES.md
         }}>
         <NeumorphismView>
            <TouchableOpacity
               style={{ padding: SIZES.sm, gap: 4 }}
               onPress={() =>
                  router.push({
                     pathname: '/order',
                     params: { orderId: item.id }
                  })
               }>
               <Row containerStyle={{ width: '100%' }} align="between">
                  <Text>Order # {item.orderNumber}</Text>
                  <Text>Items: {item.items.reduce((curr, acc) => curr + acc.quantity, 0)}</Text>
                  <Text style={{ marginRight: SIZES.lg }}>Total: ${item.total.toFixed(2)}</Text>
               </Row>

               <Text>{dayjsFormat(item.orderDate).format('LLL')}</Text>
               <Row align="between">
                  <Text type="defaultSemiBold">Status: {STATUS_NAME(item.status)}</Text>

                  {item.orderType === ORDER_TYPE.delivery ? (
                     <Image
                        source={require('@/assets/images/delivery.png')}
                        style={{ width: 40, height: 40, tintColor: textColor }}
                     />
                  ) : (
                     <Image
                        source={require('@/assets/images/walking.png')}
                        style={{ width: 40, height: 40, tintColor: textColor }}
                     />
                  )}
               </Row>
            </TouchableOpacity>
         </NeumorphismView>
         <View
            style={{
               width: SIZES.md,
               backgroundColor: statusColor(item.status),
               height: '100%',
               borderTopRightRadius: SIZES.md,
               borderBottomRightRadius: SIZES.md
            }}
         />
      </View>
   )
}

export default OrderListItem
