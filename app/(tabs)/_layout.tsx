/* eslint-disable @typescript-eslint/no-require-imports */
import { Redirect, Tabs } from 'expo-router'
import React from 'react'

import { TabBarIcon } from '@/components/navigation/TabBarIcon'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useThemeColor } from '@/hooks/useThemeColor'

import { useAuth } from '@/providers/authProvider'
import { useCartsStore } from '@/stores/cartsStore'

import { Image } from 'expo-image'

export default function TabLayout() {
   const colorScheme = useColorScheme()
   const secondary = useThemeColor('ascent')

   const carts = useCartsStore((s) => s.carts)
   const { user } = useAuth()

   if (user && user.type === 'business' && user.emailVerified)
      return <Redirect href={'/(deli)/home'} />

   if (user && user.type === 'business' && !user.emailVerified)
      return <Redirect href={'/(onboarding)'} />

   return (
      <Tabs
         initialRouteName="(restaurants)"
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
            name="(restaurants)"
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
            name="(favorites)"
            options={{
               title: 'Favorites',
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'heart' : 'heart-outline'} color={color} />
               )
            }}
         />
         <Tabs.Screen
            name="(carts)"
            options={{
               title: 'Carts',
               headerShown: false,
               tabBarBadge: carts.length > 0 ? `${carts.length}` : undefined,
               tabBarBadgeStyle: { backgroundColor: secondary, color: '#ffffff' },
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />
               )
            }}
         />
         <Tabs.Screen
            name="(profile)"
            options={{
               title: 'Me',
               tabBarIcon: ({ color, focused }) => (
                  <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
               )
            }}
         />
      </Tabs>
   )
}
