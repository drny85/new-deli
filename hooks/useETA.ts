import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { ORDER_STATUS } from '@/typing'

export const useETA = () => {
   const etas: { orderId: string; eta: string; timeDiff: number }[] = []
   const orders = useBusinessOrdersStore((s) => s.orders)

   // Loop through the orders
   orders.forEach((order) => {
      if (
         order.status !== ORDER_STATUS.marked_ready_for_pickup &&
         order.status !== ORDER_STATUS.marked_ready_for_delivery &&
         !order.readyOn
      )
         return
      // Convert the order placement time and delivery time to Date objects
      const placedDate = new Date(order.orderDate)
      const deliveredDate = new Date(order.readyOn!)

      // Calculate the time difference in milliseconds
      const timeDiffMs = deliveredDate.getTime() - placedDate.getTime()

      // Convert the time difference to minutes
      const timeDiffMins = timeDiffMs / (1000 * 60)

      // Calculate the ETA by adding 30 minutes to the delivery time
      const etaDate = new Date(deliveredDate.getTime() + 30 * 60 * 1000)
      if (isNaN(etaDate.getTime())) return

      // Format the ETA as a string in the format "YYYY-MM-DD HH:MM:SS"
      const etaString = etaDate?.toISOString().slice(0, 19).replace('T', ' ')

      // Add the ETA and time difference to the etas array
      etas.push({
         orderId: order.id!,
         eta: etaString,
         timeDiff: timeDiffMins || 0
      })
   })

   return {
      deliveryInMinute: Math.round(
         etas.reduce((acc, curr) => acc + curr.timeDiff, 0) / etas.length
      ),
      ETAorders: [...etas]
   }
}
