import { Container } from '@/components/Container'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import BusinessOrderStatusView from '@/components/business/BusinessOrderStatusView'
import { ORDER_STATUS } from '@/shared/types'
import { MaterialTopTabs } from './_layout'
import { isFromToday } from '@/helpers/isFromToday'

const InRoute = () => {
   const orders = useBusinessOrdersStore((s) =>
      s.orders.filter(
         (o) =>
            (o.status === ORDER_STATUS.picked_up_by_driver ||
               o.status === ORDER_STATUS.marked_ready_for_delivery ||
               o.status === ORDER_STATUS.marked_ready_for_pickup) &&
            isFromToday(o.orderDate)
      )
   )
   return (
      <Container>
         <MaterialTopTabs.Screen options={{ title: `In Route (${orders.length})` }} />
         <BusinessOrderStatusView orders={orders} />
      </Container>
   )
}

export default InRoute
