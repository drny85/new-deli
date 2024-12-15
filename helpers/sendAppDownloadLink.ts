import { Alert, Platform } from 'react-native'
import * as Linking from 'expo-linking'

export const sendAppDoanloadLink = async (
   phoneNumber: string,
   message: string
): Promise<boolean> => {
   try {
      const smsUrl = `sms:${phoneNumber}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(message)}`

      const supported = await Linking.canOpenURL(smsUrl)
      if (!supported) {
         Alert.alert('Error', 'SMS is not supported on this device.')
         return false
      } else {
         Linking.openURL(smsUrl)
            .then(() => {
               Alert.alert('Success', 'SMS sent successfully')
               return true
            })
            .catch((err) => {
               Alert.alert('Error', 'Failed to send SMS: ' + err)
               return false
            })
      }
      return true
   } catch (error) {
      Alert.alert('Error', 'Failed to send SMS: ' + error)
      return false
   }
}
