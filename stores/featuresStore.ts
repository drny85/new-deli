import { create } from 'zustand'
type Params = {
   title: string
   description: string
}
type FeaturesParams = {
   showNewOrderPopup: boolean
   setShowNewOrderPopup: (show: boolean) => void
   setPopupParams: (params: Params | null) => void
   popupParams: {
      title: string
      description: string
   } | null
}
export const useFeaturesStore = create<FeaturesParams>((set) => ({
   showNewOrderPopup: false,
   popupParams: null,
   setPopupParams: (params) =>
      set(() => ({
         popupParams: {
            title: params?.title!,
            description: params?.description!
         }
      })),

   setShowNewOrderPopup: (show: boolean) => set(() => ({ showNewOrderPopup: show }))
}))
