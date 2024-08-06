import { View as ThemedView, type ViewProps } from 'react-native'

import { globalStyle } from '@/constants/styles'

export type ThemedViewProps = ViewProps & {
   lightColor?: string
   darkColor?: string
   center?: boolean
}

export function View({ style, lightColor, darkColor, center, ...otherProps }: ThemedViewProps) {
   return (
      <ThemedView
         style={[{ backgroundColor: 'transparent' }, center && globalStyle.center, style]}
         {...otherProps}
      />
   )
}
