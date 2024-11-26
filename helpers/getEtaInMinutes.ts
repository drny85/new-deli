import { Coords } from '@/typing'

/**
 * Get travel duration in minutes between two coordinates using Google Maps API.
 * @param origin - Starting location { lat: number; lng: number }
 * @param destination - Ending location { lat: number; lng: number }
 * @param apiKey - Your Google Maps API key
 * @returns Duration in minutes or null if failed
 */
export const getDurationFromGoogleMaps = async (
   origin: Coords,
   destination: Coords,
   apiKey: string
): Promise<number | null> => {
   try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${apiKey}&mode=driving`

      const response = await fetch(url)
      const data = await response.json()

      // Ensure the response has valid data
      if (
         data.rows &&
         data.rows[0] &&
         data.rows[0].elements &&
         data.rows[0].elements[0] &&
         data.rows[0].elements[0].duration
      ) {
         const durationInSeconds = data.rows[0].elements[0].duration.value
         return Math.ceil(durationInSeconds / 60) // Convert seconds to minutes
      }

      return null
   } catch (error) {
      console.error('Error fetching duration from Google Maps:', error)
      return null
   }
}
