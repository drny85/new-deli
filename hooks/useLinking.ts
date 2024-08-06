import { useEffect } from 'react'
import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import { useCartsStore } from '@/stores/cartsStore'
import { getCartFromDatabase } from '@/actions/cart'

export const useLinking = () => {
   const router = useRouter()
   const addCart = useCartsStore((s) => s.addCart)

   useEffect(() => {
      const handleDeepLink = async (event: { url: string }) => {
         try {
            const initialUrl = await Linking.getInitialURL()
            console.log('initialUrl', initialUrl)
            if (!initialUrl) return
            const data = Linking.parse(event.url)
            // Handle deep link data
            console.log('deepLinks Data', JSON.stringify(data, null, 2))
            if (data.hostname === 'restaurant-cart' && data.queryParams?.restaurantId) {
               const cartId = data.queryParams?.restaurantId
               if (!cartId) return
               const cart = await getCartFromDatabase(cartId as string)
               if (cart) {
                  const added = await addCart(cart)
                  if (added) {
                     router.push(`/restaurant-cart/${cartId}`)
                  }
               }
            } else if (data.hostname === 'order' && data.queryParams?.orderId) {
               const orderId = data.queryParams?.orderId
               if (!orderId) return
               router.push(`/order/${orderId}`)
            } else if (data.hostname === 'restaurant' && data.queryParams?.restaurantId) {
               router.dismiss()
               router.push({
                  pathname: '/restaurant',
                  params: { restaurantId: data.queryParams.restaurantId, categoryName: '' }
               })
            } else if (
               data.hostname === 'product' &&
               data.queryParams?.productId &&
               data.queryParams.businessId
            ) {
               router.dismiss()
               router.push({
                  pathname: '/product-details',
                  params: data.queryParams
               })
            } else {
               console.log('Unhandled deep link')
            }
         } catch (error) {
            console.error('Error handling deep link:', error)
         }
      }

      const listener = Linking.addEventListener('url', handleDeepLink)

      return () => {
         listener.remove()
      }
   }, [])
}
