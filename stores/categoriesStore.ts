import { Category } from '@/typing'
import { create } from 'zustand'

type CategoriesStoreParams = {
   categories: Category[]
   setCategories: (categories: Category[]) => void
}
export const useCategoriesStore = create<CategoriesStoreParams>((set) => ({
   categories: [],
   setCategories: (categories) => set({ categories })
}))
