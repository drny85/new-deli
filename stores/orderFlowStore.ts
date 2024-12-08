import { Coords, Order, ORDER_TYPE, OrderAddress } from '@/shared/types'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from './storage'

type OrderFlowStore = {
   deliveryAddress: OrderAddress | null
   setDeliveryAddress: (address: OrderAddress | null) => void
   recentAddresses: OrderAddress[]
   addToRecentAddresses: (address: OrderAddress) => void
   deleteFromRecentAddresses: (address: OrderAddress) => void
   orderType: ORDER_TYPE
   setOrderType: (type: ORDER_TYPE) => void
   changingAddressFromCheckoutScreen: boolean
   setChangingAddressFromCheckoutScreen: (value: boolean) => void
   tipAmount: number
   setTipAmount: (amount: number) => void
   order: Order | null
   setOrder: (order: Order | null) => Promise<boolean>
   initiatePayment: boolean
   setInitiatePayment: (value: boolean) => void
   currentLocationCoords: Coords | null
   setCurrentLocationCoords: (coords: Coords) => void
   reOrder: boolean
   setReOrder: (value: boolean) => void
}
export const useOrderFlowStore = create<OrderFlowStore>()(
   persist(
      (set, get) => ({
         deliveryAddress: null,
         tipAmount: 0,
         changingAddressFromCheckoutScreen: false,
         recentAddresses: [],
         orderType: ORDER_TYPE.delivery,
         order: null,
         initiatePayment: false,
         currentLocationCoords: null,
         reOrder: false,
         setReOrder: (value) => set({ reOrder: value }),
         setCurrentLocationCoords: (coords) => set({ currentLocationCoords: coords }),
         setInitiatePayment: (value) => set({ initiatePayment: value }),
         setOrder: async (order) => {
            set({ order })
            return true
         },

         setTipAmount: (amount) => set({ tipAmount: amount }),
         setChangingAddressFromCheckoutScreen: (value) =>
            set({ changingAddressFromCheckoutScreen: value }),
         setOrderType: (type) => set({ orderType: type }),
         setDeliveryAddress: (address) => set({ deliveryAddress: address }),
         addToRecentAddresses: (address) => {
            const { recentAddresses } = get()
            set({ recentAddresses: [address, ...recentAddresses] })
         },
         deleteFromRecentAddresses: (address) => {
            const { recentAddresses } = get()
            set({ recentAddresses: recentAddresses.filter((a) => a !== address) })
         }
      }),
      {
         name: 'order-flow-storage',
         storage: createJSONStorage(() => zustandStorage)
      }
   )
)
