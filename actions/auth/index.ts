import { usersCollection } from '@/collections'
import { AppUser } from '@/typing'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export const createUser = async (user: AppUser) => {
   try {
      const docRef = doc(usersCollection, user.id)
      await setDoc(docRef, { ...user })
   } catch (error) {
      console.log(error)
   }
}

export const updateUser = async (user: AppUser): Promise<boolean> => {
   try {
      if (!user) return false
      const docRef = doc(usersCollection, user.id)
      const data = await getDoc(docRef)
      if (!data.exists()) {
         return false
      }

      await updateDoc(docRef, { ...user })
      return true
   } catch (error) {
      console.log(error)
      return false
   }
}
