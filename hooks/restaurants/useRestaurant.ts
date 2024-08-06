import { businessCollection } from '@/collections'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Business } from '@/typing'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useRestaurant = (restaurantId: string) => {
   const [restaurant, setRestaurant] = useState<Business | null>(null)
   const assignRestaurant = useRestaurantsStore((s) => s.setRestaurant)
   const [loading, setLoading] = useState(false)
   useEffect(() => {
      if (!restaurantId) return
      setLoading(true)
      const docRef = doc(businessCollection, restaurantId)
      return onSnapshot(docRef, (snap) => {
         if (!snap.exists()) {
            setLoading(false)
            return
         }
         setRestaurant({ id: snap.id, ...snap.data() })
         assignRestaurant({ id: snap.id, ...snap.data() })
         setLoading(false)
      })
   }, [restaurantId])

   return { restaurant, loading }
}
