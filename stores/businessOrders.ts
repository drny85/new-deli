import { Order } from '@/shared/types'
import { create } from 'zustand'

type BusinessOrderPrams = {
   showOtp: boolean
   setShowOtp: (showOtp: boolean) => void
   orders: Order[]
   setOrders: (orders: Order[]) => void
}

export const useBusinessOrdersStore = create<BusinessOrderPrams>()((set) => ({
   orders: [],
   showOtp: false,
   setShowOtp: (showOtp) => set({ showOtp }),
   setOrders: (orders) => set({ orders })
}))
