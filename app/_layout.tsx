import 'react-native-gesture-handler'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { router, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { AuthProvider } from '@/providers/authProvider'
import { fonts } from '@/constants/fonts'
import { TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useDevRoutes } from '@/hooks/useDevRoutes'
import { useLinking } from '@/hooks/useLinking'
import { useNotificationObserver } from '@/hooks/useNotificationObserver'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
   const colorScheme = useColorScheme()
   const iconColor = useThemeColor('text')
   const bgColor = useThemeColor('background')
   const [loaded] = useFonts(fonts)
   useLinking()
   useNotificationObserver()
   useDevRoutes()

   useEffect(() => {
      if (loaded) {
         SplashScreen.hideAsync()
      }
   }, [loaded])

   if (!loaded) {
      return null
   }

   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
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
                           <FontAwesome
                              name="chevron-left"
                              size={22}
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
                              size={22}
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
                           <FontAwesome
                              name="chevron-left"
                              size={22}
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
                           <TouchableOpacity style={{ padding: 6 }} onPress={() => router.back()}>
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
                              <FontAwesome name="chevron-left" size={22} color={iconColor} />
                           </TouchableOpacity>
                        )
                     }}
                  />
               </Stack>
            </ThemeProvider>
         </AuthProvider>
      </GestureHandlerRootView>
   )
}
