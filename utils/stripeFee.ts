import { ORDER_TYPE } from '@/typing'

const myPercentage = 0.4

export const stripeFee = (amount: number, orderType: keyof typeof ORDER_TYPE): number => {
   if (!amount) return 0
   const myFee = orderType === ORDER_TYPE.delivery ? myPercentage : myPercentage * 1.5
   const stripeCharge = 0.3
   const fee = myFee + stripeCharge
   const p = (amount * 2.9) / 100 + fee

   return +p.toFixed(2)
}

export const myStripeFee = (amount: number): number => {
   if (!amount) return 0

   const stripeCharge = 0.3
   const fee = stripeCharge
   const p = (amount * 2.9) / 100 + fee

   return +p.toFixed(2)
}
