import { ORDER_STATUS } from '@/shared/types'

export const statusColor = (status: ORDER_STATUS) => {
   switch (status) {
      case ORDER_STATUS.new:
         return 'blue'
      case ORDER_STATUS.delivered:
      case ORDER_STATUS.picked_up_by_client:
         return 'green'
      case ORDER_STATUS.cancelled:
         return 'red'
      case ORDER_STATUS.in_progress:
         return 'orange'
      default:
         return 'gray'
   }
}
