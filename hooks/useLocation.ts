import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { OrderAddress } from '@/shared/types'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
export const useLocation = (address: OrderAddress | null) => {
   const [location, setLocation] = useState<Location.LocationObject | null>(null)
   const [adddress, setAddress] = useState<string | null>(null)
   const [errorMsg, setErrorMsg] = useState<string | null>(null)
   const [loading, setLoading] = useState(false)
   const setCurrentLocation = useOrderFlowStore((s) => s.setCurrentLocationCoords)

   useEffect(() => {
      if (address) return
      ;(async () => {
         try {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
               setErrorMsg('Permission to access location was denied')
               return
            }
            setLoading(true)

            let location = await Location.getCurrentPositionAsync({
               accuracy: Location.Accuracy.High
            })
            if (location) {
               const respond = await Location.reverseGeocodeAsync(location.coords)
               const { streetNumber, street } = respond[0]

               const formatted = `${streetNumber} ${street}`
               setAddress(formatted)
               setCurrentLocation(location.coords)
            }
            setLocation(location)
         } catch (error) {
            const err = error as Error
            console.log(err)
            setErrorMsg(err.message)
         } finally {
            setLoading(false)
         }
      })()
   }, [adddress])

   return { location, errorMsg, adddress, loading }
}
