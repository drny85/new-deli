import { userCouriersCollection } from '@/collections'
import { useAuth } from '@/providers/authProvider'
import { Courier } from '@/typing'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useRestaurant } from '../restaurants/useRestaurant'

export const useCouriers = () => {
   const [couriers, setCouriers] = useState<Courier[]>([])
   const [loading, setLoading] = useState(false)
   const { user } = useAuth()
   const { restaurant } = useRestaurant(user?.id!)
   console.log(restaurant?.couriers)

   useEffect(() => {
      if (!user || !restaurant) return
      setLoading(true)
      if (restaurant.couriers.length === 0) {
         setLoading(false)
         return
      }

      const q = query(
         userCouriersCollection,
         where('id', 'in', restaurant?.couriers || []),
         where('isOnline', '==', true),
         where('isActive', '==', true),
         where('coords', '!=', null)
      )
      return onSnapshot(q, (snap) => {
         setCouriers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
         setLoading(false)
      })
   }, [user, restaurant])

   return {
      couriers,
      loading
   }
}
