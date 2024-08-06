import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import { Text } from '@/components/ThemedText'
import { SIZES } from '@/constants/Colors'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { router, useLocalSearchParams } from 'expo-router'
import { MotiView } from 'moti'
import React, { useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import WebView, { WebViewNavigation } from 'react-native-webview'

const StripeOnboarding = () => {
   const { url } = useLocalSearchParams<{ url: string }>()
   const [loading, setLoading] = useState(false)
   const webViewRef = useRef<WebView>(null)
   const ascentColor = useThemeColor('ascent')
   const { user } = useAuth()
   const { restaurant } = useRestaurant(user?.id!)
   const getParams = (url: string) => {
      let regexp = /[?&]([^=#]+)=([^&#]*)/g
      let params: any = {}
      let check
      while ((check = regexp.exec(url))) {
         params[check[1]] = check[2]
      }
      return params
   }

   console.log(JSON.stringify(restaurant, null, 2))

   const checkForAccountSuccefullCreation = async (url: string): Promise<boolean> => {
      try {
         if (url.includes('/return_url')) {
            const { accountId } = getParams(url)
            console.log('ACC => ', accountId)
            // const func = checkForConnectedAccount(
            //     'addConnectedAccountToBusiness'
            // );
            // const { data } = await func({ accountId });
            //  connectedStore()
            // if (!data.success) {
            //     await dispatch(updateUser({ ...user!, status: 'pending' }));
            // }

            return true
         } else {
            return false
         }
      } catch (error) {
         console.log(error)
         return false
      }
   }

   const handleNavigationChanges = async (newNavState: WebViewNavigation) => {
      const { url, loading } = newNavState

      try {
         console.log('URL =>', url, loading)
         setLoading(loading)
         const success = await checkForAccountSuccefullCreation(url)
         console.log('SUCCESS =>', success)
         if (success) {
            //navigation.navigate('BusinessCreatedSuccesfull')
            router.replace('/account-success')
         } else {
            console.log('HERE')
            // await checkForNonCompletion(url)
         }
      } catch (error) {
         console.log('ERROR =>', error)
      } finally {
         setLoading(false)
      }
   }
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
         <WebView
            style={{ flex: 1, marginTop: SIZES.statusBarHeight }}
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ uri: url }}
            onNavigationStateChange={handleNavigationChanges}
            sharedCookiesEnabled={true}></WebView>
      </Container>
   )
}

export default StripeOnboarding
