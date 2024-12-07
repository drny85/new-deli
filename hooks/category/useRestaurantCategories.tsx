import { categoriessCollection } from '@/collections'
import { useAuth } from '@/providers/authProvider'
import { Category } from '@/shared/types'
import { onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useRestaurantCategories = () => {
   const [loading, setLoading] = useState<boolean>(false)
   const { user } = useAuth()
   const [categories, setCategories] = useState<Category[]>([])
   useEffect(() => {
      if (!user) return
      setLoading(true)
      return onSnapshot(categoriessCollection(user.id!), (snapshot) => {
         const data = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
         })) as Category[]
         console.log(data, user.id)
         setCategories(data)
         setLoading(false)
      })
   }, [user])

   return { loading, categories }
}
