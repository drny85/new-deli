import { Business, Product } from '@/shared/types'
import { create } from 'zustand'

type RestaurantsStore = {
   restaurants: Business[]
   restaurant: Business | null
   loading: boolean
   products: Product[]
   setLoading: (loading: boolean) => void
   setProducts: (products: Product[]) => void
   setRestaurant: (restaurant: Business) => void
   setRestaurants: (restaurants: Business[]) => void
   getRestaurants: () => Business[]
   getRestaurant: (restaurantId: string) => Business | null
}

export const useRestaurantsStore = create<RestaurantsStore>()((set, get) => ({
   restaurants: [],
   restaurant: null,
   products: [],
   loading: true,
   setLoading: (loading) => set({ loading }),
   setProducts: (products: Product[]) => set({ products }),
   setRestaurants: (restaurants: Business[]) => set({ restaurants }),
   getRestaurants: () => get().restaurants,
   setRestaurant: (restaurant: Business) => set({ restaurant }),
   getRestaurant: (restaurantId: string) =>
      get().restaurants.find((restaurant) => restaurant.id === restaurantId) || null
}))
