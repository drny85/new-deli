import { Stack } from 'expo-router'

const AuthLayout = () => {
   // if (user) return <Redirect href={'/(tabs)/(restaurants)'} />
   return (
      <Stack>
         <Stack.Screen options={{ headerShown: false }} name="login" />
         <Stack.Screen options={{ headerShown: false }} name="signup" />
         <Stack.Screen options={{ headerShown: false }} name="businessSignup" />
      </Stack>
   )
}

export default AuthLayout
