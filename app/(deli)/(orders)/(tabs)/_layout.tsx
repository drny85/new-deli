import { useThemeColor } from '@/hooks/useThemeColor'
import {
   MaterialTopTabNavigationEventMap,
   MaterialTopTabNavigationOptions,
   createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { withLayoutContext } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
const { Navigator } = createMaterialTopTabNavigator()
export const MaterialTopTabs = withLayoutContext<
   MaterialTopTabNavigationOptions,
   typeof Navigator,
   TabNavigationState<ParamListBase>,
   MaterialTopTabNavigationEventMap
>(Navigator)

const HomeLayout = () => {
   const bgColor = useThemeColor('background')
   const acent = useThemeColor('ascent')
   const text = useThemeColor('text')
   const border = useThemeColor('tabIconDefault')

   return (
      <SafeAreaView style={{ flex: 1 }}>
         <MaterialTopTabs
            screenOptions={{
               tabBarStyle: {
                  backgroundColor: bgColor,
                  borderColor: border,
                  borderBottomWidth: 0.5
               },
               tabBarActiveTintColor: text,
               tabBarIndicatorStyle: { backgroundColor: acent, height: 3 },
               tabBarLabelStyle: {
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  fontFamily: 'Montserrat',
                  fontSize: 16
               }
            }}>
            <MaterialTopTabs.Screen name="index" options={{ title: 'New' }} />
            <MaterialTopTabs.Screen name="progress" options={{ title: 'In Progress' }} />
            <MaterialTopTabs.Screen name="in-route" options={{ title: 'In Route' }} />
            <MaterialTopTabs.Screen name="delivered" options={{ title: 'Completed' }} />
            <MaterialTopTabs.Screen name="all-orders" options={{ title: 'All Orders' }} />
         </MaterialTopTabs>
      </SafeAreaView>
   )
}

export default HomeLayout
