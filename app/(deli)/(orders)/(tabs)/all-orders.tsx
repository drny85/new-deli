import BusinessOrderStatusView from '@/components/business/BusinessOrderStatusView'
import { Container } from '@/components/Container'
import Input from '@/components/Input'

import BusinessOrderSkeleton from '@/components/skeletons/BusinessOrderSkeleton'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useOrders } from '@/hooks/orders/useOrders'
import { useAuth } from '@/providers/authProvider'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { FontAwesome } from '@expo/vector-icons'

import { useMemo, useState } from 'react'
import { MaterialTopTabs } from './_layout'

const AllOrders = () => {
   const { user } = useAuth()

   const { loading } = useOrders(user?.id)
   const newOrders = useBusinessOrdersStore((s) => s.orders)
   const [searchTerm, setSearchTerm] = useState('')

   const orders = useMemo(() => {
      if (!searchTerm) return newOrders
      return newOrders.filter(
         (order) =>
            order.contactPerson.name.includes(searchTerm) ||
            order.contactPerson.lastName.includes(searchTerm) ||
            order.contactPerson.phone.includes(searchTerm) ||
            order.address?.street.includes(searchTerm)
      )
   }, [newOrders, searchTerm])
   if (loading) return <BusinessOrderSkeleton />
   return (
      <Container>
         <MaterialTopTabs.Screen options={{ title: `All Orders (${newOrders.length})` }} />
         <View style={{ width: '80%', alignSelf: 'center', marginVertical: SIZES.md }}>
            <Input
               placeholder="Search order by customer name, phone or addres"
               value={searchTerm}
               onChangeText={setSearchTerm}
               RightIcon={
                  searchTerm && (
                     <FontAwesome
                        name="close"
                        size={20}
                        color={'gray'}
                        onPress={() => setSearchTerm('')}
                     />
                  )
               }
            />
         </View>
         <BusinessOrderStatusView orders={orders} />
      </Container>
   )
}

export default AllOrders
