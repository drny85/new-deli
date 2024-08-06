import PrivacyPolicyScreen from '@/components/profile/PrivacyPolicyScreen'
import { Stack } from 'expo-router'

const Privacy = () => {
   return (
      <>
         <Stack screenOptions={{ title: 'Me' }} />
         <PrivacyPolicyScreen />
      </>
   )
}

export default Privacy
