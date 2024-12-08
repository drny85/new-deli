import Loading from '@/components/Loading'
import { View } from '@/components/ThemedView'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect } from 'react'

import { useThemeColor } from '@/hooks/useThemeColor'
import * as WebBroswer from 'expo-web-browser'
WebBroswer.warmUpAsync()

const StripeEarningPage = () => {
   const { url } = useLocalSearchParams<{ url: string }>()

   const ascent = useThemeColor('ascent')

   useEffect(() => {
      if (url) {
         WebBroswer.openBrowserAsync(url, {
            presentationStyle: WebBroswer.WebBrowserPresentationStyle.FULL_SCREEN,
            toolbarColor: ascent,
            controlsColor: '#ffffff',
            dismissButtonStyle: 'close',
            enableDefaultShareMenuItem: false,
            showInRecents: false,
            windowFeatures: {
               statusBar: 'hidden'
            }
         })
            .then((v) => {
               if (v.type === 'cancel') {
                  WebBroswer.dismissBrowser()
                  router.back()
               }
            })
            .catch((e) => {
               console.log('ERROR', e)
            })
      }
   }, [url])

   if (!url) return <Loading />
   // if (loading) return <Loading />
   return <View />
}

export default StripeEarningPage
