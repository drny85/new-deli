import { userCouriersCollection } from '@/collections'

import { Courier } from '@/typing'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useCourier = (courierId: string) => {
   const [courier, setCourier] = useState<Courier | null>(null)
   const [loading, setLoading] = useState(false)
   useEffect(() => {
      if (!courierId) return
      const userRef = doc(userCouriersCollection, courierId)
      return onSnapshot(userRef, (snap) => {
         setLoading(true)
         if (snap.exists()) {
            setCourier({ ...snap.data(), id: snap.id })
         }
         setLoading(false)
      })
   }, [courierId])

   return { courier, loading }
}
