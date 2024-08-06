import { businessCollection, productsCollection } from '@/collections'
import { Business, Product } from '@/typing'
import { addDoc, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore'
import { getStorage, ref, deleteObject } from 'firebase/storage'
import { updateBusiness } from '../business'

export const addNewProduct = async (product: Product): Promise<boolean> => {
   try {
      if (!product) return false
      await addDoc(productsCollection(product.businessId), { ...product })
      return true
   } catch (error) {
      console.log(error)
      return false
   }
}

export const updateProduct = async (product: Product): Promise<boolean> => {
   try {
      if (!product) return false
      const productRef = doc(productsCollection(product.businessId), product.id)
      await updateDoc(productRef, { ...product })
      return true
   } catch (error) {
      console.log(error)
      return false
   }
}
export const deleteProduct = async (productId: string, businessId: string): Promise<boolean> => {
   try {
      if (!productId || !businessId) return false
      const productRef = doc(productsCollection(businessId), productId)
      const product = await getDoc(productRef)
      const docs = await getDocs(productsCollection(businessId))
      if (docs.docs.length === 1) {
         const business = await getDoc(doc(businessCollection, businessId))
         if (business.exists()) {
            const data = business.data() as Business
            updateBusiness({ ...data!, hasItems: false })
         }
      }
      const { category, name } = product.data() as Product
      await deleteDoc(productRef)
      const storage = getStorage()
      const desertRef = ref(
         storage,
         `${businessId}/${category?.name.toLowerCase()}/${name.replace(/\s+/g, '').toLowerCase()}`
      )
      await deleteObject(desertRef)
      return true
   } catch (error) {
      console.log(error)
      return false
   }
}
