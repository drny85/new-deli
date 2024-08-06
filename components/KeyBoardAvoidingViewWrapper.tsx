import React from 'react'
import { KeyboardAvoidingView, Platform, KeyboardAvoidingViewProps, StyleSheet } from 'react-native'

type Props = KeyboardAvoidingViewProps & {
   children: React.ReactNode
}

const KeyboardAvoidingViewComponent: React.FC<Props> = ({
   children,
   behavior,
   keyboardVerticalOffset,
   ...props
}) => {
   return (
      <KeyboardAvoidingView
         style={styles.container}
         behavior={behavior || (Platform.OS === 'ios' ? 'padding' : 'height')}
         keyboardVerticalOffset={keyboardVerticalOffset || 0}
         {...props}>
         {children}
      </KeyboardAvoidingView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1
   }
})

export default KeyboardAvoidingViewComponent
