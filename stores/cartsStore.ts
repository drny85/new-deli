import { ORDER_TYPE, OrderAddress, P_Size, Product } from '@/typing'
import { create } from 'zustand'

import { createJSONStorage, persist } from 'zustand/middleware'
import { zustandStorage } from './storage'

export interface CartItem extends Product {
   itemId: string
   quantity: number
   size: P_Size | null
   instructions: string
   addons: string[]
}

export type Cart = {
   id?: string
   items: CartItem[]
   quantity: number
   total: number
   restaurantId: string
   orderType: ORDER_TYPE
   createdAt: string
   deliveryAddress: OrderAddress | null
   isShared: boolean
   sharedUserId?: string
}

type CartStoreParams = {
   carts: Cart[]
   createNewCart: (restaurantId: string) => Promise<boolean>
   getCart: (restaurantId: string) => Cart | undefined
   addToCart: (item: CartItem) => Promise<boolean>
   removeItemFromCart: (item: CartItem) => void
   updateCart: (restaurantId: string, cart: Cart) => void
   clearCarts: () => void
   addCart: (cart: Cart) => Promise<boolean>
   removeCart: (restaurantId: string) => void
}

export const useCartsStore = create<CartStoreParams>()(
   persist(
      (set, get) => ({
         carts: [],

         createNewCart: async (restaurantId) => {
            const cart: Cart = {
               items: [],
               quantity: 0,
               total: 0,
               restaurantId,
               deliveryAddress: null,
               orderType: ORDER_TYPE.delivery,
               createdAt: new Date().toISOString(),
               isShared: false
            }
            set((state) => ({
               carts: [...state.carts, cart]
            }))
            return true
         },

         removeCart: (restaurantId) => {
            set((state) => ({
               carts: state.carts.filter((c) => c.restaurantId !== restaurantId)
            }))
         },

         updateCart: (restaurantId, cart) => {
            set((state) => ({
               carts: state.carts.map((c) => {
                  if (c.id && c.isShared) {
                     if (c.id === cart.id && c.isShared) {
                        return cart
                     }
                  } else {
                     if (c.restaurantId === restaurantId) {
                        return cart
                     }
                  }

                  return c
               })
            }))
         },

         getCart: (restaurantId, isShared?: string) => {
            if (isShared) {
               return get().carts.find((c) => c.id === isShared) as Cart
            }
            return get().carts.find((c) => c.restaurantId === restaurantId) as Cart
         },
         addToCart: async (item) => {
            set((state) => {
               const cart = state.carts.find((c) => c.restaurantId === item.businessId)
               if (!cart) return state

               if (
                  item.addons &&
                  item.addons.length > 0 &&
                  item.multipleAddons &&
                  item.multipleAddons > 0
               ) {
                  return {
                     ...state,
                     carts: state.carts.map((c) => {
                        if (c.restaurantId === item.businessId) {
                           return {
                              ...c,
                              items: [...c.items, item],
                              quantity: c.quantity + item.quantity,
                              total: c.total + +item.price * item.quantity,
                              createdAt: c.createdAt
                           }
                        }
                        return c
                     })
                  }
               }

               if (item.size) {
                  const index = cart.items.findIndex(
                     (i) => i.itemId === item.itemId && i.size?.id === item.size?.id
                  )

                  if (index !== -1) {
                     return {
                        ...state,
                        carts: state.carts.map((c) => {
                           if (c.restaurantId === item.businessId) {
                              const newState = [...c.items]

                              newState[index].quantity += item.quantity
                              return {
                                 ...c,
                                 items: [...newState],
                                 quantity: c.quantity + item.quantity,
                                 total: c.total + +item.price * item.quantity,
                                 createdAt: c.createdAt
                              }
                           }
                           return c
                        })
                     }
                  } else {
                     return {
                        ...state,
                        carts: state.carts.map((c) => {
                           if (c.restaurantId === item.businessId) {
                              return {
                                 ...c,
                                 items: [...c.items, item],
                                 quantity: c.quantity + item.quantity,
                                 total: c.total + +item.price * item.quantity,
                                 createdAt: c.createdAt
                              }
                           }
                           return c
                        })
                     }
                  }
               } else {
                  const index = cart.items.findIndex((i) => i.itemId === item.itemId)
                  if (index !== -1) {
                     return {
                        ...state,
                        carts: state.carts.map((c) => {
                           if (c.restaurantId === item.businessId) {
                              const newState = [...c.items]

                              newState[index].quantity += item.quantity
                              return {
                                 ...c,
                                 items: [...newState],
                                 quantity: c.quantity + item.quantity,
                                 total: c.total + +item.price * item.quantity,
                                 createdAt: c.createdAt
                              }
                           }
                           return c
                        })
                     }
                  }
                  return {
                     ...state,
                     carts: state.carts.map((c) => {
                        if (c.restaurantId === item.businessId) {
                           return {
                              ...c,
                              items: [...c.items, item],
                              quantity: c.quantity + item.quantity,
                              total: c.total + +item.price * item.quantity,
                              createdAt: c.createdAt
                           }
                        }
                        return c
                     })
                  }
               }
            })

            return true
         },

         addCart: async (cart) => {
            set((state) => {
               const found = state.carts.find((c) => c.restaurantId === cart.restaurantId)
               const newCarts = found
                  ? state.carts.map((c) => {
                       if (c.restaurantId === cart.restaurantId) {
                          return cart
                       }
                       return c
                    })
                  : [...state.carts, cart]
               return {
                  ...state,
                  carts: newCarts
               }
            })
            return true
         },

         removeItemFromCart: (item) => {
            set((state) => {
               const restaurantIndex = state.carts.findIndex(
                  (r) => r.restaurantId === item.businessId
               )
               if (item.size) {
                  const itemFound = state.carts[restaurantIndex].items.find(
                     (i) => i.itemId === item.itemId && i.size?.id === item.size?.id
                  )
                  if (itemFound && itemFound.quantity === 1) {
                     return {
                        ...state,
                        carts: state.carts.map((c) => {
                           if (c.restaurantId === item.businessId) {
                              const newState = [...c.items]
                              newState.splice(newState.indexOf(itemFound), 1)

                              return {
                                 ...c,
                                 items: [...newState],
                                 quantity: c.quantity - 1,
                                 total: c.total - +item.price,
                                 createdAt: c.createdAt
                              }
                           }
                           return c
                        })
                     }
                  } else {
                     const index = state.carts[restaurantIndex].items.findIndex(
                        (i) => i.itemId === item.itemId && i.size?.id === item.size?.id
                     )

                     return {
                        ...state,
                        carts: state.carts.map((c) => {
                           if (c.restaurantId === item.businessId) {
                              const newState = [...c.items]
                              newState[index].quantity -= 1

                              return {
                                 ...c,
                                 items: [...newState],
                                 quantity: c.quantity - 1,
                                 total: c.total - +item.price,
                                 createdAt: c.createdAt
                              }
                           }
                           return c
                        })
                     }
                  }
               } else {
                  const index = state.carts[restaurantIndex].items.findIndex(
                     (i) => i.itemId === item.itemId
                  )

                  if (state.carts[restaurantIndex].items[index].quantity === 1) {
                     return {
                        ...state,
                        carts: state.carts.map((c) => {
                           if (c.restaurantId === item.businessId) {
                              const newState = [...c.items.filter((i) => i.itemId !== item.itemId)]

                              return {
                                 ...c,
                                 items: [...newState],
                                 quantity: c.quantity - 1,
                                 total: c.total - +item.price,
                                 createdAt: c.createdAt
                              }
                           }
                           return c
                        })
                     }
                  }

                  return {
                     ...state,
                     carts: state.carts.map((c) => {
                        if (c.restaurantId === item.businessId) {
                           const newState = [...c.items]
                           newState[index].quantity -= 1

                           return {
                              ...c,
                              items: [...newState],
                              quantity: c.quantity - 1,
                              total: c.total - +item.price,
                              createdAt: c.createdAt
                           }
                        }
                        return c
                     })
                  }
               }
            })
         },

         clearCarts: () => {
            set({ carts: [] })
         }
      }),
      {
         name: 'carts',
         storage: createJSONStorage(() => zustandStorage)
      }
   )
)
