export type Coords = {
   latitude: number
   longitude: number
}

export const CART_ALLOWED = 10
export const MY_TRANSACTION_FEE = 1.2

export const myTransaction_fee = 1.2 //must change this amount in the constants.index.js
export const myPercentage = 0.4

export interface CartItem extends Product {
   itemId: string
   quantity: number
   size: P_Size | null
   instructions: string
   addons: string[]
}

export interface ConnectedParams {
   businessName: string
   phone: string
   address: string
   name: string
   lastName: string
   type: 'business' | 'courier'
   mode?: 'test' | 'live' | undefined
}

export type Cart = {
   id?: string
   items: CartItem[]
   quantity: number
   total: number
   restaurantId: string
   orderType: ORDER_TYPE
   createdAt: string
   deliveryAddress: OrderAddress | null
   isShared: boolean
   sharedUserId?: string
}

export type OrderStatus =
   | 'Cancelled'
   | 'Ready For Delivery'
   | 'Order Received'
   | 'Processing'
   | 'Picked By Courier'
   | 'Picked Up'
   | 'Accepted By Courier'
   | 'Ready For Pick Up'
   | 'Delivered'

export enum ORDER_STATUS {
   new = 'new',
   delivered = 'delivered',
   in_progress = 'in_progress',
   marked_ready_for_delivery = 'marked_ready_for_delivery',
   marked_ready_for_pickup = 'marked_ready_for_pickup',
   cancelled = 'cancelled',
   accepted_by_driver = 'accepted_by_driver',
   picked_up_by_driver = 'picked_up_by_driver',
   picked_up_by_client = 'picked_up_by_client',
   all = 'all orders'
}
export interface RestaurantMapInfo {
   name: string
   description: string
   latitude: number
   longitude: number
}

export const statusListForDelivery: OrderStatus[] = [
   'Order Received',
   'Processing',
   'Ready For Delivery',
   'Accepted By Courier',
   'Picked By Courier',
   'Delivered'
]
export const statusListForPickup: OrderStatus[] = [
   'Order Received',
   'Processing',
   'Ready For Pick Up',
   'Picked Up'
]

export type Filter = 'thisWeek' | 'lastWeek' | 'monthToDate' | 'yearToDate' | 'today' | 'all'
export type FilterDay = 'timeOfDay' | 'dayOfWeek' | 'month' | 'year'

export interface Order {
   id?: string
   orderNumber?: number
   mode?: 'live' | 'test'
   total: number
   items: CartItem[]
   paymentIntent: string
   orderDate: string
   userId: string
   businessId: string
   contactPerson: ContactPerson
   orderType: ORDER_TYPE
   deliveryInstructions: string | null
   address: OrderAddress | null
   status: ORDER_STATUS
   courier?: Omit<Courier, ' agreement'> | null
   deliveredOn?: string | null
   deliveredBy: Courier | null
   pickedUpOn?: string | null
   acceptedOn?: string | null
   pickedByCourierOn?: string
   declined: string[]
   tip?: Tip
   pickupCoords?: Coords
   deliveryPaid: boolean
   transferId: string | null
   otpPickup?: number | null
   distance?: number
   readyOn?: string
   readyForPickupAt?: string
   sharedUserId: string | null
}
export type TempOrder = {
   id: string
   destination: Coords
   status: OrderStatus
   distance?: number
}

export enum ORDER_TYPE {
   pickup = 'pickup',
   delivery = 'delivery'
}
export interface OrderAddress {
   street: string
   apt?: string
   coords: Coords
   label?: string
   addedOn: string
}

export interface ContactPerson {
   userId: string
   name: string
   lastName: string
   phone: string
}

export interface Tip {
   amount: number
   percentage: number
}

export type Product = {
   id?: string
   name: string
   category: Category | null
   price: string | number
   image: string | null
   description: string | null
   sizes: P_Size[]
   businessId: string
   unitSold: number
   available: boolean
   multipleAddons?: number | null
   keywords?: string[]
   addons: string[]
}
export type Category = {
   id?: string
   name: string
}

export interface P_Size {
   id: string | number
   size: string
   price: number | string
}
export interface Courier extends AppUser {
   transportation?: 'BYCYCLING' | 'DRIVING'
   stripeAccount: string | null
   stripe_temp_account?: string
   isOnline: boolean
   isActive: boolean
   busy?: boolean
   lastPictureChange?: string
   overridingPicture?: boolean
   agreement?: string[]
   phoneNumberVerified: boolean
   distance?: number
}

export interface AppUser {
   id?: string
   name: string
   lastName: string
   email: string
   emailVerified: boolean
   phone: string | null
   type: 'admin' | 'business' | 'consumer' | 'courier'
   pushToken?: string
   image?: string
   coords: Coords | null
   status?: 'pending' | 'completed'
   favoritesStores: string[]
   deliveryAddresses: string | []
   provider: 'email' | 'apple' | 'google'
   createdAt: string
   sharePicture?: boolean
}

export type CustomUser = {
   id: string
   email: string
   displayName?: string | null
   isEmailVerified: boolean
}
export type DELIVERY_TYPE = 'miles' | 'zips'
export type ORDERS_METHOD = 'pickup-only' | 'delivery-only' | 'both'

export interface Business {
   id?: string
   name: string
   email: string
   mode: 'live' | 'test'
   owner: { name: string; lastName: string }
   stripeAccount: string | null
   address: string | null
   coords: Coords | null
   phone: string | null
   isActive: boolean
   userId: string
   tempStripeAccount?: string
   profileCompleted: boolean
   hasItems: boolean
   image: string | null
   charges_enabled: boolean
   minimumDelivery: number | null
   orderType?: BUSINESS_ORDER_TYPE
   isOpen: boolean
   distance?: number | null
   eta?: number
   zips: number[]
   lastClosed?: string
   lastOpened?: string
   createdAt: string
   status: 'onboarding' | 'completed'
   couriers: BusinessCourier[]
   agreedToTerms: boolean
   agreedToTermsOn?: string
   requiredOTP?: boolean
   deliveryType: DELIVERY_TYPE
   miles: number
   addons?: string[]
   ordersMethod: ORDERS_METHOD
   otpOverride?: number | null
}
export type BusinessCourier = {
   id: string
   active: boolean
}

export type StoreCourierData = {
   id?: string
   courierId: string
   businessId: string
   status: 'pending' | 'completed' | 'inactive'
   name: string
   phone: string
   submittedOn: string
}

export enum BUSINESS_ORDER_TYPE {
   deliveryOnly = 'deliveryOnly',
   both = 'both'
}

export type PaymentIntentParams = {
   paymentIntentId: string
   paymentIntent: string
   ephemeralKey: string
   customer: string
   env?: string
}

export type ConnectedAccountParams = {
   businessName: string
   phone: string
   address?: string
   name: string
   lastName: string
   type: 'business' | 'courier'
   mode?: 'live' | 'test' | undefined
}

export interface StripeResponse {
   success: boolean
   result: string | null
}
export enum NOTIFICATION_TYPE {
   new_order = 'new order',
   ready_for_delivery = 'ready_for_delivery',
   order_updated = 'order_updated',
   new_delivery = 'new_delivery'
}

export type NotificationData = {
   id: string
   notificationType: NOTIFICATION_TYPE
}

export type EmployeeRole = 'staff' | 'manager'
export type Employee = {
   id: string
   username: string
   name: string
   lastName: string
   phone: string
   pin: number
   active: boolean
   createdAt: string
   role: EmployeeRole
}
export type CardData = Pick<
   Business,
   | 'address'
   | 'id'
   | 'image'
   | 'isOpen'
   | 'name'
   | 'eta'
   | 'minimumDelivery'
   | 'distance'
   | 'ordersMethod'
>
