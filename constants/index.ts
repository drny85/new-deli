import { P_Size } from '@/typing'

export const CART_ALLOWED = 10
export const MY_TRANSACTION_FEE = 1.2 //remeber to change this in the cloud funtions  => shared.ts

export const SIZES_ADDONS: P_Size[] = [
   { id: 's', size: 'Small', price: '' },
   { id: 'm', size: 'Medium', price: '' },
   {
      id: 'l',
      size: 'Large',
      price: ''
   },
   {
      id: 'xl',
      size: 'Extra Large',
      price: ''
   }
]

export const ADDONS = [
   'chicharon',
   'orejitas',
   'longaniza',
   'queso frito',
   'chuleta',
   'carnita de cerdo',
   'carnita de res',
   'pechurina'
]
