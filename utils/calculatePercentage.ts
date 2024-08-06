export function calculatePercentage(value: number, maxValue: number): number {
   const percentage = Math.round((value / maxValue) * 100)

   return percentage
}
