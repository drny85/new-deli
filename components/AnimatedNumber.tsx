import { useThemeColor } from '@/hooks/useThemeColor'
import { useEffect, useRef } from 'react'
import { TextInput, Animated, Easing, TextStyle } from 'react-native'

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)

type Props = {
   value: number
   fontSize?: number
   prefix?: string
   fixed?: boolean
   textStyle?: TextStyle
}
const AnimatedNumber = ({ value, fontSize = 20, prefix = '$', fixed = true, textStyle }: Props) => {
   const inputRef = useRef<TextInput>(null)
   const animated = useRef(new Animated.Value(0)).current
   const textColor = useThemeColor('text')
   const animation = (toValue: number) => {
      return Animated.timing(animated, {
         delay: 200,
         toValue,
         duration: 400,
         useNativeDriver: true,
         easing: Easing.out(Easing.ease)
      }).start()
   }

   useEffect(() => {
      animation(value)
      animated.addListener(({ value }) => {
         if (inputRef.current) {
            inputRef.current.setNativeProps({
               text: fixed ? `${prefix}${value.toFixed(2)}` : `${prefix}${Math.ceil(value)}`
            })
         }
      })
      return () => {
         animated.removeAllListeners()
      }
   }, [value, fixed])

   return (
      <AnimatedTextInput
         ref={inputRef}
         underlineColorAndroid="transparent"
         editable={false}
         defaultValue="0"
         style={[
            {
               fontSize: fontSize,
               color: textColor,
               fontWeight: '700'
            },
            textStyle
         ]}
      />
   )
}

export default AnimatedNumber
