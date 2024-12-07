import { categoriessCollection } from '@/collections'
import { useCategoriesStore } from '@/stores/categoriesStore'
import { Category } from '@/shared/types'
import { getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useAllCategories = (business: string[]) => {
   const [loading, setLoading] = useState<boolean>(true)
   const setCats = useCategoriesStore((s) => s.setCategories)
   const [categories, setCategories] = useState<Category[]>([])
   useEffect(() => {
      if (business.length === 0) {
         setLoading(false)
         return
      }
      const fetchCategories = async () => {
         const promises = business.map((businessId) => getDocs(categoriessCollection(businessId)))
         const result = await Promise.all(promises)
         const temp: Category[] = []
         result.forEach((r) => {
            if (r.size > 0) {
               r.docs.map((d) => {
                  const index =
                     temp.findIndex((i) => i.name.toLowerCase() === d.data().name.toLowerCase()) ===
                     -1
                  if (index) {
                     temp.push({ ...d.data(), id: d.id } as Category)
                  }
               })
            }
         })

         setCategories([...new Set(temp)])
         setCats([...new Set(temp)])
         setLoading(false)
      }
      fetchCategories()
   }, [])

   return { loading, categories }
}
