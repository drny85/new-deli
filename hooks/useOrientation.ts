// useOrientation.ts
import { useState, useEffect } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

type Orientation = 'portrait' | 'landscape'

const useOrientation = (): Orientation => {
   const [orientation, setOrientation] = useState<Orientation>(
      Dimensions.get('window').width > Dimensions.get('window').height ? 'landscape' : 'portrait'
   )

   useEffect(() => {
      const handleChange = ({ window }: { window: ScaledSize }) => {
         setOrientation(window.width > window.height ? 'landscape' : 'portrait')
      }

      const subscription = Dimensions.addEventListener('change', handleChange)

      return () => {
         if (subscription?.remove) {
            subscription.remove()
         }
      }
   }, [])

   return orientation
}

export default useOrientation
