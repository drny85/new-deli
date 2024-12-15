import { weekdaysOrder } from '@/shared/types'
import { pieDataItem } from 'react-native-gifted-charts'

export type FilterData = pieDataItem & {
   color: string
}

export const sortByWeekdays = (data: FilterData[]) => {
   return data.sort((a, b) => {
      const indexA = weekdaysOrder.indexOf(a.text || '')
      const indexB = weekdaysOrder.indexOf(b.text || '')
      return indexA - indexB
   })
}

const monthsOrder = [
   'Jan',
   'Feb',
   'Mar',
   'Apr',
   'May',
   'Jun',
   'Jul',
   'Aug',
   'Sep',
   'Oct',
   'Nov',
   'Dec'
]

export const sortByMonths = (data: FilterData[]) => {
   return data.sort((a, b) => {
      const indexA = monthsOrder.indexOf(a.text || '')
      const indexB = monthsOrder.indexOf(b.text || '')
      return indexA - indexB
   })
}
