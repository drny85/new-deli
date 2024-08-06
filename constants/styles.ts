import { StyleSheet } from 'react-native'

export const globalStyle = StyleSheet.create({
   center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   },
   flex: {
      flex: 1
   },
   shadow: {
      shadowOffset: {
         width: -2,
         height: 2
      },
      shadowRadius: 6,
      shadowOpacity: 0.8,
      elevation: 5,
      shadowColor: '#21212180'
   }
})
