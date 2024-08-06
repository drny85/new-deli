// useShakeEffect.ts
import {
   useSharedValue,
   useAnimatedStyle,
   withRepeat,
   withSequence,
   withTiming,
   Easing
} from 'react-native-reanimated'

const useShakeEffect = (duration: number = 300, intensity: number = 10) => {
   const shakeAnimation = useSharedValue(0)

   const triggerShake = () => {
      shakeAnimation.value = withSequence(
         withTiming(intensity, { duration: duration / 4, easing: Easing.linear }),
         withTiming(-intensity, { duration: duration / 2, easing: Easing.linear }),
         withTiming(intensity, { duration: duration / 2, easing: Easing.linear }),
         withTiming(-intensity, { duration: duration / 2, easing: Easing.linear }),
         withTiming(intensity, { duration: duration / 2, easing: Easing.linear }),
         withTiming(0, { duration: duration / 4, easing: Easing.linear })
      )
   }

   const shakeStyle = useAnimatedStyle(() => {
      return {
         transform: [{ translateX: shakeAnimation.value }]
      }
   })

   return { triggerShake, shakeStyle }
}

export default useShakeEffect
