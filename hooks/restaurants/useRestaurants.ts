import { businessCollection } from '@/collections'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Business } from '@/shared/types'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useRestaurants = () => {
   const [restaurants, setRestaurants] = useState<Business[]>([])
   const setRestaurantes = useRestaurantsStore((s) => s.setRestaurants)
   const [loading, setLoading] = useState(false)
   useEffect(() => {
      const docsQuery = query(
         businessCollection,
         where('profileCompleted', '==', true),
         where('hasItems', '==', true)
      )
      return onSnapshot(docsQuery, (snapshot) => {
         const data = snapshot.docs.map((data) => ({ id: data.id, ...data.data() }))

         setRestaurants(data)
         setRestaurantes(data)
         setLoading(false)
      })
   }, [])

   return { restaurants, loading }
}
