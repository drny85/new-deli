import { placeOrder } from '@/actions/orders'
import { ordersCollection } from '@/collections'
import { SIZES } from '@/constants/Colors'
import { fetchPaymentParams } from '@/firebase'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { PaymentIntentParams } from '@/shared/types'
import { stripeFee } from '@/utils/stripeFee'
import { toastAlert, toastMessage } from '@/utils/toast'
import {
   initPaymentSheet,
   presentPaymentSheet,
   StripeProvider,
   useStripe
} from '@stripe/stripe-react-native'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import { getDocs, query, where } from 'firebase/firestore'
import LottieView from 'lottie-react-native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert } from 'react-native'
import Constants from 'expo-constants'
type Props = {
   children: React.ReactElement
   cartTotal: number
   businessName: string
   connectedId: string
}

function getUrl(path = '') {
   if (path === '') {
      Linking.createURL(path)
   }
   return Linking.createURL(path)
}
const ENV =
   process.env.NODE_ENV === 'production'
      ? process.env.EXPO_PUBLIC_STRIPE_LIVE_PK!
      : process.env.EXPO_PUBLIC_STRIPE_TEST_PK!

const StripeProviderComponent = ({ children, cartTotal, businessName, connectedId }: Props) => {
   const backgroundColor = useThemeColor('background')
   const { handleURLCallback } = useStripe()
   const { user } = useAuth()
   const textColor = useThemeColor('text')
   const ascentColor = useThemeColor('ascent')
   const { order, initiatePayment, setInitiatePayment, orderType, tipAmount, setReOrder } =
      useOrderFlowStore()
   const total = useMemo((): number => {
      return +(cartTotal + tipAmount + stripeFee(cartTotal, orderType)).toFixed(2)
   }, [cartTotal, tipAmount])

   const [loading, setLoading] = useState(false)

   const handleDeepLink = useCallback(
      async (url: string | null) => {
         if (url) {
            const stripeHandled = await handleURLCallback(url)

            if (stripeHandled) {
               return
            }
         }
      },
      [handleURLCallback]
   )

   const getOrderNumber = async (): Promise<number | null> => {
      try {
         const ordersRef = query(ordersCollection, where('businessId', '==', order?.businessId))
         const orders = await getDocs(ordersRef)
         return orders.size + 1
      } catch (error) {
         console.log(error)
         return null
      }
   }

   const fetchPaymentSheetParams = async () => {
      try {
         setLoading(true)
         if (!order || !connectedId) return
         console.log(order.id, total, connectedId)
         const func = fetchPaymentParams()

         const { data } = await func({
            orderId: order?.id!,
            total: total,
            connectedId: connectedId
         })
         console.log(data)

         if (!data.success)
            return toastAlert({
               message: `Something went wrong, ${data.result}`,
               title: 'Error',
               preset: 'error',
               duration: 2
            })
         initializePaymentSheet(data.result)
      } catch (error) {
         console.log(error)
         const err = error as Error
         Alert.alert('Error Fetching', err.message)
      } finally {
         setLoading(false)
      }
   }

   const initializePaymentSheet = async (params: PaymentIntentParams) => {
      try {
         setLoading(false)
         const { error } = await initPaymentSheet({
            merchantDisplayName: `${businessName} via Your Deli`,
            customerId: params.customer,
            customerEphemeralKeySecret: params.ephemeralKey,
            paymentIntentClientSecret: params.paymentIntent,
            // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
            //methods that complete payment after a delay, like SEPA Debit and Sofort.
            allowsDelayedPaymentMethods: false,

            defaultBillingDetails: {
               name: order?.contactPerson.lastName + ' ' + order?.contactPerson.lastName,
               email: user?.email,
               phone: order?.contactPerson.phone
               //  address: {
               //     city: order.shippingAddress.city,
               //     line1: order.shippingAddress.address,
               //     line2: order.shippingAddress.address2,
               //     postalCode: order.shippingAddress.zip,
               //     state: order.shippingAddress.state
               //  }
            },

            returnURL: getUrl('new-deli://'),
            applePay: {
               merchantCountryCode: 'US'
            },
            googlePay: {
               merchantCountryCode: 'US',
               currencyCode: 'usd',
               testEnv: true
            },
            appearance: {
               primaryButton: {
                  colors: {
                     background: ascentColor,
                     text: '#ffffff'
                  },
                  shapes: {
                     borderRadius: SIZES.md,
                     borderWidth: 0
                  }
               },
               shapes: {
                  borderRadius: SIZES.md,
                  borderWidth: 0
               },

               colors: {
                  background: backgroundColor,
                  primaryText: textColor
               }
            }
         })
         if (!error) {
            setLoading(true)
            openPaymentSheet(params.paymentIntentId)
         } else {
            console.log('EEEE', error)
         }
      } catch (error) {
         console.log('Error initializing payment', error)
      } finally {
         setLoading(false)
      }
   }

   const openPaymentSheet = useCallback(
      async (paymentIntent: string) => {
         // see below

         if (!order) return
         const { error } = await presentPaymentSheet()

         if (error) {
            setInitiatePayment(false)
            return toastAlert({
               message: `${(error.code, error.message)}`,
               title: 'Warning',
               preset: 'error',
               duration: 2
            })
            // return Alert.alert(`Error code: ${error.code}`, error.message)
         } else {
            const orderNumber = await getOrderNumber()
            const { success, orderId } = await placeOrder({
               ...order,
               paymentIntent,
               orderNumber: orderNumber || 0,
               orderDate: new Date().toISOString()
            })

            if (success && orderId) {
               setInitiatePayment(false)
               setReOrder(false)
               router.dismissAll()
               router.replace({ pathname: `/order-success`, params: { orderId } })
               toastMessage({
                  message: 'Order placed successfully',
                  title: 'Success',
                  preset: 'done',
                  duration: 2
               })
               //setOrder(null)
            } else {
               console.log('Something happened processing the order')
            }
         }
      },
      [order]
   )

   useEffect(() => {
      const getUrlAsync = async () => {
         const initialUrl = await Linking.getInitialURL()
         handleDeepLink(initialUrl)
      }

      getUrlAsync()

      const deepLinkListener = Linking.addEventListener('url', (event: { url: string }) => {
         handleDeepLink(event.url)
      })

      return () => deepLinkListener.remove()
   }, [handleDeepLink])

   useEffect(() => {
      if (initiatePayment) {
         fetchPaymentSheetParams()
      }

      return () => setInitiatePayment(false)
   }, [initiatePayment])

   if (loading)
      return (
         <LottieView
            style={{ flex: 1, backgroundColor }}
            autoPlay
            loop
            source={require('@/assets/animations/stripe_loading_light.json')}
         />
      )
   if (!ENV) throw new Error('Missing Stripe Publishable Key')

   return (
      <StripeProvider
         threeDSecureParams={{
            backgroundColor,
            timeout: 8
         }}
         publishableKey={ENV}
         urlScheme="new-deli"
         merchantIdentifier="merchant.net.robertdev.deli.app">
         {children}
      </StripeProvider>
   )
}

export default StripeProviderComponent
