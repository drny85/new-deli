import dayjs from 'dayjs'
import localized from 'dayjs/plugin/localizedFormat'
dayjs.extend(localized)
export const dayjsFormat = dayjs
