import { addNewBusiness } from '@/actions/business'
import { usersCollection } from '@/collections'
import { auth } from '@/firebase'
import { useCartsStore } from '@/stores/cartsStore'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { AppUser } from '@/typing'
import { FIREBASE_ERRORS } from '@/utils/firebaseErrorMessages'
import { toastAlert } from '@/utils/toast'
import {
   createUserWithEmailAndPassword,
   onAuthStateChanged,
   sendEmailVerification,
   signInWithEmailAndPassword,
   signOut,
   User
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

// Define custom user type

// Define types for AuthContext
interface AuthContextType {
   user: AppUser | null
   signIn: (email: string, password: string) => Promise<User | null>
   signUp: (
      email: string,
      password: string,
      phone: string,
      name: string,
      lastName: string,
      type: AppUser['type']
   ) => Promise<boolean>
   logOut: () => Promise<void>
   resetPasswordEmail: (email: string) => Promise<void>
   setUser: (user: AppUser) => void
   createUser: (user: AppUser) => void
   loading: boolean
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Custom hook to use AuthContext
export const useAuth = () => {
   const context = useContext(AuthContext)
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}

// AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
   const [user, setUser] = useState<AppUser | null>(null)
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
         try {
            if (newUser) {
               //const m =await newUser.metadata
               setLoading(true)

               const userDoc = doc(usersCollection, newUser.uid)
               const data = await getDoc(userDoc)
               if (!data.exists()) {
                  setLoading(false)
                  setUser(null)
                  return
               }
               setUser({ ...data.data(), emailVerified: newUser.emailVerified })
            } else {
               setUser(null)
            }
         } catch (error) {
            console.log('Error on authchanged', error)
         } finally {
            setLoading(false)
         }
      })

      return () => unsubscribe()
   }, [])

   const signIn = async (email: string, password: string): Promise<User | null> => {
      try {
         const { user } = await signInWithEmailAndPassword(auth, email, password)

         return user
      } catch (error) {
         console.error('Sign in error:', error)
         const err = error as Error
         toastAlert({
            title: 'Error',
            message: FIREBASE_ERRORS[err.message],
            preset: 'error',
            duration: 2
         })
         return null
      }
   }
   const createUser = async (user: AppUser): Promise<boolean> => {
      try {
         const userRef = doc(usersCollection, user.id)
         await setDoc(userRef, { ...user })
         if (user.type === 'business' && user.id) {
            await addNewBusiness(user.id)
         }
         return true
      } catch (error) {
         console.error('Create user error:', error)
         return false
      }
   }

   const signUp = async (
      email: string,
      password: string,
      name: string,
      lastName: string,
      phone: string,
      type: AppUser['type']
   ): Promise<boolean> => {
      try {
         const { user } = await createUserWithEmailAndPassword(auth, email, password)
         if (user) {
            //await createCourier(user.uid, email, phone);
            // await sendEmailVerification(user)
            const newUser: AppUser = {
               id: user.uid,
               email,
               name,
               lastName,
               phone,
               emailVerified: user.emailVerified,
               provider: 'email',
               coords: null,
               createdAt: new Date().toISOString(),
               favoritesStores: [],
               deliveryAddresses: [],
               type: type,
               status: 'completed'
            }

            if (type === 'business') {
               await sendEmailVerification(user)
            }
            await createUser(newUser)
            return true
         }
         return false
      } catch (error) {
         console.log('Sign up error:', error)
         const err = error as Error
         toastAlert({
            title: 'Error',
            message: FIREBASE_ERRORS[err.message],
            preset: 'error',
            duration: 2
         })
         return false
         // throw error
      }
   }

   const logOut = async () => {
      try {
         await signOut(auth)
         setUser(null)
         _resetState()
      } catch (error) {
         console.error('Sign out error:', error)
         throw error
      }
   }

   const _resetState = () => {
      useCartsStore.getState().clearCarts()
      useOrderFlowStore.getState().recentAddresses = []
      useOrderFlowStore.getState().setDeliveryAddress(null)
      useOrderFlowStore.getState().setOrder(null)
   }

   const resetPasswordEmail = async (email: string) => {
      try {
         //   await auth().sendPasswordResetEmail(email);
      } catch (error) {
         console.error('Reset password error:', error)
         throw error
      }
   }

   const authContextValue: AuthContextType = {
      user,
      signIn,
      signUp,
      logOut,
      setUser,
      loading,
      createUser,
      resetPasswordEmail
   }

   return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}
