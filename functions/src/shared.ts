import { myPercentage } from '@shared/types'
import * as functions from 'firebase-functions'
import axios from 'axios'
import { AppUser, NOTIFICATION_TYPE } from '@shared/types'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

export const assignUserType = async (uid: string, type: string) => {
   if (!uid)
      throw new functions.https.HttpsError(
         'aborted',
         'error assigning user type',
         'no uid provided'
      )
   try {
      const user = await getAuth().getUser(uid)
      if (!user) return

      return await getAuth().setCustomUserClaims(user.uid, {
         type: type
      })
   } catch (error) {
      const err = error as unknown as Error
      throw new functions.https.HttpsError('aborted', 'error assigning user type', err.message)
   }
}

export const stripeFee = (amount: number): number => {
   if (!amount) return 0
   const p = (amount * 2.9) / 100 + myPercentage
   return +p.toFixed(2)
}

// export const sendNotificationFromServer = async (
//    id: string,
//    notificationType: NOTIFICATION_TYPE,
//    token: string,
//    title: string,
//    body: string
// ): Promise<boolean> => {
//    try {
//       const res = await axios.post('https://exp.host/--/api/v2/push/send', {
//          method: 'POST',
//          headers: {
//             host: 'exp.host',
//             accept: 'application/json',
//             'accept-encoding': 'gzip, deflate',
//             'content-type': 'application/json'
//          },
//          body: JSON.stringify({
//             to: token,
//             title,
//             body,
//             data: {
//                notificationType,
//                id
//             }
//          })
//       })
//       functions.logger.log('notification sent', res.data)
//       return res.status.toString() === 'ok' || true
//    } catch (error) {
//       functions.logger.error('error sending notification', error)
//       const err = error as Error
//       console.log(err.message)
//       return false
//    }
// }

export const sendPushNotification = async (
   id: string,
   notificationType: NOTIFICATION_TYPE,
   token: string,
   title: string,
   body: string
) => {
   const payload = {
      to: token,
      sound: 'default',
      title,
      body: body,
      data: { notificationType, id }
   }

   try {
      const response = await axios.post('https://exp.host/--/api/v2/push/send', payload, {
         headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json'
         }
      })

      console.log('Notification sent successfully:', response.data.status)
   } catch (error) {
      const err = error
      console.error('Error sending notification:', err)
   }
}

export const notifySharedOrder = async (userId: string) => {
   if (!userId) return
   try {
      const user = await getFirestore().collection('users').doc(userId).get()
      const data = user.data() as AppUser
      if (data.pushToken)
         await sendPushNotification(
            userId,
            NOTIFICATION_TYPE.new_order,
            data.pushToken,
            'Great New!',
            `An order was placed from the cart you shared`
         )
   } catch (error) {
      console.log(error)
   }
}

// Recursive function to find and assign the nearest available courier

export function runFunctionWithInterval(
   interval: number,
   condition: () => boolean,
   callback: () => void
) {
   const intervalId = setInterval(() => {
      callback()

      if (condition()) {
         clearInterval(intervalId)
      }
   }, interval)
}

export async function isAuthorizedToGrantAccess(email: string): Promise<boolean> {
   const user = await getAuth().getUserByEmail(email)
   if (user.customClaims && user.customClaims.type === 'business') return true
   return false
}
