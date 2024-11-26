import { driversCollection } from '@/collections'
import { Coords } from '@/typing'
import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

type Props = {
   location: Coords | null
}

export const useDriverLocation = (driverId: string): Props | null => {
   const [location, setLocation] = useState<Props | null>(null)
   useEffect(() => {
      if (!driverId) return
      const ref = doc(driversCollection, driverId)
      return onSnapshot(ref, (snap) => {
         if (snap.exists()) {
            const data = snap.data()
            setLocation(data)
         }
      })
   }, [driverId])
   return location
}
