import { Product } from '@/shared/types'

export interface CategorizedProduct {
   title: string
   data: Product[]
}

export const categoriedData = (products: Product[]) => {
   const categorizedProducts: CategorizedProduct[] = Object.values(
      products.reduce<{ [key: string]: Product[] }>((acc, product) => {
         const categoryName = product.category?.name!

         if (!acc[categoryName]) {
            acc[categoryName] = []
         }

         acc[categoryName].push(product)

         return acc
      }, {})
   )
      .map((products) => ({
         title: products[0].category?.name!,
         data: products
      }))
      .sort((a, b) => a.title.localeCompare(b.title)) as CategorizedProduct[]

   return categorizedProducts
}

// Example usage
