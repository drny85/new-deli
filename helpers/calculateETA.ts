import { Order, ORDER_STATUS } from '@/typing'

export async function calculateETA(orders: Order[]): Promise<number> {
   // Create an array to hold the ETAs for each order
   if (!orders) return 0
   const etas: { orderId: string; eta: string; timeDiff: number }[] = []

   // Loop through the orders
   orders.forEach((order) => {
      if (!order) return 0
      if (order.status !== ORDER_STATUS.delivered && !order.readyOn) return 0
      // Convert the order placement time and delivery time to Date objects
      const placedDate = new Date(order.readyOn!)
      const deliveredDate = new Date(order.deliveredOn!)

      // Calculate the time difference in milliseconds
      const timeDiffMs = deliveredDate.getTime() - placedDate.getTime()

      // Convert the time difference to minutes
      const timeDiffMins = timeDiffMs / (1000 * 60)

      // Calculate the ETA by adding 30 minutes to the delivery time
      const etaDate = new Date(deliveredDate.getTime() + 30 * 60 * 1000)

      // Format the ETA as a string in the format "YYYY-MM-DD HH:MM:SS"
      const etaString = etaDate.toISOString().slice(0, 19).replace('T', ' ')

      // Add the ETA and time difference to the etas array
      etas.push({
         orderId: order.id!,
         eta: etaString,
         timeDiff: timeDiffMins
      })
   })

   const deliveryInMinute = Math.round(
      etas.reduce((acc, curr) => acc + curr.timeDiff, 0) / etas.length
   )
   return deliveryInMinute > 50 ? 50 : deliveryInMinute || 0
}
