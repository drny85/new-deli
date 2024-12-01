/**
 * Generates a unique string ID.
 * @param length - Length of the generated ID (default: 16).
 * @returns A unique string ID.
 */
export function generateUniqueId(length: number = 16): string {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
   let uniqueId = ''
   for (let i = 0; i < length; i++) {
      uniqueId += chars.charAt(Math.floor(Math.random() * chars.length))
   }
   return uniqueId
}
