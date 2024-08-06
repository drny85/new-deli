import { NOTIFICATION_TYPE, NotificationData } from '@/typing'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { useEffect } from 'react'

export function useNotificationObserver() {
   useEffect(() => {
      let isMounted = true

      function redirect(notification: Notifications.Notification) {
         const data = notification.request.content.data as NotificationData
         console.log('data', data)
         if (data.notificationType === NOTIFICATION_TYPE.order_updated) {
            router.push({ pathname: '/order/[orderId]', params: { orderId: data.id } })
            // router.push({
            //    pathname: '/(app)/(nova)/chat',
            //    params: { chatId: data.id }
            // })
         }
      }

      Notifications.getLastNotificationResponseAsync().then((response) => {
         if (!isMounted || !response?.notification) {
            return
         }
         redirect(response?.notification)
      })

      const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
         redirect(response.notification)
      })

      return () => {
         isMounted = false
         subscription.remove()
      }
   }, [])
}
