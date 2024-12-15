import { deleteProduct } from '@/actions/products'
import BackButton from '@/components/BackButton'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import SizePicker from '@/components/restaurants/SizePicker'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useProduct } from '@/hooks/restaurants/useProduct'
import { useAuth } from '@/providers/authProvider'
import { P_Size } from '@/shared/types'
import { FontAwesome } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native'

const BusinessProduct = () => {
   const { user } = useAuth()
   const { productId } = useLocalSearchParams<{ productId: string }>()
   const [selected, setSelected] = useState<P_Size | null>(null)
   const { product, loading } = useProduct(user?.id!, productId!)

   if (loading) return <Loading />

   if (!product) {
      return (
         <Container>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <BackButton />
               <Text type="defaultSemiBold">Product not found</Text>
            </View>
         </Container>
      )
   }
   return (
      <View style={{ flex: 1, paddingBottom: SIZES.lg }}>
         <StatusBar style="light" />
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               width: '100%',
               alignItems: 'center',
               position: 'absolute',
               paddingTop: SIZES.statusBarHeight,
               paddingHorizontal: SIZES.lg,
               backgroundColor: 'rgba(0,0,0,0.3)',
               zIndex: 10
            }}>
            <TouchableOpacity style={{ padding: SIZES.sm }} onPress={router.back}>
               <FontAwesome name="chevron-left" size={26} color={'#ffffff'} />
            </TouchableOpacity>
            <Text type="header" textColor="white">
               Product Details
            </Text>
            <Row containerStyle={{ gap: SIZES.lg, alignItems: 'center' }}>
               <TouchableOpacity
                  onPress={() =>
                     Alert.alert(
                        'Delete Product',
                        'Are you sure you want to delete this product?',
                        [
                           {
                              text: 'Cancel',
                              style: 'cancel'
                           },
                           {
                              text: 'Delete',
                              style: 'destructive',
                              onPress: async () => {
                                 await deleteProduct(product.id!, user?.id!)
                                 router.dismissAll()
                              }
                           }
                        ]
                     )
                  }>
                  <FontAwesome name="trash-o" size={26} color={'orange'} />
               </TouchableOpacity>

               <TouchableOpacity
                  onPress={() =>
                     router.push({
                        pathname: '/add-product',
                        params: { productId }
                     })
                  }>
                  <FontAwesome name="edit" size={24} color={'#ffffff'} />
               </TouchableOpacity>
            </Row>
         </View>
         <View style={{ flex: 0.5 }}>
            <Image
               source={product.image}
               style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
         </View>
         <View style={{ flex: 0.5, padding: SIZES.md, justifyContent: 'space-between' }}>
            <Row align="between">
               <Text type="title">{product.name}</Text>
               <View style={{ alignItems: 'center' }}>
                  {product.sizes && product.sizes.length > 0 && !selected && (
                     <Text type="defaultSemiBold">As low as</Text>
                  )}
                  <Text type="title">${selected ? selected.price : product.price}</Text>
               </View>
            </Row>
            <Text center type="title">
               Units Sold: {product.unitSold}
            </Text>

            <View
               style={{
                  flexDirection: 'row',
                  gap: SIZES.md,
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: SIZES.md
               }}>
               {product && product.sizes.length > 0 && (
                  <SizePicker
                     selected={selected}
                     sizes={product.sizes}
                     onPress={(option) => {
                        setSelected(option)
                     }}
                  />
               )}
               {product.addons.length > 0 && product.multipleAddons && (
                  <View
                     style={{
                        padding: SIZES.sm,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        gap: 4
                     }}>
                     <Text type="title">Multiple Choices</Text>
                     <Text type="subtitle">Select up to {product.multipleAddons} of these</Text>

                     <View style={{ alignSelf: 'center' }}>
                        <Row containerStyle={{ gap: 4 }}>
                           {product.addons.map((addon, index) => (
                              <Text key={addon} type="italic">
                                 {addon}
                                 {index !== product.addons.length - 1 ? ', ' : ''}
                              </Text>
                           ))}
                        </Row>
                     </View>
                  </View>
               )}
            </View>

            <View style={{ marginVertical: SIZES.lg }}>
               <Text type="defaultSemiBold">Description</Text>
               <Text type="italic">{product.description}</Text>
            </View>
         </View>
      </View>
   )
}

export default BusinessProduct
