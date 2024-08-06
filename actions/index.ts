import { usersCollection } from '@/collections'
import { AppUser } from '@/typing'
import { doc, updateDoc } from 'firebase/firestore'

export const toggleFavorite = async (restaurantId: string, user: AppUser) => {
   try {
      if (!restaurantId || !user) return
      const isFavorite = user.favoritesStores.includes(restaurantId)
      const favoritesStores = isFavorite
         ? user.favoritesStores.filter((id) => id !== restaurantId)
         : [...user.favoritesStores, restaurantId]

      const docRef = doc(usersCollection, user.id)
      await updateDoc(docRef, { ...user, favoritesStores })
   } catch (error) {
      console.log('Error toggling favorite', error)
   }
}
