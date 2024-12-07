import { SIZES } from '@/constants/Colors'
import { Order } from '@/shared/types'
import { dayjsFormat } from '@/utils/dayjs'
import { ScrollView } from 'react-native'
import { Container } from '../Container'
import OrderProgressDashboard from './OrderProgressDashboard'
import TopSellingItemDasboard from './TopSellingItemDasboard'
type Props = {
   orders: Order[]
}

const Dashboard = ({ orders }: Props) => {
   const data = orders.filter(
      (o) =>
         dayjsFormat(o.orderDate).isAfter(dayjsFormat().startOf('day')) &&
         dayjsFormat(o.orderDate).isBefore(dayjsFormat().endOf('day'))
   )

   return (
      <Container>
         <ScrollView contentContainerStyle={{ padding: SIZES.md, gap: SIZES.md }}>
            <OrderProgressDashboard orders={data} />
            <TopSellingItemDasboard orders={orders} />
         </ScrollView>
      </Container>
   )
}

export default Dashboard
