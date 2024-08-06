import { SIZES } from '@/constants/Colors'
import NeoView from './NeoView'
import { Text } from './ThemedText'
import { Courier } from '@/typing'
import { View } from './ThemedView'
import Row from './Row'
import { Image } from 'expo-image'
import PhoneCall from './PhoneCall'
import Button from './Button'

type Props = {
   courier: Courier
   onPress: () => void
}
const CourierCard = ({ courier, onPress }: Props) => {
   return (
      <NeoView
         innerStyleContainer={{ borderRadius: SIZES.lg * 2 }}
         containerStyle={{
            borderRadius: SIZES.lg * 2
         }}>
         <Row containerStyle={{ gap: SIZES.md }}>
            <View>
               <Image
                  source={courier.image}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={300}
               />
            </View>
            <View style={{ paddingHorizontal: SIZES.md, flexGrow: 1 }}>
               <Text type="muted" fontSize="large" center>
                  {courier.name} {courier.lastName}
               </Text>

               <Row align="between">
                  <PhoneCall size={60} phone={courier.phone!} />
                  <Button
                     contentTextStyle={{ paddingHorizontal: SIZES.lg }}
                     type="soft"
                     title="Change"
                     onPress={onPress}
                  />
               </Row>
            </View>
         </Row>
      </NeoView>
   )
}

export default CourierCard
