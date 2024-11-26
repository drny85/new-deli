import { ordersCollection, pendingOrdersCollection } from '@/collections'
import { Order } from '@/typing'
import { addDoc, doc, setDoc } from 'firebase/firestore'

type OrderActionsReturnParams1 = {
   order: Order | null
   success: boolean
}
type OrderActionsReturnParams2 = {
   orderId?: string
   success: boolean
}

export const placePendingOrder = async (order: Order): Promise<OrderActionsReturnParams1> => {
   try {
      if (!order) {
         console.log('NO ORDER for pending order')
         return new Promise((resolve) => resolve({ order: null, success: false }))
      }

      const { id } = await addDoc(pendingOrdersCollection, { ...order })
      console.log('Pending Order Placed', id)
      return { order: { ...order, id }, success: true }
   } catch (error) {
      console.log(error)
      return new Promise((resolve) => resolve({ order: null, success: false }))
   }
}

export const placeOrder = async (order: Order): Promise<OrderActionsReturnParams2> => {
   try {
      if ((order && order.items.length === 0) || !order.id) {
         console.log('NO ORDER ID')
         return new Promise((resolve) => resolve({ orderId: undefined, success: false }))
      }

      const orderRef = doc(ordersCollection, order.id)

      await setDoc(orderRef, { ...order })
      console.log('Order Placed', order.id)
      return { orderId: order.id, success: true }
   } catch (error) {
      console.log('Error placing order =>', error)
      return new Promise((resolve) => resolve({ orderId: undefined, success: false }))
   }
}
