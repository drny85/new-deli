import { SIZES } from '@/constants/Colors'
import { router } from 'expo-router'
import { ScrollView } from 'react-native'
import AddMoreItemsButton from '../cart/AddMoreItemsButton'
import CartListItem from '../cart/CartListItem'
import { CartItem } from '@/shared/types'

type Props = {
   items: CartItem[]
   showAddMoreItemsButton?: boolean
   removable?: boolean
   onRemove?: (item: CartItem) => void
}

const CartItems = ({
   items,
   showAddMoreItemsButton = true,
   removable = false,
   onRemove
}: Props) => {
   return (
      <ScrollView
         style={{ flex: 1, marginTop: SIZES.md }}
         contentContainerStyle={{ padding: SIZES.md, gap: SIZES.md }}>
         {items.map((i, index) => (
            <CartListItem
               item={i}
               key={index.toString()}
               showSetter={showAddMoreItemsButton}
               removable={removable}
               onRemove={onRemove}
            />
         ))}
         {showAddMoreItemsButton && (
            <AddMoreItemsButton
               onPress={() => {
                  router.push({
                     pathname: '/restaurant',
                     params: { restaurantId: items[0].businessId, categoryName: 'all' }
                  })
               }}
            />
         )}
      </ScrollView>
   )
}

export default CartItems
