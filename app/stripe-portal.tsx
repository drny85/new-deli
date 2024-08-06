import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import { View } from '@/components/ThemedView'
import { useLocalSearchParams } from 'expo-router'
import React, { useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import WebView, { WebViewNavigation } from 'react-native-webview'

const StripeEarningPage = () => {
   const { url } = useLocalSearchParams<{ url: string }>()
   const webviewRef = useRef<WebView>(null)
   const [loading, setLoading] = useState(false)

   const handleNavigationChanges = async (newNavState: WebViewNavigation) => {
      const { url, loading } = newNavState
      console.log(loading, url)
      setLoading(loading)

      try {
      } catch (error) {
         console.log('ERROR =>', error)
      }
   }

   if (!url) return null
   // if (loading) return <Loading />
   return (
      <Container>
         <View style={{ alignSelf: 'center', width: '20%' }}>
            <Button title="Exit" type="soft" onPress={() => webviewRef.current?.goBack()} />
         </View>
         <WebView
            style={{ flex: 1 }}
            originWhitelist={['*']}
            ref={webviewRef}
            source={{ uri: url }}
            onNavigationStateChange={handleNavigationChanges}
            sharedCookiesEnabled={true}
         />
      </Container>
   )
}

export default StripeEarningPage

const styles = StyleSheet.create({})
