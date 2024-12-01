import { SIZES } from '@/constants/Colors'
import { Order } from '@/typing'
import { FlashList } from '@shopify/flash-list'
import OrderListItem from './OrderListItem'
import { Text } from '../ThemedText'
import useOrientation from '@/hooks/useOrientation'

type Props = {
   orders: Order[]
}

const BusinessOrderStatusView = ({ orders }: Props) => {
   const orientation = useOrientation()

   return (
      <FlashList
         //key={orientation}
         data={orders}
         numColumns={2}
         ListEmptyComponent={
            <Text
               center
               style={{ marginTop: SIZES.lg * 3 }}
               fontSize="large"
               type="defaultSemiBold">
               No Orders
            </Text>
         }
         contentContainerStyle={{ padding: SIZES.sm }}
         estimatedItemSize={400}
         estimatedListSize={{ width: SIZES.width * 0.5, height: 300 }}
         renderItem={({ item }) => <OrderListItem item={item} />}
      />
   )
}

export default BusinessOrderStatusView
