import { Business, Product } from '@/shared/types'
import debounce from 'lodash.debounce'

export const onRestaurantSearch = debounce(
   (
      value: string,
      restaurants: Business[],
      products: Product[],
      res: Business[],
      setRestaurants: (data: Business[]) => void,
      setValue: (value: string) => void
   ) => {
      // Update the input value state
      setValue(value)

      // Sanitize and prepare the search term
      const searchTerm = value.trim().toLowerCase()
      if (!searchTerm) {
         setRestaurants(res) // Reset to original data when input is empty
         return
      }

      // Helper function to check if a product matches the search term
      const doesProductMatch = (product: Product): boolean =>
         product.name.toLowerCase().includes(searchTerm) ||
         product.category?.name.toLowerCase().includes(searchTerm) ||
         product.keywords?.some((keyword) => keyword.toLowerCase().includes(searchTerm)) ||
         false

      // Filter restaurants based on name or associated products
      const filteredRestaurants = restaurants.filter((restaurant) => {
         const isRestaurantMatch = restaurant.name.toLowerCase().includes(searchTerm)

         const hasMatchingProduct = products.some(
            (product) => product.businessId === restaurant.id && doesProductMatch(product)
         )

         return isRestaurantMatch || hasMatchingProduct
      })

      // Update the restaurant list with filtered results
      setRestaurants(filteredRestaurants)
   },
   10
) // Adjust debounce timing as needed
