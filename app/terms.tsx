import TermsOfUseScreen from '@/components/profile/TermsOfUse'
import { useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'

const Terms = () => {
   const navigation = useNavigation()
   useLayoutEffect(() => {
      navigation.setOptions({
         title: 'Terms of Use'
      })
   }, [navigation])
   return <TermsOfUseScreen />
}

export default Terms
