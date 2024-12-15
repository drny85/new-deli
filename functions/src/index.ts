/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as dotenv from 'dotenv'
import * as functions from 'firebase-functions'
import {
   FirestoreEvent,
   onDocumentCreated,
   onDocumentUpdated,
   QueryDocumentSnapshot
} from 'firebase-functions/v2/firestore'
import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https'
import * as logger from 'firebase-functions/logger'
import { getFirestore } from 'firebase-admin/firestore'
// import dayjs from 'dayjs'

import { getAuth, UserRecord } from 'firebase-admin/auth'
import { getApp, getApps, initializeApp } from 'firebase-admin/app'
import {
   AppUser,
   Business,
   CartItem,
   ConnectedParams,
   Courier,
   NOTIFICATION_TYPE,
   Order,
   ORDER_STATUS
} from '@shared/types'
import { v4 as UUID } from 'uuid'

dotenv.config()
getApps().length === 0 ? initializeApp() : getApp()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
// eslint-disable-next-line @typescript-eslint/no-require-imports
const twilio = require('twilio')(accountSid, authToken)

//import { v4 as UUID } from 'uuid'
interface Response {
   success: boolean
   result: string | null
}

import Stripe from 'stripe'
import {
   assignUserType,
   isAuthorizedToGrantAccess,
   notifySharedOrder,
   sendPushNotification
} from './shared'
import { defineSecret } from 'firebase-functions/params'
import { myTransaction_fee } from '@shared/types'

const STRIPE_KEY = defineSecret('STRIPE_KEY')
const TEST_KEY = process.env.STRIPE_SK_KEY as string

// const stripe = new Stripe(STRIPE_KEY.value(), {
//    apiVersion: '2024-04-10'
// })

// const STRIPE_= functions.config().stripe[process.env.S_KEY!] as string
// let stripe = new Stripe(STRIPE_KEY, {
//    apiVersion: '2024-04-10'
// })

exports.onCreateUSer = functions.auth.user().onCreate(async (user) => {
   try {
      const data = user.toJSON() as AppUser
      const stripe = new Stripe(process.env.STRIPE_SK_KEY!, {
         apiVersion: '2024-04-10'
      })
      const customer = await stripe.customers.create({
         email: data.email,
         metadata: { userId: user.uid }
      })

      return getFirestore()
         .collection('stripe_customers')
         .doc(user.uid)
         .set({ customer_id: customer.id })
   } catch (error) {
      const err = error as Error
      console.log(err.message)
      throw new functions.https.HttpsError(
         'aborted',
         `error while creating stripe customer: ${err.message}`
      )
   }
})

exports.createStripeCustomer = onDocumentCreated(
   '/users/{userId}',
   async (event: FirestoreEvent<QueryDocumentSnapshot | undefined>) => {
      try {
         if (event.type === 'google.firestore.document.update') return
         const data = event.data?.data() as AppUser
         const stripe = new Stripe(process.env.STRIPE_KEY!, {
            apiVersion: '2024-04-10'
         })
         if (!data) return
         const name = data?.name + ' ' + data?.lastName
         const alreadyCustomer = await getFirestore()
            .collection('stripe_customers')
            .doc(event.params.userId)
            .get()
         if (alreadyCustomer.exists) {
            const { customer_id } = alreadyCustomer.data() as {
               customer_id: string
            }
            await stripe.customers.update(customer_id, {
               name,
               phone: data.phone!
            })
         }

         if (data.email === 'melendez@robertdev.net') {
            await assignUserType(event.params.userId, 'admin')
            await getFirestore()
               .collection('users')
               .doc(event.params.userId)
               .update({ type: 'admin' })
         }

         return assignUserType(event.params.userId, data.type)
      } catch (error) {
         throw new functions.https.HttpsError(
            'aborted',
            'error while creating stripe customer',
            error
         )
      }
   }
)

exports.createConnectedBusinessAccount = onCall<ConnectedParams, any>(
   { secrets: [STRIPE_KEY] },
   async ({ data, auth }): Promise<Response> => {
      try {
         const { name, lastName, businessName, phone, type, mode } = data

         const email = auth?.token.email
         if (!email) return { success: false, result: 'no email found' }
         // const isAuth =
         //     data.type === 'courier'
         //         ? await isAuthorizedToGrantAccess(email!)
         //         : await isAuthorizedCourier(email);
         if (!auth)
            throw new functions.https.HttpsError('permission-denied', 'you are not authorized')

         const address =
            data.type === 'business' && data.address ? data.address.split(', ') : undefined

         const stripe = new Stripe(mode === 'test' ? TEST_KEY : STRIPE_KEY.value(), {
            apiVersion: '2024-04-10'
         })
         const userData = await getFirestore().collection('users').doc(auth.uid).get()
         if (!userData.exists) {
            return { success: false, result: 'no user found' }
         }
         const user = userData.data()

         const account = await stripe.accounts.create({
            type: 'express',
            country: 'US',
            email: email,
            business_type: 'individual',
            metadata: {
               businessId: auth?.uid,
               owner: name + ' ' + lastName,
               phone: phone,
               type: type
            },
            capabilities: {
               card_payments: { requested: true },
               transfers: { requested: true }
            },
            business_profile: {
               name: businessName,
               url: 'https://robertdev.net',
               mcc: type === 'courier' ? '4215' : undefined
            },
            individual: {
               last_name: lastName,
               first_name: name,
               address: address && {
                  line1: address[0],
                  city: address[1],
                  state: address[2].split(' ')[0],
                  postal_code: address[2].split(' ')[1],
                  country: 'US'
               },
               phone: user?.phone as string
            }
         })

         const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `https://robertdev.net/reauth?accountId=${account.id}`,
            return_url: `https://robertdev.net/return_url?accountId=${account.id}`,
            type: 'account_onboarding'
         })

         return { success: true, result: accountLink.url }
      } catch (error) {
         const err = error as any
         console.log('Error Creating Account Link', err.message)
         throw new functions.https.HttpsError('aborted', `${err.message}`, error)
      }
   }
)

exports.webhook = onRequest(
   { secrets: [STRIPE_KEY] },
   async (req: functions.https.Request, res: functions.Response<any>): Promise<any> => {
      const webhookSecret = process.env.WEBHOOK_CONNECTED
      const signature = req.headers['stripe-signature']
      const payloadData = req.rawBody
      const payloadString = payloadData.toString()
      let event
      const stripe = new Stripe(STRIPE_KEY.value(), {
         apiVersion: '2024-04-10'
      })

      try {
         if (!webhookSecret || !signature) return
         event = stripe.webhooks.constructEvent(payloadString, signature, webhookSecret)
         const webhookRef = getFirestore().collection('connectedAccounts').doc(event.id)

         const exists = (await webhookRef.get()).exists
         if (exists) return res.status(400).send('Already exists')
         const wkType = { type: event.type }
         const wkStatus = { status: 'new' }
         const eventType = { event_type: 'businessAccount' }
         const data = {
            ...wkStatus,
            ...wkType,
            ...eventType,
            ...event.data.object
         }

         await webhookRef.set(data)
         switch (event.type) {
            // ... handle other event type

            case 'account.updated':
               const updated = event.data.object as Stripe.Account

               const { charges_enabled, details_submitted, metadata } = updated
               console.log('DETAILS => ', details_submitted, charges_enabled)
               const bId = metadata?.businessId as string
               const businessType = metadata?.type as 'business' | 'courier'
               if (charges_enabled) {
                  if (businessType === 'courier') {
                     await getFirestore().collection('users').doc(bId).update({
                        stripeAccount: updated.id,
                        charges_enabled,
                        isActive: true,
                        status: 'completed'
                     })
                  } else if (businessType === 'business') {
                     await getFirestore().collection('business').doc(bId).update({
                        stripeAccount: updated.id,
                        charges_enabled,
                        isActive: true
                     })
                  }
                  await getAuth().setCustomUserClaims(bId, { type: businessType })
               }

               return res.status(200).send('Success')

            case 'account.application.deauthorized':
               const data = event.data.object
               const meta = data as any
               const businessId = meta?.metadata as any
               const id = businessId.businessId
               if (!id) return
               await getFirestore().collection('business').doc(id).update({
                  stripeAccount: null,
                  charges_enabled: false,
                  isActive: false
               })

               return res.status(200).send('Success')
            case 'account.external_account.created':
               return res.status(200).send('Success')

            default:
               console.log(`Unhandled event type ${event.type}`)
               functions.logger.error('Error', event.type)
               break
         }

         return res.status(200).send('Success')
      } catch (error) {
         console.log(error)
         logger.error('Error in webhook', error)
         return res.status(400).send(`Webhook Main Error:' ${error}`)
      }
   }
)

exports.deli = onRequest(
   { secrets: [STRIPE_KEY], cors: true },
   async (req: functions.https.Request, res: functions.Response<any>): Promise<any> => {
      const webhookSecret = process.env.WEBHOOK_DELI
      const signature = req.headers['stripe-signature']
      const payloadData = req.rawBody
      const payloadString = payloadData.toString()
      let event
      const stripe = new Stripe(process.env.STRIPE_SK_KEY!, {
         apiVersion: '2024-04-10'
      })

      try {
         if (!webhookSecret || !signature) return
         console.log('SIG', process.env.STRIPE_SK_KEY!)
         event = stripe.webhooks.constructEvent(payloadString, signature, webhookSecret)
         const webhookRef = getFirestore().collection('deli').doc(event.id)

         const exists = (await webhookRef.get()).exists
         if (exists) return res.status(400).send('Already exists')
         const wkType = { type: event.type }
         const wkStatus = { status: 'new' }
         const eventType = { event_type: 'deli' }
         const data = {
            ...wkStatus,
            ...wkType,
            ...eventType,
            ...event.data.object
         }

         await webhookRef.set(data)
         // Handle the event
         switch (event.type) {
            case 'payment_intent.payment_failed':
               const paymentIntent_failed = event.data.object as Stripe.PaymentIntent
               // Then define and call a function to handle the event payment_intent.payment_failed
               console.log(paymentIntent_failed)
               return res.status(404).send('payment failed ' + paymentIntent_failed.id)
            case 'payment_intent.requires_action':
               const paymentIntent_actions = event.data.object
               console.log(paymentIntent_actions)
               // Then define and call a function to handle the event payment_intent.requires_action
               break
            case 'payment_intent.succeeded':
               const { id, transfer_group, latest_charge, metadata } = event.data
                  .object as Stripe.PaymentIntent
               console.log('PAYMENT ID =>', id)
               const { orderId } = metadata
               const order = await getFirestore().collection('pendingOrders').doc(orderId).get()
               if (!order.exists) {
                  console.log('No Order with ID => ', order.id)
                  return res.status(404).send('no order found')
               }

               const { total, businessId } = order.data() as Order
               const business = await getFirestore().collection('business').doc(businessId).get()
               const bus = business.data() as Business
               const { stripeAccount, mode } = bus
               if (!stripeAccount) {
                  console.log('No Stripe Account', stripeAccount)
                  return res.status(404).send('no order found')
               }

               let myFee = (total * myTransaction_fee) / 100
               if (myFee >= 2) {
                  myFee = 2
               }

               const amountTobePaid = total - +myFee.toFixed(2)
               const fee = Math.round(+amountTobePaid.toFixed(2) * 100)

               const stripeRef =
                  mode === 'test'
                     ? new Stripe(process.env.STRIPE_SK_KEY!, {
                          apiVersion: '2024-04-10'
                       })
                     : stripe

               const transf = await stripeRef.transfers.create({
                  amount: fee,
                  currency: 'usd',
                  destination: stripeAccount!,
                  transfer_group: transfer_group!,
                  source_transaction: latest_charge?.toString(),
                  metadata: {
                     orderId,
                     to: bus.name,
                     businessId: business.id
                  }
               })

               await order.ref.delete()

               return res.status(200).send(transf.id)
            // Then define and call a function to handle the event payment_intent.succeeded

            case 'transfer.created':
               const eventT = event.data.object as Stripe.Transfer
               const orderID = eventT.metadata.orderId as string

               await getFirestore()
                  .collection('orders')
                  .doc(orderID)
                  .update({ transferId: eventT.id })
               return res.status(200).send(eventT.id)

            // Then define and call a function to handle the event transfer.created

            case 'transfer.reversed':
               const { id: tReversed } = event.data.object as Stripe.Transfer
               // Then define and call a function to handle the event transfer.reversed
               console.log(tReversed)

               return res.status(200).send(tReversed)
            case 'transfer.updated':
               const transfer = event.data.object as Stripe.Transfer
               console.log(transfer.id)
               // Then define and call a function to handle the event transfer.updated
               return res.status(200).send(transfer.id)
            // ... handle other event types
            default:
               console.log(`Unhandled event type ${event.type}`)
               return res.status(200).send('Success')
         }

         return res.status(200).send('Success')
      } catch (error) {
         console.log(error)
         const err = error as any
         logger.error('Error message', err.message)
         return res.status(400).send(`Webhook Deli Error:' ${err.message}`)
      }
   }
)

exports.addConnectedAccountToBusiness = onCall<{ accountId: string; mode?: 'live' | 'test' }, any>(
   { secrets: [STRIPE_KEY] },
   async ({ data, auth }): Promise<Response> => {
      try {
         if (!auth) return { success: false, result: 'Not authorized' }
         const userId = auth?.uid
         if (!auth.token.email) return { success: false, result: 'Not authorized' }
         const isAuth = await isAuthorizedToGrantAccess(auth?.token.email)

         if (!auth || !isAuth) return { success: false, result: 'Not authorized' }

         const { accountId } = data
         if (!accountId) return { success: false, result: 'no account Id provided' }

         const stripe = new Stripe(
            data.mode && data.mode === 'test' ? TEST_KEY : STRIPE_KEY.value(),
            {
               apiVersion: '2024-04-10'
            }
         )

         const account = await stripe.accounts.retrieve({
            stripeAccount: accountId
         })
         const { charges_enabled } = account
         if (charges_enabled) {
            await getFirestore().collection('business').doc(userId).set(
               {
                  stripeAccount: account.id,
                  activatedOn: new Date().toISOString(),
                  charges_enabled: charges_enabled
               },
               { merge: true }
            )

            return {
               success: charges_enabled,
               result: 'account connected'
            }
         }

         return {
            success: charges_enabled,
            result: 'account not connected'
         }
      } catch (error) {
         const err = error as any
         console.log('Error connecting store', err.message)
         logger.error('Error connecting store', err.message)
         return { success: false, result: err.message }
      }
   }
)

exports.updateUnitSold = onDocumentCreated(
   '/orders/{orderId}',
   async (event: FirestoreEvent<QueryDocumentSnapshot | undefined>) => {
      const items = event.data?.data()?.items as CartItem[]
      const data = event.data?.data() as Order
      const businessId = data.businessId
      const user = await getFirestore().collection('users').doc(businessId).get()
      if (user.exists) {
         const userData = user.data() as AppUser
         if (userData.pushToken) {
            await sendPushNotification(
               data.id!,
               NOTIFICATION_TYPE.new_order,
               userData.pushToken,
               'New Order',
               `You just got a new order $${data.total}`
            )
         }
      }

      items.forEach(async (item: CartItem) => {
         try {
            const productsRef = getFirestore()
               .collection('products')
               .doc(item.businessId)
               .collection('products')
               .doc(item.id!)
            const products = await productsRef.get()

            // await sendNewOrderNotification(contex.params.orderId);
            return productsRef.update({
               unitSold: parseInt(products.data()?.unitSold + item.quantity)
            })
         } catch (error) {
            console.error('ERROR updating units sold', error)
            logger.error('Error updating units sold', error)
            return null
         }
      })
   }
)

exports.payCourierUponDelivery = onDocumentUpdated(
   'orders/{orderId}',
   async (event: FirestoreEvent<functions.Change<QueryDocumentSnapshot> | undefined>) => {
      const data = event.data?.after.data() as Order
      const before = event.data?.before.data() as Order
      if (data.status === ORDER_STATUS.delivered && before.status !== ORDER_STATUS.delivered) {
         if (data.courier && !data.deliveryPaid) {
            await payCourier(event.params.orderId)
         }
      }
   }
)
exports.sendOrderStatusUpdates = onDocumentUpdated(
   'orders/{orderId}',
   async (event: FirestoreEvent<functions.Change<QueryDocumentSnapshot> | undefined>) => {
      try {
         const data = event.data?.after.data() as Order
         const before = event.data?.before.data() as Order

         let title = ''
         let body = ''

         if (!data) return
         if (data.status === ORDER_STATUS.new) {
            if (data.total !== before.total) {
               const amount = +(before.total - data.total).toFixed(2)
               await processPartialRefund(event.params.orderId, amount)
            }

            notifySharedOrder(data.sharedUserId!)
         }

         if (
            data.status === ORDER_STATUS.picked_up_by_driver &&
            before.status === ORDER_STATUS.accepted_by_driver
         ) {
            title = 'Great News'
            body = data.courier
               ? `${
                    data.courier?.name.charAt(0).toUpperCase() + data.courier?.name!.slice(1)
                 } is on his way to pick up your order`
               : ''
         } else if (
            data.status === ORDER_STATUS.delivered &&
            before.status === ORDER_STATUS.picked_up_by_driver
         ) {
            title = 'You got Delivered'
            body = 'Your order was just delivered, we hope you enjoy it!'
         }
         if (data.status === ORDER_STATUS.marked_ready_for_pickup) {
            title = 'Ready for Pickup'
            body = 'Your order is ready for pickup'
            logger.log('Ready for pickup')
         }

         if (data.status === ORDER_STATUS.picked_up_by_client) {
            title = 'Picked Up'
            body = 'Your order has been picked up\nWe hope that you enjoy it!'
         }

         if (
            data.status === ORDER_STATUS.marked_ready_for_delivery &&
            before.status !== ORDER_STATUS.marked_ready_for_delivery
         ) {
            getFirestore()
               .collection('new_orders')
               .doc(event.params.orderId)
               .set({ id: event.params.orderId })

            if (data.courier) {
               if (data.courier.pushToken) {
                  await sendPushNotification(
                     data.id!,
                     NOTIFICATION_TYPE.new_delivery,
                     data.courier.pushToken,
                     'New Delivery',
                     'New order ready for delivery'
                  )
               }
            }
         }
         if (
            data.status === ORDER_STATUS.accepted_by_driver &&
            before.status === ORDER_STATUS.marked_ready_for_delivery
         ) {
            getFirestore().collection('new_orders').doc(event.params.orderId).delete()
         }

         if (
            data.status === ORDER_STATUS.delivered &&
            before.status === ORDER_STATUS.accepted_by_driver
         ) {
            if (data.courier?.id) {
               await getFirestore()
                  .collection('users')
                  .doc(data.courier?.id)
                  .update({ busy: false })
            }
         }

         const userRef = await getFirestore().collection('users').doc(data.userId).get()
         if (!userRef.exists) return
         const user = userRef.data() as AppUser

         if (!user.pushToken) return

         //console.log('Sending notification')
         logger.log('Sending notification', user.pushToken)

         return await sendPushNotification(
            data.id!,
            NOTIFICATION_TYPE.order_updated,
            user.pushToken,
            title,
            body
         )
      } catch (error) {
         console.log(error)
         logger.error('Error sending notification', error)
         throw new functions.https.HttpsError('aborted', 'error sending notification')
      }
   }
)

exports.createRefund = onCall<{ orderId: string }, any>(
   { secrets: [STRIPE_KEY] },
   async ({ data, auth }): Promise<Response> => {
      try {
         if (!auth) return { success: false, result: 'Unauthorized' }
         const isAdmin = await isAuthorizedToGrantAccess(auth.token.email!)
         if (!isAdmin) return { success: false, result: 'Unauthorized' }

         const order = getFirestore().collection('orders').doc(data.orderId)
         const orderSnap = await order.get()
         const orderData = orderSnap.data() as Order
         if (!orderData) return { success: false, result: 'Order not found' }
         const { transferId, paymentIntent } = orderData
         if (!transferId || !paymentIntent) return { success: false, result: 'Transfer not found' }
         console.log('Refund', transferId, paymentIntent, 'Mode', orderData.mode)

         const stripe = new Stripe(orderData.mode === 'test' ? TEST_KEY : STRIPE_KEY.value(), {
            apiVersion: '2024-04-10'
         })

         const refund = await stripe.refunds.create({
            payment_intent: paymentIntent,

            reason: 'requested_by_customer'
            // reverse_transfer: true,
         })

         await stripe.transfers.createReversal(transferId)

         return { success: true, result: refund.status }
      } catch (error) {
         const err = error as any
         console.log('Refund Error', err.message)
         logger.error('Refund Error', err.message)
         return { success: false, result: err.message }
      }
   }
)

exports.checkIfEmailIsVerified = onCall<{ email: string }, any>(
   async ({ data, auth }): Promise<UserRecord | null> => {
      try {
         if (!data.email || !auth) return null
         const user = await getAuth().getUserByEmail(data.email)

         if (user.emailVerified) {
            logger.log('Email verified')
            await getFirestore().collection('users').doc(user.uid).update({ emailVerified: true })
         }
         logger.log('Email not verified verified', user.uid)
         return user
      } catch (error) {
         const err = error as any
         console.log('Error on verifing email', err.message)
         return null
      }
   }
)

export const payCourier = async (orderId: string) => {
   try {
      const orderRef = await getFirestore().collection('orders').doc(orderId).get()
      if (!orderRef.exists) return { result: null, success: false }

      const order = orderRef.data() as Order
      if (!order.tip?.amount || order.deliveryPaid) return { result: null, success: false }

      const { stripeAccount } = order.deliveredBy as Courier
      if (!stripeAccount) throw new functions.https.HttpsError('aborted', 'no stripe account found')

      const stripe = new Stripe(TEST_KEY, {
         apiVersion: '2024-04-10'
      })

      const { transfer_group, status } = await stripe.paymentIntents.retrieve(order.paymentIntent)
      console.log('TIP =>', order.tip.amount)
      if (status !== 'succeeded') return { result: null, success: false }
      await stripe.transfers.create({
         amount: Math.round(+order.tip?.amount.toFixed(2) * 100),
         currency: 'usd',
         destination: stripeAccount,
         transfer_group: transfer_group!,
         metadata: {
            orderId: order.id!,
            to: `${order.deliveredBy?.name} ${order.deliveredBy?.lastName}`,
            fromBusinessID: order.businessId,
            userId: order.deliveredBy?.id || ''
         }
      })

      return await getFirestore()
         .collection('orders')
         .doc(orderId)
         .set(
            {
               ...order,
               deliveryPaid: true,
               deliveredBy: order.courier,
               deliveredOn: new Date().toISOString()
            },
            { merge: true }
         )
   } catch (error) {
      const err = error as any
      console.log(err.message)
      logger.error(err.message)
      throw new functions.https.HttpsError(err.code, err.message)
   }
}

exports.getStripeLink = onCall<{ businessId: string; mode?: Business['mode'] }>(
   { secrets: [STRIPE_KEY] },
   async ({ data, auth }): Promise<Response> => {
      try {
         console.log('AUTH', auth?.uid)
         if (!auth) return { result: null, success: false }
         const business = await getFirestore().collection('business').doc(data.businessId).get()
         const businessData = business.data() as Business
         if (!businessData.stripeAccount) return { result: null, success: false }

         const stripe = new Stripe(
            data.mode && data.mode === 'test' ? TEST_KEY : STRIPE_KEY.value(),
            {
               apiVersion: '2024-04-10'
            }
         )
         const stripeLink = await stripe.accounts.createLoginLink(businessData.stripeAccount)
         return { result: stripeLink.url, success: true }
      } catch (error) {
         console.log(error)
         const err = error as Error
         return { result: err.message, success: false }
      }
   }
)

exports.deleteUser = onCall({ secrets: [STRIPE_KEY] }, async ({ auth }): Promise<Response> => {
   if (!auth) return { result: 'No authorized', success: false }
   try {
      const stripeRef = getFirestore().collection('stripe_customers').doc(auth.uid)
      const stripe = new Stripe(STRIPE_KEY.value(), {
         apiVersion: '2024-04-10'
      })

      const stripe_id = (await stripeRef.get()).data()?.customer_id
      if (stripe_id) {
         await stripe.customers.del(stripe_id)
         await stripeRef.delete()
      }
      await getAuth().deleteUser(auth.uid)
      await getFirestore().collection('users').doc(auth.uid).delete()
      return { result: 'User deleted', success: true }
   } catch (error) {
      console.log(error)
      const err = error as any

      return { result: err.message, success: false }
   }
})

exports.deletePendingOrdersDaily = functions.pubsub.schedule('00 16 * * *').onRun(async () => {
   try {
      const orders = await getFirestore().collection('pendingOrders').get()
      console.log(orders.size)
      return orders.forEach(async (order) => await order.ref.delete())
   } catch (error) {
      console.log(error)
      logger.error('Error deleting pending orders', error)
      return new HttpsError('aborted', 'error deleting pending orders')
   }
})

// exports.notifyUnpickedupOrders = functions.pubsub
//    .schedule('every hour from 08:00 to 23:00')
//    .onRun(async (context) => {
//       try {
//          const orders = await getFirestore()
//             .collection('orders')
//             .where('status', 'in', [ORDER_STATUS.marked_ready_for_pickup])
//             .get()
//          console.log(orders.size)
//          if (orders.size === 0) return
//          return orders.forEach(async (order) => {
//             const orderFound = await getFirestore().collection('orders').doc(order.id).get()
//             if (!orderFound.exists) return
//             const orderData = orderFound.data() as Order
//             if (!orderData.readyForPickupAt) return
//             const diffInMs = dayjs(orderData.readyForPickupAt).diff(dayjs(), 'minutes')

//             //if order has more then 30 minutes and has not been pickup
//             if (diffInMs < 40) return
//             const user = await getFirestore().collection('users').doc(order.data()?.userId).get()
//             const userData = user.data() as AppUser
//             if (!userData.pushToken) return
//             await sendNotificationFromServer(
//                order.id!,
//                NOTIFICATION_TYPE.order_updated,
//                userData.pushToken,
//                'Order not picked up',
//                'You have an order ready for pickup, if you havent not pick up that order \n please go to the store'
//             )
//          })
//       } catch (error) {
//          console.log(error)
//          logger.error('Error notifying unpicked up orders', error)
//          return new HttpsError('aborted', 'error notifying unpicked up orders')
//       }
//    })

exports.sendSMS = onCall<{ phone: string }>(async ({ data, auth }): Promise<Response> => {
   if (!auth) return { result: null, success: false }
   if (data.phone.length < 10) return { result: null, success: false }
   const phone = data.phone.replace(/\D/g, '')

   const otp = generateRandomNumbers()
   return twilio.messages
      .create({
         body: `This is your OTP code: \n \n  ${otp} \n  \n  Please do not share this OTP with anyone`,
         from: '+18556413551',
         to: `+1${phone}`
      })
      .then((message: any) => {
         console.log(message)
         return {
            result: message.sid,
            success: true
         }
      })
      .catch((error: any) => {
         console.log('E =>', error.message)
         logger.error('Error sending sms', error)
         return { result: error.message, success: false }
      })
      .done()
})

exports.checkForStoreReady = onDocumentUpdated(
   'business/{businessId}',
   async (event: FirestoreEvent<functions.Change<QueryDocumentSnapshot> | undefined>) => {
      try {
         const data = event.data?.after.data() as Business

         const { stripeAccount, hasItems } = data
         if (!stripeAccount || hasItems) return
         const stripe = new Stripe(TEST_KEY, {
            apiVersion: '2024-04-10'
         })
         const { charges_enabled, id } = await stripe.accounts.retrieve(stripeAccount)
         if (!charges_enabled) {
            await getFirestore()
               .collection(`business`)
               .doc(event.params.businessId)
               .update({ isActive: false, profileCompleted: false })
         }

         const productsRef = getFirestore().collection(
            `products/${event.params.businessId}/products`
         )

         const products = await productsRef.get()
         const hasProducts = products.size > 0
         const cardEnabled = charges_enabled
         console.log('READY =>', hasProducts, cardEnabled)
         if (!hasProducts || !cardEnabled) return

         return getFirestore().collection(`business`).doc(event.params.businessId).set(
            {
               isActive: true,
               profileCompleted: true,
               hasItems: hasProducts,
               charges_enabled: cardEnabled,
               stripeAccount: id,
               status: 'completed'
            },
            { merge: true }
         )
      } catch (error) {
         console.log(error)
         logger.error('Error checking for store ready', error)
         throw new functions.https.HttpsError('aborted', 'error checking for store ready')
      }
   }
)

exports.createPaymentIntent = onCall<{ connectedId: string; total: number; orderId: string }>(
   {
      secrets: [STRIPE_KEY]
   },
   async ({ data, auth }): Promise<{ success: boolean; result: any }> => {
      try {
         if (auth === undefined || auth.uid === undefined)
            return { result: 'no authorized', success: false }
         const order = await getFirestore().collection('pendingOrders').doc(data.orderId).get()
         const orderData = order.data() as Order
         const stripe = new Stripe(orderData.mode === 'test' ? TEST_KEY : STRIPE_KEY.value(), {
            apiVersion: '2024-04-10'
         })
         let customer_id
         const customer = await getFirestore().collection('stripe_customers').doc(auth.uid).get()
         if (!customer.exists) {
            const { id } = await stripe.customers.create({
               email: auth.token.email,
               metadata: {
                  userId: auth.uid
               }
            })
            await getFirestore()
               .collection('stripe_customers')
               .doc(auth.uid)
               .set({ customer_id: id })
            customer_id = id
         } else {
            customer_id = (customer.data() as { customer_id: string }).customer_id
         }

         if (!customer_id) return { result: 'no customer id', success: false }
         const userData = await getFirestore().collection('users').doc(auth.uid).get()
         const { email } = userData.data() as AppUser

         // const order = (
         //    await getFirestore().collection('pendingOrders').doc(data.orderId).get()
         // ).data() as Order

         const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer_id },
            { apiVersion: '2024-04-10' }
         )

         const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(+data.total.toFixed(2) * 100),
            currency: 'usd',
            customer: customer_id,
            receipt_email: email,
            automatic_payment_methods: {
               enabled: true
            },

            // transfer_data: {
            //     destination: data.connectedId
            // },
            on_behalf_of: data.connectedId,
            transfer_group: UUID(),

            // application_fee_amount: +(data.total * 100 * 0.08).toFixed(0),
            metadata: {
               userId: auth.uid,
               userEmail: email,
               orderId: data.orderId
            }
         })

         return {
            success: true,
            result: {
               ephemeralKey: ephemeralKey.secret,
               paymentIntent: paymentIntent.client_secret,
               paymentIntentId: paymentIntent.id,
               customer: customer_id,
               env: process.env.NODE_ENV + '--' + process.env.STRIPE_KEY!
            }
         }
      } catch (error) {
         const err = error as any
         console.log('Error creating payment intent', err)

         return { success: false, result: err.message }
      }
   }
)

const processPartialRefund = async (orderId: string, amount: number): Promise<boolean> => {
   if (!orderId || !amount) return false
   if (amount <= 0) return false

   try {
      const order = await getFirestore().collection('orders').doc(orderId).get()
      if (!order.exists) return false

      const orderData = order.data() as Order
      if (!orderData) return false

      const { paymentIntent } = orderData

      if (!paymentIntent) return false

      const stripe = new Stripe(orderData.mode === 'test' ? TEST_KEY : STRIPE_KEY.value(), {
         apiVersion: '2024-04-10'
      })
      await stripe.refunds.create({
         payment_intent: paymentIntent,
         amount: Math.round(amount * 100),
         reason: 'requested_by_customer'
      })

      //await stripe.transfers.createReversal(transferId)
      logger.log('Refund', paymentIntent, 'Mode', orderData.mode, 'Amount', amount)
      return true
   } catch (error) {
      const err = error as any

      logger.error('Refund Error', err.message)
      return false
   }
}

function generateRandomNumbers(): number {
   const result: number[] = []
   for (let i = 0; i < 4; i++) {
      result.push(Math.floor(Math.random() * 10))
   }
   return +result.slice(0, 4).join('')
}

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
