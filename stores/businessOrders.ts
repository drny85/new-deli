import { Order } from '@/typing'
import { create } from 'zustand'

type BusinessOrderPrams = {
   orders: Order[]
   setOrders: (orders: Order[]) => void
}

export const useBusinessOrdersStore = create<BusinessOrderPrams>()((set, get) => ({
   orders: [],
   setOrders: (orders) => set({ orders })
}))
