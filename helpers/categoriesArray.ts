import { Category, Product } from '@/shared/types'

export const categoriesArray = (products: Product[]): Category[] => {
   // Deduplicate categories using a Set for IDs
   const seenIds = new Set<string>()

   const uniqueCategories = products
      .map((p) => p.category)
      .filter((category): category is { id: string; name: string } => {
         // TypeScript narrowing with type predicate
         if (!category || !category.id) return false // Exclude null/undefined
         if (seenIds.has(category.id)) return false // Deduplicate by ID
         seenIds.add(category.id)
         return true // Valid category
      })

   // Add "All Categories" and sort alphabetically
   return [
      { id: 'all', name: 'All Categories' },
      ...uniqueCategories.sort((a, b) => (a.name > b.name ? 1 : -1))
   ]
}
