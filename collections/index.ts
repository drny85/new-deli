import { createCollection } from '@/firebase'
import { Cart } from '@/stores/cartsStore'
import { AppUser, Business, Category, Courier, Order, Product, StoreCourierData } from '@/typing'

export const businessCollection = createCollection<Business>('business')
export const ordersCollection = createCollection<Order>('orders')
export const pendingOrdersCollection = createCollection<Order>('pendingOrders')
export const usersCollection = createCollection<AppUser>('users')
export const userCouriersCollection = createCollection<Courier>('users')
export const couriersCollection = createCollection<StoreCourierData>('couriers')
export const productsCollection = (businessId: string) =>
   createCollection<Product>(`products/${businessId}/products`)
export const cartsCollection = createCollection<Cart>('carts')
export const categoriessCollection = (businessId: string) =>
   createCollection<Category>(`categories/${businessId}/categories`)