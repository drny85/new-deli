/* eslint-disable @typescript-eslint/no-require-imports */
import { Redirect, Tabs } from 'expo-router'

import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useAuth } from '@/providers/authProvider'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useNotifications } from '@/hooks/useNotification'
import { Image } from 'expo-image'

export default function TabLayout() {
   const colorScheme = useColorScheme()
   const { user } = useAuth()
   const { loading, restaurant } = useRestaurant(user?.id || '')
   useNotifications()
   if (loading) return null
   if (!user || user.type !== 'business') return <Redirect href={'/(tabs)/(restaurants)'} />
   if (!user || (user.type === 'business' && !restaurant?.charges_enabled))
      return <Redirect href={'/(onboarding)'} />

   if (user && user.type !== 'business') return <Redirect href={'/(tabs)/(restaurants)'} />

   return (
      <>
         <Tabs
            screenOptions={{
               headerShadowVisible: false,
               tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
               headerShown: false,
               tabBarLabelStyle: {
                  fontFamily: 'Montserrat',
                  fontWeight: '600'
               },
               tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background }
            }}>
            <Tabs.Screen
               name="(home)"
               options={{
                  title: 'Home',
                  tabBarIcon: ({ color, focused }) => (
                     <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                  )
               }}
            />
            <Tabs.Screen
               name="(orders)"
               options={{
                  title: 'Orders',
                  tabBarIcon: ({ color, size }) => (
                     <Image
                        source={require('@/assets/images/orders.png')}
                        tintColor={color}
                        style={{ width: size, height: size, objectFit: 'contain' }}
                     />
                  )
               }}
            />
            <Tabs.Screen
               name="(products)"
               options={{
                  title: 'Products',
                  tabBarIcon: ({ color, focused }) => (
                     <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} />
                  )
               }}
            />

            <Tabs.Screen
               name="(couriers)"
               options={{
                  title: 'Couriers',
                  tabBarIcon: ({ color, focused }) => (
                     <TabBarIcon name={focused ? 'car' : 'car-outline'} color={color} />
                  )
               }}
            />

            <Tabs.Screen
               name="(settings)"
               options={{
                  title: 'Settings',
                  tabBarIcon: ({ color, focused }) => (
                     <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
                  )
               }}
            />
         </Tabs>
      </>
   )
}
