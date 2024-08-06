import { couriersCollection } from '@/collections'
import { useAuth } from '@/providers/authProvider'
import { StoreCourierData } from '@/typing'
import { onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export const useCourierWaitingList = () => {
   const { user } = useAuth()
   const [list, setList] = useState<StoreCourierData[]>([])
   const [loadingList, setLoadingList] = useState(false)
   useEffect(() => {
      setLoadingList(true)
      const queryRef = query(couriersCollection, where('businessId', '==', user?.id))
      return onSnapshot(queryRef, (snap) => {
         setList(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
         setLoadingList(false)
      })
   }, [user])

   return { list, loadingList }
}
