import { Coords } from '@/typing'

/**
 * Calculates ETA based on two coordinates and an average speed.
 * @param start - Starting location { lat: number; lng: number }
 * @param end - Destination location { lat: number; lng: number }
 * @param speedKmH - Average speed in kilometers per hour (default: 40 km/h)
 * @returns ETA in minutes
 */
export const calculateETA = (start: Coords, end: Coords, speedKmH: number = 30): number => {
   if (!start || !end) return 0
   const EARTH_RADIUS_KM = 6371 // Earth's radius in kilometers

   // Convert latitude and longitude from degrees to radians
   const lat1 = (start.latitude * Math.PI) / 180
   const lng1 = (start.longitude * Math.PI) / 180
   const lat2 = (end.latitude * Math.PI) / 180
   const lng2 = (end.longitude * Math.PI) / 180

   // Approximate the distance between two coordinates
   const latDiff = lat2 - lat1
   const lngDiff = lng2 - lng1

   // Distance calculation using Pythagoras approximation on a sphere
   const a =
      Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2)
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
   const distanceKm = EARTH_RADIUS_KM * c

   // Calculate time in hours
   const timeHours = distanceKm / speedKmH

   // Convert to minutes
   return Math.ceil(timeHours * 60)
}
