// CustomCard.tsx

import { Courier } from '@/typing'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Row from './Row'
import { View } from './ThemedView'
import { Image } from 'expo-image'
import { Text } from './ThemedText'
import { SIZES } from '@/constants/Colors'
import NeoView from './NeoView'
import Button from './Button'

type CustomCardProps = {
   courier: Courier
   onPress: () => void
   assigned: Courier | null
   onCourierPress: (courier: Courier) => void
}

const CustomCard: React.FC<CustomCardProps> = ({ courier, onPress, onCourierPress, assigned }) => {
   return (
      <NeoView
         containerStyle={{ borderRadius: SIZES.lg }}
         innerStyleContainer={{ padding: SIZES.md, borderRadius: SIZES.md }}>
         <TouchableOpacity onPress={onPress}>
            <Row>
               <Image source={{ uri: courier.image }} style={styles.cardImage} />
               <View style={styles.cardInner}>
                  <Text style={styles.cardText}>
                     {courier.name} {courier.lastName}
                  </Text>
                  <Text type="muted">
                     Status: <Text>{courier.isOnline ? 'Online' : 'Offline'}</Text>
                  </Text>
                  <Text type="muted">
                     Disposition: <Text>{courier.busy ? 'Busy' : 'Available'}</Text>
                  </Text>
                  <Text>Distance: {courier.distance?.toFixed(2)} miles</Text>
               </View>
            </Row>
         </TouchableOpacity>
         <View style={{ width: '60%', alignSelf: 'center' }}>
            <Button
               disabled={assigned && assigned.id === courier.id ? true : false}
               title={assigned && assigned.id === courier.id ? 'Assigned' : 'Assign'}
               containerStyle={{ opacity: assigned && assigned.id === courier.id ? 0.6 : 1 }}
               type={assigned && assigned.id === courier.id ? 'primary' : 'soft'}
               contentTextStyle={{
                  color: assigned && assigned.id === courier.id ? '#ffffff' : '#212121'
               }}
               onPress={() => onCourierPress(courier)}
            />
         </View>
      </NeoView>
   )
}

const styles = StyleSheet.create({
   cardInner: {
      padding: SIZES.sm
   },
   cardImage: {
      width: 100,
      height: 100,
      borderRadius: 100 / 2
   },
   cardText: {
      marginTop: 10,
      fontSize: 18,
      fontWeight: 'bold'
   }
})

export default CustomCard
