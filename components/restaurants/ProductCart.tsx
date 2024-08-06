import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import NeoView from '../NeoView'
import { Image } from 'expo-image'
import { SIZES } from '@/constants/Colors'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'
import { Product } from '@/typing'
import { LinearGradient } from 'expo-linear-gradient'
import Row from '../Row'

const ProductCard = ({
   product,
   onPress,
   containerStyle
}: {
   product: Product
   onPress: () => void
   containerStyle?: ViewStyle
}) => {
   return (
      <NeoView
         containerStyle={{ borderRadius: SIZES.md }}
         innerStyleContainer={{ borderRadius: SIZES.md }}>
         <TouchableOpacity onPress={onPress}>
            <View
               style={[
                  {
                     borderRadius: SIZES.md,
                     width: SIZES.width * 0.6,
                     height: SIZES.height * 0.2
                  },
                  containerStyle
               ]}>
               <Image
                  source={{ uri: product.image! }}
                  transition={200}
                  style={styles.image}
                  contentFit="cover"
               />
               {/* <Text>{product.name}</Text> */}
            </View>
            <LinearGradient
               start={{ x: 0.2, y: 0.8 }}
               end={{ x: 0.5, y: 0.6 }}
               colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.8)']}
               style={styles.bottom}>
               <Row align="between">
                  <View style={{ width: '70%' }}>
                     <Text type="header" fontSize="medium" textColor="white">
                        {product.name}
                     </Text>
                  </View>
                  <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                     {product.sizes && product.sizes.length > 0 && (
                        <Text type="defaultSemiBold" fontSize="small" textColor="white">
                           As low as
                        </Text>
                     )}
                     <Text type="defaultSemiBold" textColor="white">
                        ${product.price}
                     </Text>
                  </View>
               </Row>
            </LinearGradient>
         </TouchableOpacity>
      </NeoView>
   )
}

export default ProductCard

const styles = StyleSheet.create({
   image: { width: '100%', height: '100%', borderRadius: SIZES.md },
   bottom: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      padding: SIZES.sm,
      borderBottomLeftRadius: SIZES.md,
      borderBottomRightRadius: SIZES.md
   }
})
