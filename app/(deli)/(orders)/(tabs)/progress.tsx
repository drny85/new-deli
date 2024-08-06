import React from 'react'
import { Container } from '@/components/Container'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import BusinessOrderStatusView from '@/components/business/BusinessOrderStatusView'
import { ORDER_STATUS } from '@/typing'
import { isFromToday } from '@/helpers/isFromToday'
import { MaterialTopTabs } from './_layout'

const Progress = () => {
   const orders = useBusinessOrdersStore((s) =>
      s.orders.filter((o) => o.status === ORDER_STATUS.in_progress && isFromToday(o.orderDate))
   )
   return (
      <Container>
         <MaterialTopTabs.Screen options={{ title: `In Progress (${orders.length})` }} />
         <BusinessOrderStatusView orders={orders} />
      </Container>
   )
}

export default Progress
