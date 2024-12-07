import { Category } from '@/shared/types'

export function concatenateAndReturnNotInArray1(arr1: Category[], arr2: Category[]): Category[] {
   const notInArray1Arr: Category[] = []
   arr1.forEach((c) => {
      const index = arr2.findIndex((c2) => c2.name.toLowerCase() === c.name.toLowerCase()) === -1
      if (index) notInArray1Arr.push(c)
   })
   return [...new Set(notInArray1Arr)]
}
