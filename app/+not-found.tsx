import { Link, Stack, usePathname } from 'expo-router'
import { StyleSheet } from 'react-native'

import { Container } from '@/components/Container'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function NotFoundScreen() {
   const backgroundColor = useThemeColor('background')
   const url = usePathname()
   console.log('CURRENT URL', url)
   return (
      <Container>
         <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
         <View style={[styles.container, { backgroundColor }]}>
            <Text>This screen doesn't exist.</Text>
            <Link href="/">
               <Text type="defaultSemiBold">Go to home screen!</Text>
            </Link>
         </View>
      </Container>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      gap: SIZES.lg
   },
   link: {
      marginTop: 15,
      paddingVertical: 15
   }
})
