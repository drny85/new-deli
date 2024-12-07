import { View, StyleSheet } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Container } from '../Container'
import { Order } from '@/shared/types'
import Input from '../Input'
import { SIZES } from '@/constants/Colors'
import { FlashList } from '@shopify/flash-list'

import { Text } from '../ThemedText'
import CustomerCardView from '../business/CustomerView'
import { router } from 'expo-router'

type Props = {
   orders: Order[]
}
const Customers = ({ orders }: Props) => {
   const [search, setSearch] = useState('')
   const customers = useMemo(() => {
      const customerMap = new Map<string, Order['contactPerson']>()

      orders.forEach((order) => {
         const customer = order.contactPerson
         const uniqueKey = `${customer.phone}-${customer.name}`

         if (!customerMap.has(uniqueKey)) {
            customerMap.set(uniqueKey, customer)
         }
      })

      return Array.from(customerMap.values())
   }, [orders])
   const filteredCustomers = useMemo(() => {
      if (search === '') return customers
      return customers.filter((customer) => {
         return (
            customer.name.toLowerCase().includes(search.toLowerCase()) ||
            customer.phone.toLowerCase().includes(search.toLowerCase())
         )
      })
   }, [search, customers])

   return (
      <Container>
         <View style={styles.inputContainer}>
            <Input
               placeholder="Search Customer by phone or name"
               value={search}
               onChangeText={setSearch}
            />
         </View>
         <FlashList
            data={filteredCustomers}
            contentContainerStyle={{
               paddingBottom: 20
            }}
            estimatedItemSize={80}
            ListEmptyComponent={<Text center>No customers found</Text>}
            renderItem={({ item }) => (
               <CustomerCardView
                  customer={item}
                  onPress={() => {
                     console.log(item.userId)
                     router.push({
                        pathname: '/customer-view',
                        params: { customerId: item.userId }
                     })
                  }}
               />
            )}
         />
      </Container>
   )
}

export default Customers

const styles = StyleSheet.create({
   inputContainer: {
      marginBottom: 10,
      maxWidth: 680,
      alignSelf: 'center',
      width: '100%',
      padding: SIZES.md
   }
})
