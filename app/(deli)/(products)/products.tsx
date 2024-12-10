import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import NeumorphismView from '@/components/NeumorphismView'
import AllCategoriesView from '@/components/restaurants/AllCategoriesView'
import SizePicker from '@/components/restaurants/SizePicker'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { Colors, SIZES } from '@/constants/Colors'
import { categoriedData, CategorizedProduct } from '@/helpers/categorizedProducts'
import { useProducts } from '@/hooks/restaurants/useProducts'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { useCategoriesStore } from '@/stores/categoriesStore'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useMemo, useRef } from 'react'
import { FlatList, SectionList, StyleSheet, TouchableOpacity } from 'react-native'

const Products = () => {
   const { user } = useAuth()
   const backgroundColor = useThemeColor('background')
   const categories = useCategoriesStore((s) => s.categories)
   const sectionListRef = useRef<SectionList<any, any>>(null)
   const { products, loading } = useProducts(user?.id!)
   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: 'Search products',
         headerIconColor: 'white',
         hintTextColor: 'white'
      }
   })
   const data = useMemo(() => {
      if (!search) return products
      return products.filter(
         (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category?.name.toLowerCase().includes(search.toLowerCase())
      )
   }, [products, search])

   const scrollToSection = (index: number) => {
      if (sectionListRef.current) {
         sectionListRef.current.scrollToLocation({
            sectionIndex: index,
            itemIndex: 0,
            animated: true
         })
      }
   }

   const items = categoriedData(data)

   const renderSection = ({ section }: { section: CategorizedProduct }) => (
      <FlatList
         scrollEnabled={false}
         data={section.data}
         numColumns={2}
         columnWrapperStyle={{ justifyContent: 'space-between' }}
         contentInsetAdjustmentBehavior="automatic"
         renderItem={({ item }) => (
            <View style={{ width: '50%', padding: SIZES.sm }}>
               <NeumorphismView borderRadius={SIZES.lg}>
                  <TouchableOpacity
                     onPress={() =>
                        router.push({
                           pathname: '/(modals)/(business)/product',
                           params: { productId: item.id! }
                        })
                     }
                     style={{
                        height: SIZES.height * 0.1,
                        width: '100%',
                        flexDirection: 'row'
                     }}>
                     <Image
                        source={{ uri: item.image! }}
                        style={{
                           width: '30%',
                           height: '100%',
                           borderTopLeftRadius: SIZES.lg,
                           borderBottomLeftRadius: SIZES.lg
                        }}
                     />
                     <View style={{ padding: SIZES.sm }}>
                        <Row align="between" containerStyle={{ flexGrow: 1, gap: 20 }}>
                           <Text type="defaultSemiBold">{item.name}</Text>
                           {item.sizes.length > 0 && <Text>From ${item.price}</Text>}
                        </Row>
                        {item.sizes.length > 0 && (
                           <View style={{ marginBottom: 10 }}>
                              <SizePicker
                                 selected={item.sizes[0]}
                                 radius={36}
                                 showTitle={false}
                                 disabled
                                 sizes={item.sizes}
                                 onPress={(size) => {
                                    //setSelected(size)
                                 }}
                              />
                           </View>
                        )}
                        {item.addons.length > 0 && item.multipleAddons && (
                           <View style={{ padding: SIZES.sm }}>
                              <Text type="subtitle">Multiple Choices</Text>
                              <Text type="italic">Select up to {item.multipleAddons}</Text>
                              <Text type="title">${item.price}</Text>
                           </View>
                        )}
                     </View>
                  </TouchableOpacity>
               </NeumorphismView>
            </View>
         )}
      />
   )

   if (loading) return <Loading />

   if (products.length === 0 && categories.length === 0)
      return (
         <Container>
            <View center style={{ gap: 30 }}>
               <Text>No products found & no categories</Text>
               <Text>Try adding some products by adding a Category first</Text>
               <Button
                  title="Add Category"
                  contentTextStyle={{ paddingHorizontal: SIZES.lg * 2, color: Colors.light.white }}
                  onPress={() => router.push('/(modals)/(business)/categories')}
               />
            </View>
         </Container>
      )
   if (products.length === 0 && categories.length > 0)
      return (
         <Container>
            <View center style={{ gap: 30 }}>
               <Text>No products found</Text>
               <Text>Try adding some products</Text>
               <Button
                  title="Add First Product"
                  contentTextStyle={{ paddingHorizontal: SIZES.lg * 2, color: Colors.light.white }}
                  onPress={() => router.push('/(modals)/(business)/add-product')}
               />
            </View>
         </Container>
      )
   return (
      <Container>
         <View style={{ flex: 1, padding: SIZES.md }}>
            <View
               style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  alignSelf: data.length === 0 ? 'flex-end' : undefined
               }}>
               {data.length > 0 && (
                  <AllCategoriesView
                     products={data}
                     ids={[user?.id!]}
                     onCategoryPress={(category) => {
                        const index = items.findIndex((item) => item.title === category.name)
                        if (index !== -1) {
                           scrollToSection(index)
                        }
                     }}
                  />
               )}
            </View>

            <SectionList
               ref={sectionListRef}
               sections={items}
               //stickySectionHeadersEnabled
               keyExtractor={(item, index) => item.id! + index}
               renderSectionHeader={({ section }) => (
                  <View style={[styles.sectionHeader, { backgroundColor }]}>
                     <Text fontSize="large" type="defaultSemiBold" style={{ marginLeft: SIZES.md }}>
                        {section.title}
                     </Text>
                  </View>
               )}
               showsVerticalScrollIndicator={false}
               renderItem={() => null}
               //contentContainerStyle={{ margin: 10 }} // Since we use renderSection for items, we pass null here
               SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
               renderSectionFooter={renderSection}
            />
         </View>
      </Container>
   )
}

export default Products

const styles = StyleSheet.create({
   sectionHeader: {
      padding: 2
   },

   productItem: {
      flex: 1,
      margin: 5,
      alignItems: 'center'
   },
   columnWrapper: {
      justifyContent: 'space-between'
   },
   sectionSeparator: {
      height: 4
   }
})
