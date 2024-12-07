import BusinessOrderStatusView from '@/components/business/BusinessOrderStatusView'
import { Container } from '@/components/Container'
import { isFromToday } from '@/helpers/isFromToday'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { ORDER_STATUS } from '@/shared/types'
import { MaterialTopTabs } from './_layout'

const Delivered = () => {
   const orders = useBusinessOrdersStore((s) =>
      s.orders.filter(
         (o) =>
            (o.status === ORDER_STATUS.delivered ||
               o.status === ORDER_STATUS.picked_up_by_client) &&
            isFromToday(o.orderDate)
      )
   )

   return (
      <Container>
         <MaterialTopTabs.Screen options={{ title: `Completed (${orders.length})` }} />
         <BusinessOrderStatusView orders={orders} />
      </Container>
   )
}

export default Delivered
