import TermsOfUse from '@/components/business/Agreement'
import { useNavigation } from 'expo-router'
import { useLayoutEffect } from 'react'

const Terms = () => {
   const navigation = useNavigation()
   useLayoutEffect(() => {
      navigation.setOptions({
         title: 'Terms of Use'
      })
   }, [navigation])
   return <TermsOfUse onPressDisagree={() => navigation.goBack()} />
}

export default Terms
