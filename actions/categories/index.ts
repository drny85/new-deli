import { categoriessCollection } from '@/collections'
import { Category } from '@/shared/types'
import { addDoc } from 'firebase/firestore'

export const addCategory = async (category: Category, businessId: string): Promise<boolean> => {
   try {
      if (!category || !businessId) return false

      await addDoc(categoriessCollection(businessId), { ...category })
      return true
   } catch (error) {
      console.log(error)
      return false
   }
}
