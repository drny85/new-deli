import { Order } from '@/typing'
import { create } from 'zustand'

type BusinessOrderPrams = {
   showOtp: boolean
   setShowOtp: (showOtp: boolean) => void
   orders: Order[]
   setOrders: (orders: Order[]) => void
}

export const useBusinessOrdersStore = create<BusinessOrderPrams>()((set, get) => ({
   orders: [],
   showOtp: false,
   setShowOtp: (showOtp) => set({ showOtp }),
   setOrders: (orders) => set({ orders })
}))
