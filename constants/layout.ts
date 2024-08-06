import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { Colors } from './Colors'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
   headerLargeTitle: true,
   headerLargeStyle: {
      backgroundColor: Colors.light.ascent
   },
   headerLargeTitleStyle: {
      color: Colors.light.ascent
   },

   headerSearchBarOptions: {
      hintTextColor: Colors.light.tint,
      tintColor: Colors.light.ascent,
      barTintColor: Colors.light.ascent
   },

   headerTintColor: Colors.light.ascent,
   headerTransparent: true,
   headerBlurEffect: 'prominent',
   headerShadowVisible: false
}
