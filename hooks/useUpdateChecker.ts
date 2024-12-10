import { useEffect } from 'react'
import { Alert } from 'react-native'
import * as Updates from 'expo-updates'
import { useRouter } from 'expo-router'

export const useUpdateChecker = () => {
   const router = useRouter()

   useEffect(() => {
      if (__DEV__) {
         return
      }
      const checkForUpdates = async () => {
         try {
            const update = await Updates.checkForUpdateAsync()
            if (update.isAvailable) {
               Alert.alert(
                  'Update Available',
                  'A new version of the app is available. Would you like to update now?',
                  [
                     {
                        text: 'Later',
                        style: 'cancel'
                     },
                     {
                        text: 'Update',
                        onPress: async () => {
                           try {
                              await Updates.fetchUpdateAsync()
                              await Updates.reloadAsync() // Apply the update and restart the app
                           } catch (error) {
                              Alert.alert(
                                 'Error',
                                 'Could not apply the update. Please try again later.'
                              )
                           }
                        }
                     }
                  ]
               )
            }
         } catch (error) {
            console.error('Error checking for updates:', error)
         }
      }

      checkForUpdates()
   }, [router])
}
