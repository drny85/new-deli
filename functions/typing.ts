export interface Coords {
   latitude: number
   longitude: number
}

export interface UserPreferences {
   favoritesBusiness: string[]
}
export interface AppUser {
   id?: string
   name: string
   lastName: string
   email: string
   emailVerified: boolean
   phone: string | null
   type: 'admin' | 'business' | 'consumer' | 'courier'
   preferences?: UserPreferences
   pushToken?: string
   status?: 'pending' | 'completed'
   coords?: Coords
   transportation?: MapViewDirectionsMode
   favoritesStores: string[]
   deliveryAddresses: Order['address'][]
}
export interface hour {
   [key: string]: string
}
export interface P_Size {
   id: string
   size: string
   price: number
}

export interface CartItem extends Product {
   quantity: number
   size: P_Size | null
   instructions: string
}

export interface Category {
   id?: string
   name: string
}
export interface Product {
   id?: string
   name: string
   category: Category | null
   price: string | number
   image: string | null
   description: string | null
   sizes: P_Size[]
   businessId: string
   unitSold: number
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
   couriers: string[]
   agreedToTerms: boolean
   agreedToTermsOn?: string
   requiredOTP?: boolean
   deliveryType: DELIVERY_TYPE
   miles: number
   ordersMethod: ORDERS_METHOD
}
export interface Tip {
   amount: number
   percentage: number
}
export enum BUSINESS_ORDER_TYPE {
   deliveryOnly = 'deliveryOnly',
   both = 'both'
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

export interface Order {
   id?: string
   orderNumber?: number
   mode: 'live' | 'test'
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
   courier?: Courier | null
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
   readyForPickupAt?: string
   sharedUserId: string | null
}
export enum ORDER_TYPE {
   pickup = 'pickup',
   delivery = 'delivery'
}
export interface OrderAddress {
   street: string
   apt?: string
   coords: Coords
   addedOn: string
}

export interface ContactPerson {
   name: string
   lastName: string
   phone: string
}

export enum ORDER_STATUS {
   delivered = 'delivered',
   in_progress = 'in_progress',
   new = 'new',
   marked_ready_for_delivery = 'marked_ready_for_delivery',
   marked_ready_for_pickup = 'marked_ready_for_pickup',
   cancelled = 'cancelled',
   accepted_by_driver = 'accepted_by_driver',
   all = 'all orders',
   picked_up_by_driver = 'picked_up_by_driver',
   picked_up_by_client = 'picked_up_by_client'
}

export interface Courier extends AppUser {
   transportation?: MapViewDirectionsMode
   stripeAccount: string | null
   stripe_temp_account?: string
   isOnline: boolean
   isActive: boolean
   busy?: boolean
   declined: string[]
   lastPictureChange?: string
   overridingPicture?: boolean
   agreement?: string[]
}

export enum NOTIFICATION_TYPE {
   new_order = 'new order',
   ready_for_delivery = 'ready_for_delivery',
   order_updated = 'order_updated',
   new_delivery = 'new_delivery'
}

export type MapViewDirectionsMode = 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING'
