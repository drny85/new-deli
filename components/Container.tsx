import { Colors } from '@/constants/Colors'
import { StyleSheet, SafeAreaView, useColorScheme, ViewStyle } from 'react-native'

export const Container = ({
   children,
   contentContainerStyle,
   center = false
}: {
   children: React.ReactNode
   contentContainerStyle?: ViewStyle
   center?: boolean
}) => {
   const backgroundColor =
      useColorScheme() === 'dark' ? Colors.dark.background : Colors.light.background
   return (
      <SafeAreaView
         style={[
            styles.container,
            {
               backgroundColor,
               maxWidth: center ? 600 : undefined,
               alignSelf: center ? 'center' : undefined
            },
            contentContainerStyle
         ]}>
         {children}
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      width: '100%'
   }
})
