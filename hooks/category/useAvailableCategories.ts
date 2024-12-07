import { Category } from '@/shared/types'
import { useEffect, useState } from 'react'
import { useAllCategories } from './useAllCategories'
import { useAuth } from '@/providers/authProvider'
import { useAllProducts } from '../restaurants/useAllProducts'
import { useRestaurants } from '../restaurants/useRestaurants'
import { concatenateAndReturnNotInArray1 } from '@/helpers/concatinateArrays'

export const useAvailableCategories = () => {
   const [data, setData] = useState<Category[]>([])
   const [loading, setLoading] = useState(false)
   const { user } = useAuth()
   const { restaurants, loading: lg } = useRestaurants()
   const businessIds = restaurants.map((r) => r.id!)

   const { categories } = useAllCategories([...businessIds])
   const { products } = useAllProducts()

   const availableCategories = categories.filter((c) =>
      products.some((p) => p.category?.id === c.id)
   )

   useEffect(() => {
      if (lg) return
      if (!categories.length || !products.length) return
      setData(
         user?.type === 'business'
            ? concatenateAndReturnNotInArray1(categories, [])
            : availableCategories
      )
      setLoading(false)
   }, [categories.length, businessIds, products.length, user?.type, lg])

   return { data, loading }
}
