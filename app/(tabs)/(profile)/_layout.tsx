import { Stack } from 'expo-router'

const ProfileLayout = () => {
   return (
      <Stack>
         <Stack.Screen options={{ headerShown: false }} name="profile" />
      </Stack>
   )
}

export default ProfileLayout
