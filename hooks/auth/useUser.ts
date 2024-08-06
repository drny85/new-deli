import { usersCollection } from '@/collections'
import { useAuth } from '@/providers/authProvider'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect } from 'react'

export const useUser = () => {
   const { setUser, user } = useAuth()
   useEffect(() => {
      if (!user) return
      const userRef = doc(usersCollection, user?.id)
      return onSnapshot(userRef, (snap) => {
         if (snap.exists()) {
            setUser({ ...snap.data(), id: snap.id })
         }
      })
   }, [])
}
