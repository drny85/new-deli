import { Modal, TouchableOpacity } from 'react-native'

import { Container } from '../Container'
import { View } from '../ThemedView'
import { ORDER_STATUS, ORDER_TYPE } from '@/shared/types'
import { Text } from '../ThemedText'

type Props = {
   visible: boolean
   orderType: ORDER_TYPE
   onStatusChange: (newStatus: ORDER_STATUS) => void
}

const OrderStatusModal = ({ visible, orderType, onStatusChange }: Props) => {
   const selection =
      orderType === ORDER_TYPE.delivery
         ? ['in_progress', 'marked_ready_for_delivery']
         : ['in_progress', 'marked_ready_for_pickup', 'picked_by_client']
   return (
      <Modal visible={visible}>
         <Container>
            <View center>
               {selection.map((option) => (
                  <TouchableOpacity
                     key={option}
                     onPress={() => onStatusChange(option as ORDER_STATUS)}>
                     <Text>{option}</Text>
                  </TouchableOpacity>
               ))}
            </View>
         </Container>
      </Modal>
   )
}

export default OrderStatusModal
