import { TouchableOpacity } from 'react-native'

import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import ThemeToogle from '@/components/ThemeToggle'
import { useAuth } from '@/providers/authProvider'

import ModernSettingsPage from '@/components/ModernSettingsPage'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'

export default function ProfleScreen() {
   const { logOut, user } = useAuth()
   const textColor = useThemeColor('text')

   if (!user)
      return (
         <Container>
            <View style={{ alignSelf: 'center' }}>
               <ThemeToogle />
            </View>
            <View center>
               <View style={{ width: '60%' }}>
                  <Button
                     title="Login"
                     type="primary"
                     contentTextStyle={{ color: '#ffffff' }}
                     onPress={() =>
                        router.push({
                           pathname: '/login',
                           params: { returnUrl: '/(tabs)/(profile)/profile' }
                        })
                     }
                  />
               </View>
            </View>

            <View style={{ padding: SIZES.md, gap: SIZES.lg, marginBottom: SIZES.md }}>
               <TouchableOpacity onPress={() => router.push('/privacy')}>
                  <Row align="between">
                     <Text>Privacy Policy</Text>
                     <FontAwesome name="chevron-right" size={18} color={textColor} />
                  </Row>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => router.push('/terms')}>
                  <Row align="between">
                     <Text>Terms of Use</Text>
                     <FontAwesome name="chevron-right" size={18} color={textColor} />
                  </Row>
               </TouchableOpacity>
            </View>
         </Container>
      )

   return <ModernSettingsPage />
}
