import { P_Size } from '@/shared/types'

export const letterSizes = (sizes: P_Size[]) =>
   sizes.map((s) => s.id).some((v) => v === 's' || v === 'm' || v === 'l' || v === 'xl')
