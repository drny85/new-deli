import { Business, ORDER_TYPE, OrderAddress } from '@/shared/types'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { extractZipCode } from '@/utils/extractZipcode'
import { getDistanceFromLatLonInMeters } from '@/utils/getDistanceInMeters'
import { toastAlert } from '@/utils/toast'
import { Alert } from 'react-native'

export const calculateDistanceBetweenDeliveryAddressResturant = (
   restaurant: Business,
   orderType: ORDER_TYPE,
   deliveryAddress: OrderAddress
): boolean => {
   // Implement logic to calculate distance between delivery address and restaurant

   if (orderType === 'delivery') {
      if (!restaurant || !restaurant?.coords) return false
      if (restaurant?.deliveryType === 'zips') {
         const zip = extractZipCode(deliveryAddress?.street!)
         if (zip === 2) return false

         if (!restaurant?.zips?.includes(zip)) {
            toastAlert({
               message: `${restaurant.name} do not deliver to this zip code (${zip})`,
               title: 'Out of delivery range',
               preset: 'error',
               duration: 5
            })
            return false
         }
         return true
      } else if (restaurant?.deliveryType === 'miles') {
         if (!restaurant?.coords) return false
         const loc1 = {
            latitude: deliveryAddress?.coords.latitude!,
            longitude: deliveryAddress?.coords.longitude!
         }
         const loc2 = {
            latitude: restaurant?.coords?.latitude!,
            longitude: restaurant?.coords?.longitude!
         }

         const distance = getDistanceFromLatLonInMeters(loc1, loc2)

         if (distance > restaurant.miles) {
            toastAlert({
               message: 'Consider changing the delivery address or place order for pick-up',
               title: 'Out of delivery range',
               preset: 'error',
               duration: 5
            })
            return false
         }
         return true
      }
   }
   return true
}

export const preventDeliveryOrder = (restaurant: Business, orderType: ORDER_TYPE): boolean => {
   if (!restaurant || !orderType) return false
   if (restaurant && orderType) {
      if (orderType === ORDER_TYPE.delivery && restaurant.couriers.length === 0) {
         Alert.alert('No Deliveries', 'This restaurant is not taking deliveries at the moment', [
            {
               text: 'Cancel'
            },
            {
               text: 'Switch to Pick-Up',
               onPress: () => {
                  useOrderFlowStore.getState().setOrderType(ORDER_TYPE.pickup)
               }
            }
         ])
         return true
      }
      if (orderType === 'delivery' && restaurant.ordersMethod === 'pickup-only') {
         Alert.alert(
            'Not Delivery',
            'Delivery is not available for this restaurant at the moment',
            [
               {
                  text: 'Cancel'
               },
               {
                  text: 'Switch to Pick-Up',
                  onPress: () => {
                     useOrderFlowStore.getState().setOrderType(ORDER_TYPE.pickup)
                  }
               }
            ]
         )
         return true
      } else if (orderType === 'pickup' && restaurant.ordersMethod === 'delivery-only') {
         Alert.alert('Not Pickup', 'Pickup is not available for this restaurant at the moment', [
            {
               text: 'Cancel'
            },
            {
               text: 'Switch to Delivery',
               onPress: () => {
                  useOrderFlowStore.getState().setOrderType(ORDER_TYPE.delivery)
               }
            }
         ])
         return true
      }
   }
   return false
}
