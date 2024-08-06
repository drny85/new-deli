import { dayjsFormat } from '@/utils/dayjs'

export const isFromToday = (date: string) =>
   dayjsFormat(date).isAfter(dayjsFormat().startOf('day')) &&
   dayjsFormat(date).isBefore(dayjsFormat().endOf('day'))
