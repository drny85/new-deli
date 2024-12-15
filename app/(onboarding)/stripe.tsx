import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import { Text } from '@/components/ThemedText'
import { SIZES } from '@/constants/Colors'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { router, useLocalSearchParams } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
WebBrowser.warmUpAsync()

const StripeOnboarding = () => {
   const { url } = useLocalSearchParams<{ url: string }>()
   const ascentColor = useThemeColor('ascent')
   const { user } = useAuth()
   const { restaurant } = useRestaurant(user?.id || '')

   console.log('RES', JSON.stringify(restaurant, null, 2))

   const init = async () => {
      try {
         const result = await WebBrowser.openBrowserAsync(url, {
            createTask: true,
            controlsColor: ascentColor,
            dismissButtonStyle: 'close',
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
            toolbarColor: 'grey'
         })
         console.log('RESULT =>', result)
         if (result.type === 'cancel') {
            console.log('SUCCESS')
            router.back()
            // await checkForAccountSuccefullCreation(result.url)
         }
      } catch (error) {
         console.log('Error init', error)
      }
   }

   useEffect(() => {
      if (!url) return
      init()
   }, [url])

   useEffect(() => {
      if (!restaurant?.charges_enabled) return
      WebBrowser.dismissBrowser()
      WebBrowser.dismissAuthSession()

      router.replace('/(deli)/(orders)/no-courriers')
   }, [restaurant])
   if (!url) return <Loading />
   return (
      <Container>
         <MotiView
            style={{
               top: SIZES.sm,
               alignSelf: 'center',
               height: 28,

               paddingHorizontal: SIZES.md,
               backgroundColor: ascentColor,
               zIndex: 100,
               alignItems: 'center',
               justifyContent: 'center',
               borderRadius: 30
            }}
            from={{ scale: 0, translateY: -20 }}
            animate={{ scale: 1, translateY: 0 }}
            transition={{ duration: 600 }}>
            <TouchableOpacity onPress={() => router.back()}>
               <Text center type="defaultSemiBold" textColor="white">
                  Exit
               </Text>
            </TouchableOpacity>
         </MotiView>
      </Container>
   )
}

export default StripeOnboarding
