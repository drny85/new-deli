import React from 'react'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'
import NeumorphismView from '../NeumorphismView'
import { SIZES } from '@/constants/Colors'
import { Product } from '@/shared/types'
import Row from '../Row'
import { Feather } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { toast } from 'sonner-native'
import { updateProduct } from '@/actions/products'

type Props = {
   product: Product
}
const ProductAvailability = ({ product }: Props) => {
   const toggleAvailability = () => {
      toast('Change Availibility', {
         description: `Are you sure you want to change the availability for ${product.name}?`,
         duration: Infinity,
         action: {
            label: 'Confirm',
            onClick: () => confirmChanges()
         },
         cancel: {
            label: 'Cancel',
            onClick: () => toast.dismiss()
         }
      })
   }

   const confirmChanges = async () => {
      try {
         if (!product) return
         await updateProduct({ ...product, available: !product.available })
         toast.dismiss()
         toast.success('Product Updated', {
            description: `Product ${product.name} has been updated`,
            duration: 2000
         })
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <View center>
         <Text type="title">Availability</Text>
         <Row
            align="center"
            containerStyle={{
               alignItems: 'center',
               gap: SIZES.sm,
               marginTop: SIZES.sm
            }}>
            <View
               style={{
                  paddingHorizontal: SIZES.lg * 2,
                  opacity: product.available ? 1 : 0.5,
                  borderRadius: 30,
                  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                  padding: SIZES.sm,
                  backgroundColor: product.available ? 'green' : 'red'
               }}>
               <Text type="defaultSemiBold" textColor="white">
                  {product.available ? 'Available' : 'Not Available'}
               </Text>
            </View>
            <NeumorphismView
               borderRadius={20}
               style={{ height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
               <TouchableOpacity onPress={toggleAvailability}>
                  <Feather
                     name={product.available ? 'check-circle' : 'x-circle'}
                     size={30}
                     color={product.available ? 'green' : 'red'}
                  />
               </TouchableOpacity>
            </NeumorphismView>
         </Row>
      </View>
   )
}

export default ProductAvailability
