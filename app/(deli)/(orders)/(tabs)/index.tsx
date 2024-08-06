import BusinessOrderStatusView from '@/components/business/BusinessOrderStatusView'
import { Container } from '@/components/Container'
import BusinessOrderSkeleton from '@/components/skeletons/BusinessOrderSkeleton'
import { isFromToday } from '@/helpers/isFromToday'
import { useOrders } from '@/hooks/orders/useOrders'
import { useAuth } from '@/providers/authProvider'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { ORDER_STATUS } from '@/typing'
import { MaterialTopTabs } from './_layout'

const NewOrders = () => {
   const { user } = useAuth()

   const { loading } = useOrders(user?.id)
   const newOrders = useBusinessOrdersStore((s) =>
      s.orders.filter((o) => o.status === ORDER_STATUS.new && isFromToday(o.orderDate))
   )
   if (loading) return <BusinessOrderSkeleton />
   return (
      <Container>
         <MaterialTopTabs.Screen options={{ title: `New (${newOrders.length})` }} />
         <BusinessOrderStatusView orders={newOrders} />
      </Container>
   )
}

export default NewOrders
