import { Text } from '@/components/ThemedText'
import { SIZES } from '@/constants/Colors'
import { getStripeExpressLink } from '@/firebase'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { router, Stack } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Alert, TouchableOpacity } from 'react-native'

const SettingsBusinessLayout = () => {
   const { logOut, user } = useAuth()
   const backgroundColor = useThemeColor('background')
   const acentColor = useThemeColor('ascent')
   const [loading, setLoading] = useState(false)

   const getLink = async () => {
      if (!user) return
      try {
         setLoading(true)
         const { data } = await getStripeExpressLink({ businessId: user?.id!, mode: 'test' })
         const { success, result } = data
         console.log(data)
         if (success && result) {
            router.push({ pathname: '/stripe-portal', params: { url: result } })
         }
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   return (
      <Stack>
         <Stack.Screen
            name="settings"
            options={{
               title: 'Settings',
               headerShadowVisible: false,
               headerStyle: {
                  backgroundColor
               },
               headerLeft: () => {
                  return loading ? (
                     <ActivityIndicator size={'small'} color={acentColor} />
                  ) : (
                     <TouchableOpacity
                        disabled={loading}
                        onPress={getLink}
                        style={{ marginLeft: SIZES.md }}>
                        <Text fontSize="large" type="muted">
                           Earnings
                        </Text>
                     </TouchableOpacity>
                  )
               },
               headerRight: () => (
                  <TouchableOpacity
                     onPress={() =>
                        Alert.alert(
                           'Log out',
                           'Are you sure you want to log out?',
                           [
                              {
                                 text: 'Cancel',
                                 style: 'cancel'
                              },
                              {
                                 text: 'Log out',
                                 style: 'destructive',
                                 onPress: () => logOut()
                              }
                           ],
                           { cancelable: false }
                        )
                     }>
                     <Text style={{ fontWeight: '700' }} fontSize="large" type="muted">
                        Log out
                     </Text>
                  </TouchableOpacity>
               )
            }}
         />
      </Stack>
   )
}

export default SettingsBusinessLayout
