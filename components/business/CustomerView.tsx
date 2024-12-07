import { View, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Order } from '@/shared/types'
import { SIZES } from '@/constants/Colors'
import Row from '../Row'
import PhoneCall from '../PhoneCall'
import { Text } from '../ThemedText'

type Props = {
   customer: Order['contactPerson']
   onPress: () => void
}

const CustomerCardView = ({ customer, onPress }: Props) => {
   return (
      <View style={styles.container}>
         <Row containerStyle={{ justifyContent: 'space-between' }}>
            <View style={styles.customer}>
               <Text>
                  {customer.name} {customer.lastName}
               </Text>
               <Text> {customer.phone}</Text>
            </View>
            <Row containerStyle={{ gap: SIZES.lg }}>
               <PhoneCall phone={customer.phone} />
               <TouchableOpacity style={styles.button} onPress={onPress}>
                  <Text fontSize="large" style={{ fontWeight: 500 }}>
                     View
                  </Text>
               </TouchableOpacity>
            </Row>
         </Row>
      </View>
   )
}

export default CustomerCardView

const styles = StyleSheet.create({
   container: {
      borderRadius: SIZES.md,
      gap: SIZES.sm,
      padding: SIZES.sm,
      backgroundColor: 'white',
      width: '100%',
      maxWidth: 680,
      paddingHorizontal: SIZES.md,
      alignSelf: 'center',
      marginVertical: SIZES.sm
   },
   customer: {
      gap: SIZES.sm
   },
   button: {
      backgroundColor: '#F5F5F5',
      borderRadius: SIZES.sm,
      paddingVertical: SIZES.sm,
      paddingHorizontal: SIZES.md,

      alignItems: 'center',
      justifyContent: 'center'
   }
})
