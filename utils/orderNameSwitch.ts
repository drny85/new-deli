import { ORDER_STATUS } from '@/typing'

export const orderNameSwitch = (status: ORDER_STATUS): string => {
   switch (status) {
      case ORDER_STATUS.new:
         return 'OrderReceived'
      case ORDER_STATUS.in_progress:
         return 'Processing'
      case ORDER_STATUS.picked_up_by_driver:
         return 'PickedByCourier'
      case ORDER_STATUS.delivered:
         return 'Delivered'
      case ORDER_STATUS.cancelled:
         return 'Cancelled'
      case ORDER_STATUS.accepted_by_driver:
         return 'AcceptedByCourier'
      case ORDER_STATUS.marked_ready_for_delivery:
         return 'ReadyForDelivery'
      case ORDER_STATUS.picked_up_by_client:
         return 'PickedUp'
      case ORDER_STATUS.marked_ready_for_pickup:
         return 'ReadyForPickUp'
      default:
         return status
   }
}
