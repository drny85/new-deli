import { usersCollection } from '@/collections'
import { auth } from '@/firebase'
import { useAuth } from '@/providers/authProvider'
import { AppUser } from '@/shared/types'

import * as Google from 'expo-auth-session/providers/google'
import * as WebBrowser from 'expo-web-browser'
import { GoogleAuthProvider, User, signInWithCredential } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useCallback, useEffect } from 'react'
import { TouchableOpacity } from 'react-native'
import NeoView from '../NeoView'
import { toastMessage } from '@/utils/toast'
import { AntDesign } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'

WebBrowser.maybeCompleteAuthSession()

const SigninWithGoogle = () => {
   const { setUser, createUser } = useAuth()
   const ascentColor = useThemeColor('ascent')

   const [request, response, promptAsync] = Google.useAuthRequest({
      //expoClientId: process.env.EXPO_WEB_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      androidClientId: '1079176907860-a88guem03pcas0kg9met2c4ejagetapf.apps.googleusercontent.com',
      webClientId: process.env.EXPO_PUBLIC_EXPO_WEB_CLIENT_ID
   })

   const createOrSignInFirebaseUser = useCallback(async (user: User) => {
      try {
         const userRef = doc(usersCollection, user.uid)
         const currentUser = await getDoc(userRef)
         if (currentUser.exists()) {
            setUser({ ...currentUser.data(), id: user.uid })
            return
         }

         const newUser: AppUser = {
            id: user.uid,
            name: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ')[1] || '',
            email: user.email || '',
            deliveryAddresses: [],
            phone: user.phoneNumber || '',
            type: 'consumer',
            emailVerified: user.emailVerified,
            image: user.photoURL || '',
            favoritesStores: [],
            provider: 'google',
            createdAt: new Date().toISOString(),
            coords: null
         }
         createUser(newUser)
         //dispatch(createUser(newUser))
      } catch (error) {
         console.log(error)
         const err = error as Error
         return err
      }
   }, [])

   useEffect(() => {
      if (!response) return
      if (response?.type === 'success') {
         if (response.params.error || !response.params.id_token) {
            console.log(response.params.error)

            return
         }
         const credential = GoogleAuthProvider.credential(response.params.id_token)

         signInWithCredential(auth, credential)
            .then(({ user }) => {
               createOrSignInFirebaseUser(user)
            })
            .catch((error) => {
               console.log(error)
            })
      } else {
         if (response?.type === 'cancel') {
            toastMessage({
               message: 'You canceled this request',
               title: 'Canceled',
               preset: 'error',
               haptic: 'error',
               position: 'bottom'
            })
         }
      }
   }, [response])
   return (
      <NeoView rounded size={60}>
         <TouchableOpacity onPress={() => promptAsync()}>
            <AntDesign name="google" size={32} color={ascentColor} />
         </TouchableOpacity>
      </NeoView>
   )
}

export default SigninWithGoogle
