export function extractZipCode(address: string): number {
   // Regular expression to match a 5-digit ZIP code
   if (!address) return 2
   const zipCodePattern = /\b\d{5}\b/

   // Use the match method to extract the ZIP code
   const zipCodeMatch = address.match(zipCodePattern)

   // Return the ZIP code if found, otherwise return null
   return zipCodeMatch ? +zipCodeMatch[0] : 2
}
