import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { STATUS_NAME } from '@/utils/orderStatus'
import React, { useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity } from 'react-native'
import Button from '../Button'
import NeoView from '../NeoView'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import Row from '../Row'
import Divider from '../Divider'

enum ORDER_STATUS {
   new = 'new',
   delivered = 'delivered',
   in_progress = 'in_progress',
   marked_ready_for_delivery = 'marked_ready_for_delivery',
   marked_ready_for_pickup = 'marked_ready_for_pickup',
   cancelled = 'cancelled',
   accepted_by_driver = 'accepted_by_driver',
   picked_up_by_driver = 'picked_up_by_driver',
   picked_up_by_client = 'picked_up_by_client',
   all = 'all orders'
}

interface OrderStatusModalProps {
   visible: boolean
   onClose: () => void
   currentStatus: ORDER_STATUS
   orderType: 'delivery' | 'pickup'
   onStatusChange: (status: ORDER_STATUS) => void
}

const OrderStatusPicker: React.FC<OrderStatusModalProps> = ({
   visible,
   onClose,
   onStatusChange,
   currentStatus,
   orderType
}) => {
   const [selectedStatus, setSelectedStatus] = useState<ORDER_STATUS>(currentStatus)
   const backgroundColor = useThemeColor('ascent')
   const bgColor = useThemeColor('background')

   const values =
      orderType === 'delivery'
         ? currentStatus === ORDER_STATUS.in_progress
            ? [ORDER_STATUS.marked_ready_for_delivery, ORDER_STATUS.cancelled]
            : currentStatus === ORDER_STATUS.marked_ready_for_delivery ||
                currentStatus === ORDER_STATUS.accepted_by_driver
              ? [ORDER_STATUS.cancelled]
              : [
                   ORDER_STATUS.in_progress,
                   ORDER_STATUS.marked_ready_for_delivery,
                   ORDER_STATUS.cancelled
                ]
         : currentStatus === ORDER_STATUS.in_progress
           ? [ORDER_STATUS.marked_ready_for_pickup, ORDER_STATUS.cancelled]
           : currentStatus === ORDER_STATUS.marked_ready_for_pickup
             ? [ORDER_STATUS.picked_up_by_client, ORDER_STATUS.cancelled]
             : [
                  ORDER_STATUS.in_progress,
                  ORDER_STATUS.marked_ready_for_pickup,
                  ORDER_STATUS.cancelled
               ]

   return (
      <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
         <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
               <Row align="around" containerStyle={{ gap: SIZES.md, marginBottom: SIZES.lg }}>
                  <Text fontSize="large" type="defaultSemiBold">
                     Current Status
                  </Text>

                  <Text center type="defaultSemiBold" fontSize="large">
                     {STATUS_NAME(currentStatus)}
                  </Text>
               </Row>
               <Divider size="small" />

               <View style={{ gap: SIZES.md }}>
                  {values.map((o) => (
                     <NeoView
                        key={o}
                        containerStyle={{ borderRadius: SIZES.md }}
                        innerStyleContainer={{
                           padding: SIZES.md,
                           borderRadius: SIZES.md,
                           borderWidth: selectedStatus === o ? 2 : 0,
                           borderColor: selectedStatus === o ? backgroundColor : undefined
                        }}>
                        <TouchableOpacity
                           onPress={() => {
                              setSelectedStatus(o)
                           }}>
                           <Text
                              type="defaultSemiBold"
                              style={{ marginLeft: SIZES.md }}
                              fontSize="large">
                              {STATUS_NAME(o)}
                           </Text>
                        </TouchableOpacity>
                     </NeoView>
                  ))}
               </View>

               <View style={styles.buttonContainer}>
                  <Button
                     title="Cancel"
                     type="soft"
                     onPress={onClose}
                     contentTextStyle={{ paddingHorizontal: SIZES.md }}
                  />
                  <Button
                     contentTextStyle={{ paddingHorizontal: SIZES.md, color: '#ffffff' }}
                     type="primary"
                     title="Change Status"
                     onPress={() => {
                        onStatusChange(selectedStatus)
                        onClose()
                     }}
                  />
               </View>
            </View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
   },
   modalContent: {
      padding: 20,
      width: SIZES.width * 0.5,

      borderRadius: 10,
      alignItems: 'center'
   },
   title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10
   },

   dropdownButtonText: {
      fontSize: 20,
      marginBottom: SIZES.lg
   },
   dropdown: {
      width: '100%',
      borderWidth: 1,
      borderRadius: 5
   },
   statusItem: {
      padding: 10
   },
   statusText: {
      fontSize: 16
   },
   buttonContainer: {
      flexDirection: 'row',
      marginTop: 40,
      gap: SIZES.lg,
      width: '100%',
      justifyContent: 'center'
   },
   button: {
      flex: 1,
      padding: 10,
      margin: 5,
      backgroundColor: '#2196F3',
      borderRadius: 5,
      alignItems: 'center'
   },
   buttonText: {
      color: 'white',
      fontSize: 18
   }
})

export default OrderStatusPicker
