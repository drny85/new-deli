import { cartsCollection } from '@/collections'
import { Cart, useCartsStore } from '@/stores/cartsStore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Alert } from 'react-native'

export const saveCartToDatabase = async (
   restaurantId: string,
   cartId: string
): Promise<boolean> => {
   try {
      if (!cartId || !cartId) return false
      const cart = useCartsStore.getState().getCart(restaurantId)
      if (!cart) {
         console.log('Cart not found')
         Alert.alert('Cart not found')
         return false
      }
      console.log('Saving cart to database')

      // Save cart to database

      const savedCart: Cart = { ...cart, isShared: true, id: cartId }
      const cartDoc = doc(cartsCollection, cartId)
      await setDoc(cartDoc, { ...savedCart })
      useCartsStore.getState().updateCart(restaurantId, { ...savedCart })
      return true
   } catch (error) {
      console.log('Error saving cart to database', error)
      return false
   }
}

export const getCartFromDatabase = async (cartId: string): Promise<Cart | null> => {
   try {
      const cartDoc = doc(cartsCollection, cartId)
      const cart = await getDoc(cartDoc)
      if (!cart.exists()) return null

      const cartData = { ...cart.data(), id: cart.id }
      return cartData as Cart
   } catch (error) {
      console.log('Error getting cart from database', error)
      return null
   }
}
