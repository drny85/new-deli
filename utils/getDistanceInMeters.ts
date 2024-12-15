import { Coords } from '@/shared/types'

export function getDistanceFromLatLonInMeters(loc1: Coords | null, loc2: Coords | null): number {
   if (!loc1 || !loc2) return 0
   function deg2rad(deg: number): number {
      return deg * (Math.PI / 180)
   }

   const R = 6371000 // Radius of the Earth in meters
   const dLat = deg2rad(loc2.latitude - loc1.latitude)
   const dLon = deg2rad(loc2.longitude - loc1.longitude)
   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(loc1.latitude)) *
         Math.cos(deg2rad(loc2.latitude)) *
         Math.sin(dLon / 2) *
         Math.sin(dLon / 2)
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
   const distance = R * c // Distance in meters
   const distanceInMiles = distance / 1609.34 // Convert meters to miles

   return distanceInMiles
}
