import { Order, ORDER_STATUS } from '@/shared/types'

export async function calculateETA(orders: Order[]): Promise<number> {
   if (!orders || orders.length === 0) return 0

   const validTimeDiffs = orders
      .filter(
         (order) =>
            order &&
            order.status === ORDER_STATUS.delivered && // Exclude orders already delivered
            order.readyOn && // Must have a readyOn time
            order.deliveredOn // Must have a deliveredOn time
      )
      .map((order) => {
         const readyOnDate = new Date(order.readyOn!)
         const deliveredOnDate = new Date(order.deliveredOn!)
         const timeDiffMins = (deliveredOnDate.getTime() - readyOnDate.getTime()) / (1000 * 60)

         return timeDiffMins > 0 && timeDiffMins <= 50 ? timeDiffMins : 0 // Only valid time differences
      })
      .filter((timeDiff) => timeDiff > 0) // Exclude invalid or 0 differences

   if (validTimeDiffs.length === 0) return 0

   // Calculate average time difference
   const averageETA = Math.round(
      validTimeDiffs.reduce((acc, curr) => acc + curr, 0) / validTimeDiffs.length
   )

   // Cap the ETA at 50 minutes
   return Math.min(averageETA, 50)
}
