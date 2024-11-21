import { SIZES } from '@/constants/Colors'
import {
   StyleProp,
   StyleSheet,
   TextInput,
   TextInputProps,
   ViewStyle,
   TextStyle
} from 'react-native'
import { View } from './ThemedView'
import { Text } from './ThemedText'
import NeoView from './NeoView'
import { useThemeColor } from '@/hooks/useThemeColor'
import { forwardRef, ReactNode } from 'react'

type Props = TextInputProps & {
   title?: string
   error?: string
   containerStyle?: TextStyle
   contentContainerStyle?: StyleProp<ViewStyle>
   RightIcon?: ReactNode
   LeftIcon?: ReactNode
}
const Input = forwardRef<TextInput, Props>(
   (
      { error, title, RightIcon, LeftIcon, containerStyle, contentContainerStyle, ...props },
      ref
   ) => {
      const bgColor = useThemeColor('primary')
      const textColor = useThemeColor('text')
      const background = useThemeColor('background')
      return (
         <View style={[contentContainerStyle]}>
            {title && (
               <Text type="defaultSemiBold" style={styles.title}>
                  {title}
               </Text>
            )}
            <NeoView
               innerStyleContainer={{ borderRadius: SIZES.lg * 2 }}
               containerStyle={{
                  borderRadius: SIZES.lg * 2,
                  backgroundColor: background,
                  borderColor: bgColor
               }}>
               <View style={styles.innerView}>
                  {LeftIcon && <View style={styles.leftIcon}>{LeftIcon}</View>}

                  <TextInput
                     ref={ref}
                     style={[
                        styles.input,
                        {
                           borderColor: bgColor,
                           paddingLeft: LeftIcon ? SIZES.md * 1.3 : 12,
                           backgroundColor: background,
                           color: textColor
                        },

                        containerStyle
                     ]}
                     {...props}
                  />
                  {RightIcon && <View style={styles.rightIcon}>{RightIcon}</View>}
               </View>
            </NeoView>
            {error && <Text style={styles.error}>{error}</Text>}
         </View>
      )
   }
)

export default Input

const styles = StyleSheet.create({
   input: {
      height: 46,
      borderWidth: 1,
      padding: 10,
      borderRadius: SIZES.sm,
      width: '100%',
      fontSize: 18,
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Montserrat'
   },
   title: {
      paddingLeft: SIZES.sm,

      textTransform: 'capitalize'
   },

   error: {
      fontFamily: 'Montserrat',
      fontSize: 16,
      color: 'red',
      paddingLeft: SIZES.sm
   },
   rightIcon: {
      position: 'absolute',
      right: 12,
      zIndex: 2,
      alignSelf: 'center'
   },
   leftIcon: {
      position: 'absolute',
      left: 8,
      zIndex: 2,
      alignSelf: 'center'
   },
   innerView: {
      alignItems: 'center',
      justifyContent: 'center'
   }
})
