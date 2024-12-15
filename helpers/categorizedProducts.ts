import { Product } from '@/shared/types'

export interface CategorizedProduct {
   title: string
   data: Product[]
}
export const categoriedData = (products: Product[]): CategorizedProduct[] => {
   const categorizedProducts: CategorizedProduct[] = Object.values(
      products.reduce<{ [key: string]: Product[] }>((acc, product) => {
         const categoryName = product.category?.name || 'Uncategorized' // Fallback for missing category name

         if (!acc[categoryName]) {
            acc[categoryName] = []
         }

         acc[categoryName].push(product)

         return acc
      }, {})
   )
      .map((products) => ({
         title: products[0].category?.name || 'Uncategorized', // Fallback for missing category name
         data: products
      }))
      .sort((a, b) => a.title.localeCompare(b.title))

   return categorizedProducts
}
// Example usage
