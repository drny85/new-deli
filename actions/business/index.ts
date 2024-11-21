import {
   businessCollection,
   couriersCollection,
   ordersCollection,
   usersCollection
} from '@/collections'
import { auth } from '@/firebase'
import { calculateETA } from '@/helpers/calculateETA'
import { Business, Order, StoreCourierData } from '@/typing'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export const updateOrder = async (order: Order): Promise<boolean> => {
   try {
      if (!order) return false
      const orderRef = doc(ordersCollection, order.id)
      await updateDoc(orderRef, { ...order })

      return true
   } catch (error) {
      console.log(error)
      return false
   }
}

export const updateETA = async (orders: Order[]) => {
   try {
      const eta = await calculateETA(orders)
      console.log('ETA', eta)

      if (!orders || !eta) return
      if (eta === 0) return
      const businessId = orders[0].businessId
      if (!businessId) return false
      const businessRef = doc(businessCollection, businessId)
      const business = await getDoc(businessRef)
      if (!business.exists()) return false
      console.log('Updating ETA', eta)
      await updateDoc(businessRef, { eta })
   } catch (error) {
      console.log('Error updating eta', error)
   }
}

export const updateBusiness = async (business: Business): Promise<boolean> => {
   try {
      if (!business) return false
      const user = auth.currentUser
      if (!user) return false
      if (user.uid !== business.id) return false
      const businessRef = doc(businessCollection, business.id)
      await updateDoc(businessRef, { ...business })
      return true
   } catch (error) {
      console.log(error)
      return false
   }
}

export const addNewBusiness = async (businessId: string): Promise<boolean> => {
   try {
      const userDoc = await getDoc(doc(usersCollection, businessId))
      const user = userDoc.data()
      if (!user) return false
      const business: Business = {
         name: '',
         owner: {
            name: user.name,
            lastName: user.lastName
         },
         stripeAccount: null,
         email: user.email,
         mode: 'test',
         isActive: true,
         userId: user.id!,
         profileCompleted: false,
         address: null,
         coords: null,
         hasItems: false,
         minimumDelivery: null,
         couriers: [],
         phone: null,
         image: null,
         createdAt: new Date().toISOString(),
         charges_enabled: false,
         isOpen: true,
         status: 'onboarding',
         zips: [],
         agreedToTerms: false,
         deliveryType: 'miles',
         miles: 1,
         ordersMethod: 'both'
      }
      const busRef = doc(businessCollection, businessId)
      await setDoc(busRef, business)
      return true
   } catch (error) {
      console.log(error)
      return false
   }
}

export const updateCourierFromWaitingList = async (
   courierId: string,
   newStatus: StoreCourierData['status']
): Promise<boolean> => {
   try {
      const courierRef = doc(couriersCollection, courierId)
      const courier = await getDoc(courierRef)
      if (!courier.exists()) return false
      await updateDoc(courierRef, {
         ...courier.data(),
         status: newStatus
      })
      return true
   } catch (error) {
      console.log(error)
      return false
   }
}