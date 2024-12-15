import { usersCollection } from '@/collections'
import { SIZES } from '@/constants/Colors'
import { auth } from '@/firebase'
import { useAuth } from '@/providers/authProvider'
import { AppUser } from '@/shared/types'
import { AntDesign } from '@expo/vector-icons'
import * as AppleAuthentication from 'expo-apple-authentication'
import { OAuthProvider, User, signInWithCredential } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { StyleSheet, useColorScheme } from 'react-native'
import { toast } from 'sonner-native'

const provider = new OAuthProvider('apple.com')
const SigninWithApple = () => {
   const { setUser } = useAuth()
   const dark = useColorScheme() === 'dark'
   const createOrSignInFirebaseUser = async (
      user: User,
      name: AppleAuthentication.AppleAuthenticationFullName | null
   ) => {
      try {
         const userRef = doc(usersCollection, user.uid)
         const currentUser = await getDoc(userRef)
         if (currentUser.exists()) {
            setUser({ ...currentUser.data(), id: user.uid })
            return
         }

         const newUser: AppUser = {
            id: user.uid,
            name: name?.givenName || '',
            lastName: name?.familyName || '',
            email: user.email || '',
            deliveryAddresses: [],
            phone: '',
            type: 'consumer',
            emailVerified: user.emailVerified,
            favoritesStores: [],
            provider: 'apple',
            coords: null,
            createdAt: new Date().toISOString()
         }

         setUser(newUser)
      } catch (error) {
         const err = error as Error
         console.log(err)
      }
   }
   return (
      <AppleAuthentication.AppleAuthenticationButton
         role="button"
         buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
         buttonStyle={
            dark
               ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE
               : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
         }
         cornerRadius={SIZES.lg * 2}
         style={styles.button}
         onPress={async () => {
            const nonce = Math.random().toString(36).substring(2, 10)
            try {
               const response = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                     AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                     AppleAuthentication.AppleAuthenticationScope.EMAIL
                  ]
               })

               const { identityToken, fullName, email } = response

               if (!identityToken) {
                  throw new Error('No identityToken')
               }
               provider.addScope('email')
               provider.addScope('name')
               const credential = provider.credential({
                  idToken: identityToken,
                  rawNonce: nonce
               })
               const { user } = await signInWithCredential(auth, credential)

               if (!user) return
               await createOrSignInFirebaseUser(user, fullName)

               // signed in
            } catch (e: any) {
               if (e.code === 'ERR_REQUEST_CANCELED') {
                  // handle that the user canceled the sign-in flow
                  toast.warning('Sign In Canceled', {
                     description: 'You canceled this request',
                     duration: 2000,
                     icon: <AntDesign name="apple-o" size={28} color={dark ? 'white' : 'black'} />,
                     position: 'top-center'
                  })
               } else {
                  // handle other errors
                  console.log(e)
               }
            }
         }}
      />
   )
}

export default SigninWithApple

const styles = StyleSheet.create({
   button: {
      height: 60,
      width: 60
   }
})
