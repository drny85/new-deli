import { Stack } from 'expo-router'

const CartLayout = () => {
   return (
      <Stack screenOptions={{ headerShown: false }}>
         <Stack.Screen name="cart" />
      </Stack>
   )
}

export default CartLayout
