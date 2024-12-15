import { Text as ThemedText, type TextProps, StyleSheet } from 'react-native'

import { useThemeColor } from '@/hooks/useThemeColor'
import { Colors } from '@/constants/Colors'

export type ThemedTextProps = TextProps & {
   fontSize?: 'small' | 'medium' | 'large'
   lightColor?: string
   darkColor?: string
   capitalize?: boolean
   center?: boolean
   textColor?: keyof typeof Colors.light & keyof typeof Colors.dark
   type?:
      | 'default'
      | 'title'
      | 'defaultSemiBold'
      | 'subtitle'
      | 'link'
      | 'header'
      | 'italic'
      | 'error'
      | 'muted'
}

export function Text({
   style,
   textColor,
   fontSize,
   center,
   capitalize = false,

   type = 'default',
   ...rest
}: ThemedTextProps) {
   const color = useThemeColor('text')
   const error = useThemeColor('error')

   return (
      <ThemedText
         style={[
            { color },
            type === 'default' ? styles.default : undefined,
            type === 'title' ? styles.title : undefined,
            type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
            type === 'subtitle' ? styles.subtitle : undefined,
            type === 'link' ? styles.link : undefined,
            type === 'header' ? styles.header : undefined,
            type === 'italic' ? styles.italic : undefined,
            type === 'error' ? { color: error } : undefined,
            type === 'muted' ? styles.muted : undefined,

            center && styles.center,
            capitalize && styles.capitalize,
            textColor && { color: textColor },
            fontSize && {
               fontSize:
                  fontSize === 'small'
                     ? 12
                     : fontSize === 'medium'
                       ? 16
                       : fontSize === 'large'
                         ? 20
                         : undefined
            },

            style
         ]}
         {...rest}
      />
   )
}

const styles = StyleSheet.create({
   default: {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: 'Montserrat'
   },
   defaultSemiBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600'
   },
   capitalize: {
      textTransform: 'capitalize'
   },
   muted: {
      color: '#999999'
   },
   italic: {
      fontStyle: 'italic',
      fontFamily: 'MontserratItalic'
   },
   center: {
      textAlign: 'center'
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      fontFamily: 'MontserratBold',
      lineHeight: 32
   },

   subtitle: {
      fontSize: 16,

      fontFamily: 'Montserrat',
      lineHeight: 22
   },
   header: {
      fontFamily: 'Lobster',
      fontSize: 24
   },
   link: {
      lineHeight: 30,
      fontSize: 16,
      color: '#0a7ea4'
   }
})
