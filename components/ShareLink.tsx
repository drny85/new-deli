import { saveCartToDatabase } from '@/actions/cart'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { toastMessage } from '@/utils/toast'
import { Feather } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import { Share, TouchableOpacity, useColorScheme } from 'react-native'

type Props = {
   id: string
   type: 'order' | 'cart' | 'restaurant' | 'product'
   ascentColor?: boolean
   cartId?: string
   disabled?: boolean
   params?: {}
}

const SITE_URL = process.env.EXPO_PUBLIC_WEBSITE_URL

const ShareButton: React.FC<Props> = ({
   id,
   cartId,
   type,
   ascentColor,
   disabled = false,
   params
}) => {
   const ascent = useThemeColor(ascentColor ? 'ascent' : 'text')
   const isDark = useColorScheme() === 'dark'
   const { user } = useAuth()
   const shareUrl = async () => {
      // Replace with your deep link URL

      try {
         if (!id) throw new Error('No URL provided')
         let createdUrl
         if (type === 'cart') {
            createdUrl = Linking.createURL('restaurant-cart', {
               queryParams: { restaurantId: cartId }
            })
         }
         if (type === 'order') {
            createdUrl = Linking.createURL('order', {
               queryParams: { orderId: id }
            })
         }
         if (type === 'restaurant') {
            createdUrl = Linking.createURL('restaurant', {
               queryParams: { restaurantId: id }
            })
         }

         if (type === 'product' && params) {
            createdUrl = Linking.createURL('product', {
               queryParams: params
            })
         }

         const websiteUrl = `https://${SITE_URL}/deepLinking?linking=${createdUrl}`
         console.log(websiteUrl)
         const share = await Share.share(
            {
               title: 'Share URL',
               message: `${user?.name ? user.name : 'Someone'} would like to share this ${type} with you.\n\n${websiteUrl}`
            },
            {
               dialogTitle: 'Share URL'
            }
         )
         if (share.action === Share.sharedAction) {
            if (type === 'cart' && cartId) {
               const cartShared = await saveCartToDatabase(id, cartId)
               if (cartShared)
                  toastMessage({
                     title: 'Success',
                     message: 'Cart shared successfully',
                     duration: 3,
                     preset: 'custom',
                     iconName: 'shared.with.you'
                  })
            }
            if (type === 'order') {
               toastMessage({
                  title: 'Success',
                  message: 'Order shared successfully',
                  duration: 3,
                  preset: 'custom',
                  iconName: 'shared.with.you'
               })
            }
            if (type === 'restaurant') {
               toastMessage({
                  title: 'Success',
                  message: 'Restaurant shared successfully',
                  duration: 3,
                  preset: 'custom',
                  iconName: 'shared.with.you'
               })
            }
         }
         if (share.action === Share.dismissedAction) {
            console.log('Dismissed')
         }
      } catch (error) {
         console.log('Error sharing URL:', error)
      }
   }

   return (
      <TouchableOpacity disabled={disabled} onPress={shareUrl}>
         <Feather name="share" size={30} color={isDark ? '#ffffff' : ascent} />
      </TouchableOpacity>
   )
}

export default ShareButton
