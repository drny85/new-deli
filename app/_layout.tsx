import { fonts } from '@/constants/fonts'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useDevRoutes } from '@/hooks/useDevRoutes'
import { useLinking } from '@/hooks/useLinking'
import { useNotificationObserver } from '@/hooks/useNotificationObserver'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useUpdateChecker } from '@/hooks/useUpdateChecker'
import { AuthProvider } from '@/providers/authProvider'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { router, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useCallback, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated'

// This is the default configuration
configureReanimatedLogger({
   level: ReanimatedLogLevel.warn,
   strict: false // Reanimated runs in strict mode by default
})

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({
   duration: 1000,
   fade: true
})

export default function RootLayout() {
   const colorScheme = useColorScheme()
   const [appIsReady, setAppIsReady] = useState(false)
   const iconColor = useThemeColor('text')
   const bgColor = useThemeColor('background')
   const [loaded] = useFonts(fonts)
   useUpdateChecker()
   useLinking()
   useNotificationObserver()
   useDevRoutes()

   useEffect(() => {
      async function prepare() {
         try {
            // Pre-load fonts, make any API calls you need to do here

            // Artificially delay for two seconds to simulate a slow loading
            // experience. Please remove this if you copy and paste the code!
            await new Promise((resolve) => setTimeout(resolve, 1000))
         } catch (e) {
            console.warn(e)
         } finally {
            // Tell the application to render
            setAppIsReady(true)
         }
      }

      prepare()
   }, [])

   const onLayoutRootView = useCallback(() => {
      if (appIsReady && loaded) {
         // This tells the splash screen to hide immediately! If we call this after
         // `setAppIsReady`, then we may see a blank screen while the app is
         // loading its initial state and rendering its first pixels. So instead,
         // we hide the splash screen once we know the root view has already
         // performed layout.
         SplashScreen.hide()
      }
   }, [appIsReady, loaded])

   if (!appIsReady || !loaded) {
      return null
   }

   return (
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
         <BottomSheetModalProvider>
            <AuthProvider>
               <ThemeProvider
                  value={
                     colorScheme === 'dark'
                        ? {
                             ...DarkTheme,
                             colors: {
                                ...DarkTheme.colors,
                                background: bgColor,
                                text: iconColor
                             }
                          }
                        : {
                             ...DefaultTheme,
                             colors: {
                                ...DefaultTheme.colors,
                                background: bgColor,
                                text: iconColor
                             }
                          }
                  }>
                  <Stack
                     screenOptions={{
                        animation: 'slide_from_bottom'
                     }}>
                     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                     <Stack.Screen name="(deli)" options={{ headerShown: false }} />
                     <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                     <Stack.Screen name="stripe-portal" options={{ headerShown: false }} />
                     <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                     <Stack.Screen name="(modals)" options={{ headerShown: false }} />
                     {/* <Stack.Screen name="(modals)/(restaurants)" options={{ headerShown: false }} />
                  <Stack.Screen name="(modals)/(orders)" options={{ headerShown: false }} />
                  <Stack.Screen name="(modals)/(business)" options={{ headerShown: false }} /> */}
                     <Stack.Screen
                        name="business-terms"
                        options={{
                           title: 'Terms of Use',
                           headerStyle: {
                              backgroundColor: bgColor
                           },
                           headerLeft: ({ canGoBack }) => (
                              <Feather
                                 name="chevron-left"
                                 size={26}
                                 color={iconColor}
                                 onPress={() => canGoBack && router.back()}
                              />
                           ),

                           presentation: 'fullScreenModal'
                        }}
                     />
                     <Stack.Screen
                        name="terms"
                        options={{
                           title: 'Terms of Use',
                           headerLeft: ({ canGoBack }) => (
                              <FontAwesome
                                 name="chevron-left"
                                 size={26}
                                 color={iconColor}
                                 onPress={() => canGoBack && router.back()}
                              />
                           ),

                           presentation: 'fullScreenModal'
                        }}
                     />
                     <Stack.Screen
                        name="privacy"
                        options={{
                           headerLeft: ({ canGoBack }) => (
                              <Feather
                                 name="chevron-left"
                                 size={28}
                                 color={iconColor}
                                 onPress={() => canGoBack && router.back()}
                              />
                           ),
                           title: 'Privacy Policy',
                           headerBackTitle: 'Back',
                           presentation: 'fullScreenModal'
                        }}
                     />
                     <Stack.Screen name="+not-found" />
                     <Stack.Screen
                        name="address"
                        options={{
                           presentation: 'modal',

                           title: 'Addresses',
                           headerStyle: { backgroundColor: bgColor },
                           headerLeft: () => (
                              <TouchableOpacity
                                 style={{ padding: 6 }}
                                 onPress={() => router.back()}>
                                 <FontAwesome name="close" size={28} color={iconColor} />
                              </TouchableOpacity>
                           )
                        }}
                     />
                     <Stack.Screen
                        name="second-address"
                        options={{
                           presentation: 'modal',
                           animation: 'fade',

                           title: 'Address Info',
                           headerStyle: { backgroundColor: bgColor },
                           headerLeft: () => (
                              <TouchableOpacity onPress={() => router.back()}>
                                 <Feather name="chevron-left" size={28} color={iconColor} />
                              </TouchableOpacity>
                           )
                        }}
                     />
                  </Stack>
               </ThemeProvider>
            </AuthProvider>
         </BottomSheetModalProvider>
      </GestureHandlerRootView>
   )
}
