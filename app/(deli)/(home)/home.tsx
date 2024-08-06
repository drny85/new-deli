import { updateBusiness } from '@/actions/business'
import Dashboard from '@/components/business/Dashboard'
import GraphComponent from '@/components/business/OrderGraph'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useOrders } from '@/hooks/orders/useOrders'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { useBusinessOrdersStore } from '@/stores/businessOrders'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useState } from 'react'

const INDEXES = ['Activities', 'Reports']

const Home = () => {
   const { user } = useAuth()
   useRestaurant(user?.id!)
   const restaurant = useRestaurantsStore((s) => s.restaurant)
   const ascentColor = useThemeColor('ascent')
   const textColor = useThemeColor('text')
   const errorColor = useThemeColor('error')
   const { loading } = useOrders(user?.id)
   const [selectedIndex, setSelectedIndex] = useState(0)
   const orders = useBusinessOrdersStore((s) => s.orders)

   if (loading) return <Loading />
   return (
      <Container>
         <View style={{ width: '50%', alignSelf: 'center', marginVertical: SIZES.md }}>
            <SegmentedControl
               values={INDEXES}
               selectedIndex={selectedIndex}
               activeFontStyle={{
                  fontSize: 20,
                  fontFamily: 'Montserrat-Bold',
                  color: ascentColor
               }}
               fontStyle={{ fontSize: 18, fontFamily: 'Montserrat', color: textColor }}
               onChange={(event) => {
                  setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
               }}
            />
         </View>
         {!restaurant?.isOpen && (
            <View
               style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: errorColor,
                  alignSelf: 'center',
                  width: '80%',
                  borderRadius: SIZES.lg
               }}>
               <Row containerStyle={{ gap: SIZES.lg }}>
                  <Text textColor="white" type="title">
                     Store is closed
                  </Text>
                  <Button
                     containerStyle={{ paddingHorizontal: SIZES.lg }}
                     title="Open Store"
                     type="soft"
                     onPress={() => {
                        if (!restaurant) return
                        updateBusiness({
                           ...restaurant,
                           isOpen: true
                        })
                     }}
                  />
               </Row>
            </View>
         )}
         {selectedIndex === 0 && <Dashboard orders={orders} />}
         {selectedIndex === 1 && <GraphComponent orders={orders} />}
      </Container>
   )
}

export default Home
