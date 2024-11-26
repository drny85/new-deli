import { updateBusiness } from '@/actions/business'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { router } from 'expo-router'

const NoCourriers = () => {
   const restaurant = useRestaurantsStore((s) => s.restaurant)

   return (
      <Container>
         <BackButton
            containerStyle={{ marginTop: SIZES.md }}
            onPress={() => {
               if (router.canGoBack()) {
                  router.back()
               } else {
                  console.log('cannot go back')
                  router.canDismiss() && router.dismiss()
               }
            }}
         />

         <View center style={{ padding: SIZES.lg * 2, gap: SIZES.lg }}>
            <Text type="title">Welcome Back {restaurant?.name}!</Text>
            <Text>
               I know how important is to you and your business to start receiving orders. However,
               there is nobody assigned as courier to start delivering those orders
            </Text>
            <Text>
               Please ask your courier or delivery guy to download the 'Deli Driver App" and create
               an account. Once the account has been created, the courier can request to be added as
               your delivery person and then you will be able to accept that request and start
               taking orders
            </Text>
            <View style={{ marginTop: SIZES.lg * 3 }}>
               <Row containerStyle={{ gap: SIZES.lg * 2 }}>
                  <Button
                     onPress={async () => {
                        if (restaurant) {
                           const updated = await updateBusiness({
                              ...restaurant,
                              ordersMethod: 'pickup-only'
                           })
                           if (updated) {
                              router.back()
                           }
                        }
                     }}
                     type="soft"
                     contentTextStyle={{ paddingHorizontal: 30 }}
                     title=" Just take pick up orders for now"
                  />

                  {/* <Button
                     contentTextStyle={{ paddingHorizontal: SIZES.lg }}
                     title="Send Link To Courier"
                     type="soft"
                     onPress={() => sendAppDoanloadLink('6462251912', deviceLink)}
                  /> */}
               </Row>
            </View>
         </View>
      </Container>
   )
}

export default NoCourriers
