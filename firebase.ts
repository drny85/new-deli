import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getReactNativePersistence, initializeAuth, User } from 'firebase/auth'
// import { getFunctions } from 'firebase/functions';
import { collection, CollectionReference, DocumentData, getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import { ConnectedAccountParams, PaymentIntentParams, StripeResponse } from '@/shared/types'
import { getFunctions, httpsCallable } from 'firebase/functions'

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase

const firebaseConfig = {
   apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
   authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
   projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
   storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
   appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
   measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})

const db = getFirestore(app)

const storage = getStorage(app)

const functions = getFunctions(app, 'us-central1')
export const createCollection = <T = DocumentData>(collectionName: string) => {
   return collection(db, collectionName) as CollectionReference<T>
}
export const isEmailVerified = httpsCallable<{ email: string }, { user: User | null }>(
   functions,
   'checkIfEmailIsVerified'
)

export const getStripeExpressLink = httpsCallable<
   { businessId: string; mode?: 'live' | 'test' },
   StripeResponse
>(functions, 'getStripeLink')
export const fetchPaymentParams = () =>
   httpsCallable<
      { connectedId: string; total: number; orderId: string },
      { success: boolean; result: PaymentIntentParams }
   >(functions, 'createPaymentIntent')
export const connectedStore = () =>
   httpsCallable<ConnectedAccountParams, StripeResponse>(
      functions,
      'createConnectedBusinessAccount'
   )

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export { auth, db, storage }
