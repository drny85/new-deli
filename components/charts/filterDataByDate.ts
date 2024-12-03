import { Order } from '@/typing'
import { isSameDay, isSameWeek, isSameMonth, format, endOfWeek } from 'date-fns'
import { pieDataItem } from 'react-native-gifted-charts'

type Range = 'today' | 'wtd' | 'mtd' | 'all'

const generateHexColor = () =>
   `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')}`

export const filterOrdersByDate = (orders: Order[], range: Range): Order[] => {
   const now = new Date()

   switch (range) {
      case 'today':
         return orders.filter((order) => isSameDay(new Date(order.orderDate), now))
      case 'wtd':
         return orders.filter((order) =>
            isSameWeek(new Date(order.orderDate), now, { weekStartsOn: 1 })
         ) // Week starts on Monday
      case 'mtd':
         return orders.filter((order) => isSameMonth(new Date(order.orderDate), now))
      case 'all':
      default:
         return orders
   }
}

export const transformDataForPieChart = (orders: Order[], range: Range): pieDataItem[] => {
   const categorizedData = categorizeTipsByRange(orders, range)

   // Determine the maximum value in categorized data for the "focused" property
   const maxValue = Math.max(...categorizedData.map(({ value }) => value), 0)

   // Generate chart data

   return categorizedData.map(({ category, value }) => ({
      value,
      color: generateHexColor(), // Generate random colors for the chart
      text: category, // Use category (e.g., Morning, Afternoon, etc.) as text
      focused: value === maxValue

      // Mark the highest value as focused
   }))
}

export const prepareTextData = (
   orders: Order[],
   range: Range
): { category: string; value: number }[] => {
   return categorizeTipsByRange(orders, range)
}

const categorizeTipsByRange = (
   orders: Order[],
   range: Range
): { category: string; value: number }[] => {
   const now = new Date()

   // Helper to aggregate tips into categories
   const aggregateTips = (acc: Record<string, number>, category: string, amount: number) => {
      acc[category] = (acc[category] || 0) + amount
      return acc
   }

   let tipsByCategory: Record<string, number> = {}

   switch (range) {
      case 'today': {
         // Categorize by time of day
         tipsByCategory = orders
            .filter((order) => isSameDay(new Date(order.orderDate), now))
            .reduce((acc, order) => {
               const hour = new Date(order.orderDate).getHours()
               const category = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Night'
               return aggregateTips(acc, category, order.total)
            }, {})
         break
      }

      case 'wtd': {
         // Categorize by weekday
         tipsByCategory = orders
            .filter((order) => isSameWeek(new Date(order.orderDate), now, { weekStartsOn: 1 }))
            .reduce((acc, order) => {
               const category = format(new Date(order.orderDate), 'EEE') // Mon, Tue, etc.
               return aggregateTips(acc, category, order.total)
            }, {})
         break
      }

      case 'mtd': {
         // Categorize by week-ending date (e.g., "WE 2nd", "WE 9th")
         tipsByCategory = orders
            .filter((order) => isSameMonth(new Date(order.orderDate), now))
            .reduce((acc, order) => {
               const date = new Date(order.orderDate)
               const end = endOfWeek(date, { weekStartsOn: 1 }) // Week ends on Sunday
               const category = `WE ${format(end, 'do')}` // "WE 2nd", "WE 9th", etc.
               return aggregateTips(acc, category, order.total)
            }, {})
         break
      }

      case 'all': {
         // Categorize by month and year
         tipsByCategory = orders.reduce((acc, order) => {
            const category = format(new Date(order.orderDate), 'MMM yyyy') // Nov 2024, Dec 2024, etc.
            return aggregateTips(acc, category, order.total)
         }, {})
         break
      }
   }

   // Convert the record into an array of { category, value } for charts and text display
   return Object.entries(tipsByCategory).map(([category, value]) => ({ category, value }))
}
