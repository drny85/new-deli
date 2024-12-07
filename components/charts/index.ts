import dayjs from 'dayjs'
import { getRandomColor } from '@/utils/getRandomColor'
import { Filter, FilterDay, Order } from '@/shared/types'

type FilterDataResult = {
   ordersData: { value: number; label: string; frontColor: string }[]
   productsData: { value: number; label: string }[]
}
export const filterDataForGraph = (
   orders: Order[],
   filter: Filter,
   all?: boolean
): FilterDataResult & { days: string[] } => {
   const now = dayjs()
   const daysFormat =
      filter === 'thisWeek'
         ? 'ddd'
         : filter === 'lastWeek'
           ? 'ddd'
           : filter === 'monthToDate'
             ? 'MMM'
             : filter === 'yearToDate'
               ? 'YYYY'
               : filter === 'all'
                 ? 'All'
                 : 'ddd'

   const getStartDate = (filter: Filter): dayjs.Dayjs => {
      const filterMap: Record<Filter, dayjs.Dayjs> = {
         thisWeek: now.startOf('week'),
         lastWeek: now.subtract(1, 'week').startOf('week'),
         monthToDate: now.startOf('month'),
         yearToDate: now.startOf('year'),
         today: now.startOf('day'),
         all: dayjs('2000-01-01') // Arbitrary far past date for "All"
      }
      return filterMap[filter] || now.startOf('year')
   }

   const startDate = getStartDate(filter)

   const generateTimeBuckets = () => {
      const buckets = {
         morning: { start: now.startOf('day'), end: now.startOf('day').add(12, 'hours') },
         afternoon: {
            start: now.startOf('day').add(12, 'hours'),
            end: now.startOf('day').add(17, 'hours')
         },
         evening: { start: now.startOf('day').add(17, 'hours'), end: now.endOf('day') }
      }

      const bucketLabels: Record<string, string> = {
         morning: 'Morning',
         afternoon: 'Afternoon',
         evening: 'Evening'
      }

      return { buckets, bucketLabels }
   }

   const filteredOrders = all
      ? orders
      : orders.filter((order) => {
           const orderDate = dayjs(order.orderDate)
           return orderDate.isAfter(startDate) || orderDate.isSame(startDate)
        })

   let ordersData: { value: number; label: string; frontColor: string }[]
   let days: string[]

   if (filter === 'today') {
      const { buckets, bucketLabels } = generateTimeBuckets()

      // Group orders into time buckets
      const bucketedData = filteredOrders.reduce(
         (acc, order) => {
            const orderTime = dayjs(order.orderDate)

            for (const [key, { start, end }] of Object.entries(buckets)) {
               if (
                  (orderTime.isSame(start) || orderTime.isAfter(start)) &&
                  orderTime.isBefore(end)
               ) {
                  acc[key] = (acc[key] || 0) + order.total
                  break
               }
            }

            return acc
         },
         {} as Record<string, number>
      )

      // Convert bucketed data to ordersData
      ordersData = Object.entries(bucketedData).map(([key, total]) => ({
         value: total,
         label: bucketLabels[key],
         frontColor: getRandomColor()
      }))

      days = Object.values(bucketLabels) // Morning, Afternoon, Evening
   } else if (filter === 'yearToDate') {
      // Group orders by months
      const groupedData = filteredOrders.reduce(
         (acc, order) => {
            const monthLabel = dayjs(order.orderDate).format('MMM')
            acc[monthLabel] = (acc[monthLabel] || 0) + order.total
            return acc
         },
         {} as Record<string, number>
      )

      ordersData = Object.entries(groupedData).map(([label, total]) => ({
         value: total,
         label,
         frontColor: getRandomColor()
      }))

      days = Object.keys(groupedData) // Months (e.g., Jan, Feb, ...)
   } else if (filter === 'all') {
      // Group orders by years
      const groupedData = filteredOrders.reduce(
         (acc, order) => {
            const yearLabel = dayjs(order.orderDate).format('YYYY')
            acc[yearLabel] = (acc[yearLabel] || 0) + order.total
            return acc
         },
         {} as Record<string, number>
      )

      ordersData = Object.entries(groupedData).map(([label, total]) => ({
         value: total,
         label,
         frontColor: getRandomColor()
      }))

      days = Object.keys(groupedData) // Years (e.g., 2024, 2025, ...)
   } else {
      // Generate an array of days between `startDate` and now
      days = []
      let current = startDate
      while (current.isBefore(now) || current.isSame(now, 'day')) {
         days.push(current.format(daysFormat))
         current = current.add(1, 'day') // Increment by one day
      }

      // Group orders by day
      const groupedData = filteredOrders.reduce(
         (acc, order) => {
            const dateLabel = dayjs(order.orderDate).format(daysFormat)
            acc[dateLabel] = (acc[dateLabel] || 0) + order.total
            return acc
         },
         {} as Record<string, number>
      )

      // Convert grouped data to ordersData
      ordersData = Object.entries(groupedData).map(([label, total]) => ({
         value: total,
         label,
         frontColor: getRandomColor()
      }))
   }

   const products = filteredOrders.reduce(
      (acc, order) => {
         order.items.forEach((item) => {
            acc[item.name] = (acc[item.name] || 0) + item.quantity
         })
         return acc
      },
      {} as Record<string, number>
   )

   const productsData = Object.entries(products)
      .map(([name, totalQuantity]) => ({
         value: totalQuantity,
         label: name
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

   return { ordersData, productsData, days }
}

interface FilteredData {
   value: number
   label: string
   frontColor: string
}

export const filterOrdersByTime = (orders: Order[], filter: FilterDay) => {
   let groupedData: Record<string, number> = {}
   let labelExtractor: (date: dayjs.Dayjs) => string

   // Determine label extractor based on filter
   switch (filter) {
      case 'timeOfDay':
         labelExtractor = (date) => {
            const hour = date.hour()
            if (hour < 12) return 'Morning'
            if (hour < 17) return 'Afternoon'
            return 'Evening'
         }
         break
      case 'dayOfWeek':
         labelExtractor = (date) => date.format('ddd') // Mon, Tue, ...
         break
      case 'month':
         labelExtractor = (date) => date.format('MMM') // Jan, Feb, ...
         break
      case 'year':
         labelExtractor = (date) => date.format('YYYY') // 2024, 2025, ...
         break
      default:
         throw new Error('Invalid filter type')
   }

   // Group orders
   groupedData = orders.reduce(
      (acc, order) => {
         const orderDate = dayjs(order.orderDate)
         const label = labelExtractor(orderDate)

         acc[label] = (acc[label] || 0) + order.total
         return acc
      },
      {} as Record<string, number>
   )

   // Convert grouped data into the desired format
   const filteredData: FilteredData[] = Object.entries(groupedData).map(([label, value]) => ({
      value,
      label,
      frontColor: getRandomColor()
   }))

   return filteredData
}
