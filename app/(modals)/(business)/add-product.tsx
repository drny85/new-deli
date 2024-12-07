import { updateBusiness } from '@/actions/business'
import { addNewProduct, updateProduct } from '@/actions/products'
import BackButton from '@/components/BackButton'
import BottomSheetModal, { BottomSheetModalRef } from '@/components/BottomSheetModal'
import Button from '@/components/Button'
import AddonsSelector from '@/components/cart/MultipleAddonsSelection'
import Input from '@/components/Input'
import ItemQuantitySetter from '@/components/ItemQuantitySetter'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import CategoryTitle from '@/components/restaurants/CategoryTitle'
import ProductCard from '@/components/restaurants/ProductCart'
import Row from '@/components/Row'
import { Sheet, useSheetRef } from '@/components/Sheet'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { ADDONS, SIZES_ADDONS } from '@/constants'
import { SIZES } from '@/constants/Colors'
import { letterSizes } from '@/helpers/lettersSizes'
import { useAllCategories } from '@/hooks/category/useAllCategories'
import { useProduct } from '@/hooks/restaurants/useProduct'
import { usePhoto } from '@/hooks/usePhoto'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useAuth } from '@/providers/authProvider'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { Category, P_Size, Product } from '@/typing'
import { toastAlert, toastMessage } from '@/utils/toast'
import { EvilIcons, Feather, FontAwesome } from '@expo/vector-icons'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { set } from 'date-fns'
import { router, useLocalSearchParams } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
   Alert,
   Keyboard,
   Modal,
   ScrollView,
   StyleSheet,
   TextInput,
   TouchableOpacity
} from 'react-native'
import Animated, { SlideInDown, SlideInUp, SlideOutDown, SlideOutUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AddProduct = () => {
   const { user } = useAuth()
   const bottomSheetModalRef = useRef<BottomSheetModalRef>(null)
   const bottomSheetAddonsRef = useSheetRef()
   const priceInputRef = useRef<TextInput>(null)
   const restaurant = useRestaurantsStore((s) => s.restaurant)
   const { productId } = useLocalSearchParams<{ productId: string }>()
   const { photo, loading, selectedImage, handleImageUpload, uploadPhoto, resetAll } = usePhoto()
   const [variations, setVariations] = useState<P_Size[]>([])
   const { loading: loadingCategories, categories } = useAllCategories([user?.id!])
   const { product: selectedProduct } = useProduct(user?.id!, productId!)
   const [showCategoryModal, setShowCategoryModal] = useState(false)
   const [category, setCategory] = useState<Category | null>(null)
   const [sizeMode, setSizeMode] = useState<'sizes' | 'addons' | 'none' | 'multiple'>('none')
   const [selectedIndex, setSelectedIndex] = useState(0)
   const [qty, setQty] = useState(0)
   const ascentColor = useThemeColor('ascent')
   const textColor = useThemeColor('text')
   const backgroundColor = useThemeColor('background')
   const [readyToUpload, setReadyToUpload] = useState(false)
   const { bottom } = useSafeAreaInsets()
   const products = useRestaurantsStore((s) => s.products)
   const [selectedAddons, setSelectedAddons] = useState<string[]>([])
   const [newAddon, setNewAddon] = useState('')
   const [addingNewAddon, setAddingNewAddon] = useState(false)

   const toggleAddonSelection = (addonName: string, maxSelectable: number) => {
      const isSelected = selectedAddons.includes(addonName)
      if (isSelected) {
         setSelectedAddons((prevState) => prevState.filter((name) => name !== addonName))
      } else {
         if (selectedAddons.length < maxSelectable) {
            setSelectedAddons((prevState) => [...prevState, addonName])
         } else {
            alert(`You can select up to ${maxSelectable} add-ons.`)
         }
      }
   }

   const handleOpenBottomSheet = () => {
      bottomSheetModalRef.current?.open()
   }
   const handlePresentModalPress = useCallback(() => {
      bottomSheetAddonsRef.current?.present()
   }, [])

   const handleCloseBottomSheet = () => {
      bottomSheetModalRef.current?.close()
   }
   const [product, setProduct] = useState<Product>({
      name: '',
      image: selectedImage || '',
      price: '',
      category: category ? category : null,
      description: '',
      businessId: user?.id!,
      unitSold: 0,
      sizes: variations.length > 0 ? variations.map((v) => ({ ...v, price: +v.price })) : [],
      available: true,
      addons: [],
      multipleAddons: null
   })

   const handleAddProduct = async () => {
      const isValid = validateInputs()
      if (!isValid) return

      if (productId) {
         setReadyToUpload(true)

         return
      }

      if (!photo) {
         toastAlert({
            message: 'Please upload a product image',
            preset: 'error',
            title: 'Error'
         })
         handleImageUpload()
         return
      }
      if (product.name) {
         const found =
            products.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase()) !== -1
         if (found) {
            toastAlert({
               message: `Product ${product.name} already exists`,
               preset: 'error',
               title: 'Error'
            })
            return
         }
      }
      try {
         const res = await uploadPhoto(
            photo,
            `${product.category?.name.toLowerCase()}/${product.name.replace(/\s+/g, '').toLowerCase()}`
         )

         setReadyToUpload(res)
      } catch (error) {
         console.log('Error adding produnct', error)
      }
      try {
      } catch (error) {
         console.log('Error adding produnct', error)
      }
   }

   const addNewProductWithImage = useCallback(async () => {
      if (!selectedImage) return
      try {
         const newProduct: Product = {
            ...product,
            price: +product.price,
            image: selectedImage!,
            sizes: variations.length > 0 ? variations.map((v) => ({ ...v, price: +v.price })) : []
         }

         await addNewProduct(newProduct)
         if (restaurant && !restaurant?.hasItems) {
            console.log('Now has items')
            await updateBusiness({
               ...restaurant!,
               hasItems: true,
               addons: [...ADDONS],
               profileCompleted: true
            })
         }

         resetAfterSubmit()
         router.back()
      } catch (error) {
         console.log('Error with new product', error)
      }
   }, [product, selectedImage, variations])

   const handleUpdateProduct = useCallback(async () => {
      const editedProdcut: Product = {
         ...product,
         price: +product.price,
         image: selectedImage && photo ? selectedImage : product.image,
         sizes: variations.length > 0 ? variations.map((v) => ({ ...v, price: +v.price })) : []
      }

      await updateProduct(editedProdcut)

      resetAfterSubmit()
      router.back()
   }, [product, selectedImage, variations, photo])

   const resetAfterSubmit = () => {
      resetAll()
      setProduct({
         name: '',
         image: '',
         price: '',
         category: null,
         description: '',
         businessId: user?.id!,
         unitSold: 0,
         sizes: [],
         available: true,
         addons: selectedAddons || [],
         multipleAddons: null
      })
      setVariations([])
      setReadyToUpload(false)
      toastMessage({
         message: 'Product added successfully',
         preset: 'done',
         title: 'Success'
      })
   }

   const validateInputs = (): boolean => {
      if (!product.name || !product.price) {
         toastAlert({
            message: 'Name and price are required',
            preset: 'error',
            title: 'Error'
         })
         return false
      }
      if (!product.category) {
         setShowCategoryModal(true)
         return false
      }
      if (sizeMode === 'sizes' || sizeMode === 'addons') {
         if (variations.length === 0) {
            toastAlert({
               message: 'Please add at least one size',
               preset: 'error',
               title: 'Error'
            })
            return false
         }
         if (variations.some((v) => v.price === '')) {
            toastAlert({
               message: 'Please fill in all size prices',
               preset: 'error',
               title: 'Error'
            })
            return false
         }
      }
      if (sizeMode === 'multiple') {
         if (qty === 0) {
            toastAlert({
               message: 'Please select a quantity',
               preset: 'error',
               title: 'Error'
            })
            return false
         }
      }

      if (product.description === '') {
         toastAlert({
            message: 'Please add a description',
            preset: 'error',
            title: 'Error'
         })
         return false
      } else if (product.description && product.description.length < 10) {
         toastAlert({
            message: 'Description must be at least 10 characters long',
            preset: 'error',
            title: 'Error'
         })
         return false
      }

      return true
   }

   useEffect(() => {
      if (selectedIndex === 0) {
         setSizeMode('none')
      } else if (selectedIndex === 1) {
         setSizeMode('sizes')
      } else if (selectedIndex === 2) {
         setSizeMode('addons')
      }
   }, [selectedIndex])

   useEffect(() => {
      if (readyToUpload && selectedImage && !productId) {
         addNewProductWithImage()
      } else if (readyToUpload && productId) {
         handleUpdateProduct()
      }
   }, [selectedImage, readyToUpload, productId])

   useEffect(() => {
      if (productId && photo) {
         uploadPhoto(
            photo,
            `${product.category?.name.toLowerCase()}/${product.name.replace(/\s+/g, '').toLowerCase()}`
         )
      }
   }, [productId, photo])

   useEffect(() => {
      if (productId && selectedProduct) {
         const product = selectedProduct
         if (product) {
            setProduct({ ...product, price: product.price.toString() })
            setVariations(product.sizes)
            setCategory(product.category!)
            if (product.multipleAddons) {
               setQty(product.multipleAddons)
               setSizeMode('multiple')
               setSelectedIndex(3)
               setSelectedAddons(product.addons)
            }
            if (product.sizes && product.sizes.length > 0) {
               const isSizes = letterSizes(product.sizes)
               if (isSizes) {
                  setSizeMode('sizes')
                  setSelectedIndex(1)
               } else {
                  setSizeMode('addons')
                  setSelectedIndex(2)
               }
            } else {
               setSizeMode('none')
               setSelectedIndex(0)
            }
         }
      }
   }, [productId, selectedProduct])

   useEffect(() => {
      if (!category) return
      if (
         category.name.toLowerCase() === 'platter' ||
         category.name.toLowerCase().includes('bandeja')
      ) {
         setSelectedIndex(3)
         setSizeMode('multiple')
      }
   }, [category])

   // useEffect(() => {
   //    if (categories.length === 0 || !loadingCategories) {
   //       router.canGoBack() && router.replace('/(modals)/(business)/categories')
   //    }
   // }, [categories])
   if (loadingCategories) return <Loading />

   return (
      <View style={{ flex: 1 }}>
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'space-between',
               width: '100%',
               alignItems: 'center',
               backgroundColor: 'rgba(0,0,0,0.3)',
               position: 'absolute',
               paddingTop: SIZES.statusBarHeight,
               paddingHorizontal: SIZES.lg,
               zIndex: 10
            }}>
            <TouchableOpacity style={{ padding: SIZES.sm }} onPress={router.back}>
               <FontAwesome name="chevron-left" size={24} color={'#ffffff'} />
            </TouchableOpacity>
            <Text textColor="white" type="title">
               {product.name}
            </Text>
            <Text />
         </View>
         <View style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
               <ScrollView
                  keyboardDismissMode="on-drag"
                  contentContainerStyle={{ padding: 0, marginBottom: bottom + 50 }}
                  showsVerticalScrollIndicator={false}>
                  <View style={styles.imageContainer}>
                     <ProductCard
                        containerStyle={{
                           width: '100%',
                           borderRadius: SIZES.lg,
                           height: '100%'
                        }}
                        product={{
                           ...product,
                           image:
                              photo && photo?.assets![0].uri ? photo?.assets![0].uri : product.image
                        }}
                        onPress={() => {
                           handleImageUpload()
                        }}
                     />
                     {!photo && !productId && (
                        <View
                           style={{
                              position: 'absolute',
                              zIndex: 20,
                              alignSelf: 'center',
                              top: (SIZES.height * 0.3) / 2 - 20
                           }}>
                           <Button
                              contentTextStyle={{ paddingHorizontal: SIZES.md }}
                              type="soft"
                              title="Upload Photo"
                              onPress={() => {
                                 handleImageUpload()
                              }}
                           />
                        </View>
                     )}
                  </View>
                  <View style={{ flex: 1, padding: SIZES.md }}>
                     {(photo?.assets![0].uri || productId) && (
                        <View style={{ gap: SIZES.lg }}>
                           <Input
                              title="Name"
                              placeholder="Product Name"
                              autoCapitalize="words"
                              value={product.name}
                              onChangeText={(text) =>
                                 setProduct((prev) => ({ ...prev, name: text }))
                              }
                           />
                           <Input
                              title="Price"
                              LeftIcon={
                                 <FontAwesome
                                    name="dollar"
                                    size={18}
                                    color={'lightgrey'}
                                    style={{ marginRight: SIZES.sm }}
                                 />
                              }
                              ref={priceInputRef}
                              placeholder="Product Price"
                              keyboardType="numeric"
                              value={product.price as string}
                              onChangeText={(text) =>
                                 setProduct((prev) => ({ ...prev, price: +text }))
                              }
                           />
                           {product.price !== '' && product.name !== '' && (
                              <TouchableOpacity onPress={() => setShowCategoryModal(true)}>
                                 <Text
                                    type="defaultSemiBold"
                                    style={{ marginLeft: SIZES.sm, marginBottom: SIZES.sm }}>
                                    Category
                                 </Text>
                                 <NeoView
                                    containerStyle={{ borderRadius: SIZES.lg }}
                                    innerStyleContainer={{
                                       borderRadius: SIZES.lg,
                                       padding: SIZES.sm
                                    }}>
                                    <Text
                                       style={{ marginLeft: SIZES.sm * 0.5 }}
                                       type="defaultSemiBold">
                                       {category ? category.name : 'Pick a Category'}
                                    </Text>
                                 </NeoView>
                              </TouchableOpacity>
                           )}

                           {product.category && (
                              <View>
                                 <View style={{ width: '60%', alignSelf: 'center', gap: SIZES.md }}>
                                    <Text center type="defaultSemiBold">
                                       This Product Comes In
                                    </Text>
                                    <SegmentedControl
                                       values={['NONE', 'SIZES', 'ADD-ONS', 'MULTIPLE']}
                                       selectedIndex={selectedIndex}
                                       onChange={(e) => {
                                          const index = e.nativeEvent.selectedSegmentIndex
                                          setSelectedIndex(index)
                                          if (index === 0) setSizeMode('none')
                                          else if (index === 1) setSizeMode('sizes')
                                          else if (index === 2) setSizeMode('addons')
                                          else if (index === 3) {
                                             setSizeMode('multiple')
                                          }
                                          if (index !== 3) {
                                             setQty(0)
                                             setProduct((p) => ({
                                                ...p,
                                                multipleAddons: null,
                                                addons: []
                                             }))
                                          } else {
                                             if (
                                                selectedProduct &&
                                                selectedProduct.multipleAddons &&
                                                selectedProduct.multipleAddons > 0
                                             ) {
                                                setQty(selectedProduct.multipleAddons)
                                             }
                                          }
                                          setVariations([])
                                       }}
                                       activeFontStyle={{ color: 'white', fontWeight: '800' }}
                                       tintColor={ascentColor}
                                       style={{ height: 46 }}
                                    />
                                 </View>
                                 {sizeMode === 'sizes' && (
                                    <View style={{ marginTop: SIZES.md }}>
                                       <Row
                                          containerStyle={{
                                             alignSelf: 'center',
                                             gap: SIZES.lg
                                          }}>
                                          {SIZES_ADDONS.map((size, index) => (
                                             <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                   setVariations((prev) => {
                                                      if (prev.includes(size)) {
                                                         return [
                                                            ...new Set(
                                                               prev.filter((s) => s !== size)
                                                            )
                                                         ]
                                                      }
                                                      return [...new Set([...prev, size])]
                                                   })
                                                }}>
                                                <NeoView
                                                   rounded
                                                   size={60}
                                                   innerStyleContainer={{
                                                      borderWidth: variations.includes(size)
                                                         ? 1.5
                                                         : 0,
                                                      borderColor: variations.includes(size)
                                                         ? ascentColor
                                                         : undefined
                                                   }}>
                                                   <Text
                                                      style={{
                                                         textTransform: 'uppercase',
                                                         color: variations.includes(size)
                                                            ? ascentColor
                                                            : textColor
                                                      }}
                                                      type="defaultSemiBold">
                                                      {size.id}
                                                   </Text>
                                                </NeoView>
                                             </TouchableOpacity>
                                          ))}
                                       </Row>
                                    </View>
                                 )}
                                 {sizeMode === 'addons' && (
                                    <View style={{ alignSelf: 'center', gap: SIZES.sm }}>
                                       <Text>How Many Addons</Text>
                                       <ItemQuantitySetter
                                          onPressAdd={() =>
                                             setVariations((prev) => [
                                                ...prev,
                                                { id: variations.length, size: '', price: '' }
                                             ])
                                          }
                                          onPressSub={() =>
                                             setVariations((prev) => [
                                                ...prev.slice(0, prev.length - 1)
                                             ])
                                          }
                                          quantity={variations.length}
                                       />
                                    </View>
                                 )}
                                 {sizeMode === 'multiple' && (
                                    <View
                                       style={{
                                          alignSelf: 'center',
                                          gap: SIZES.sm,
                                          justifyContent: 'center',
                                          alignItems: 'center'
                                       }}>
                                       <View
                                          style={{
                                             alignSelf: 'center',
                                             gap: SIZES.sm,
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             flexDirection: 'row',
                                             flexWrap: 'wrap',
                                             marginTop: SIZES.md
                                          }}>
                                          {product.addons
                                             .sort((a, b) => a.localeCompare(b))
                                             .map((addon) => (
                                                <Text type="muted" capitalize key={addon}>
                                                   {addon}
                                                </Text>
                                             ))}
                                       </View>

                                       <TouchableOpacity
                                          onPress={handlePresentModalPress}
                                          style={{
                                             boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',

                                             paddingVertical: SIZES.sm,
                                             paddingHorizontal: SIZES.lg,
                                             borderRadius: SIZES.md,
                                             marginTop: SIZES.sm * 0.5
                                          }}>
                                          <Row containerStyle={{ gap: 10 }}>
                                             <Feather name="edit-2" size={22} color={'orange'} />
                                             <Text>Edit</Text>
                                          </Row>
                                       </TouchableOpacity>
                                    </View>
                                 )}
                                 <View
                                    style={{
                                       gap: SIZES.md,
                                       marginVertical: SIZES.md,

                                       flexDirection: sizeMode === 'sizes' ? 'row' : 'column',
                                       justifyContent: 'space-evenly',
                                       alignItems: 'center'
                                    }}>
                                    {variations.map((variant, index) => (
                                       <Row
                                          key={index}
                                          containerStyle={{
                                             gap: SIZES.sm,
                                             flex: 1,
                                             width: '100%'
                                          }}>
                                          {sizeMode === 'sizes' ? (
                                             <NeoView rounded size={50}>
                                                <Text
                                                   style={{ textTransform: 'uppercase' }}
                                                   type="defaultSemiBold">
                                                   {variant.id}
                                                </Text>
                                             </NeoView>
                                          ) : (
                                             <Input
                                                title="Add-on Name"
                                                placeholder="Ex Cheese"
                                                contentContainerStyle={{
                                                   flex: 1,
                                                   maxWidth: SIZES.width * 0.35
                                                }}
                                                value={variant.size}
                                                containerStyle={{
                                                   borderRadius: SIZES.sm
                                                }}
                                                onChangeText={
                                                   (text) => {
                                                      setVariations((prev) => {
                                                         const newVariations = [...prev]
                                                         newVariations[index].size = text
                                                         return newVariations
                                                      })
                                                   }
                                                   //setProduct((prev) => ({ ...prev, description: text }))
                                                }
                                             />
                                          )}
                                          <Input
                                             title={
                                                sizeMode === 'addons' ? 'Add-on Price' : undefined
                                             }
                                             contentContainerStyle={{
                                                flex: 1,
                                                maxWidth: SIZES.width * 0.5
                                             }}
                                             placeholder={`Price for ${variant.size}`}
                                             containerStyle={{
                                                borderRadius: SIZES.sm,
                                                flexGrow: 1
                                             }}
                                             LeftIcon={
                                                <FontAwesome
                                                   name="dollar"
                                                   size={18}
                                                   color={'lightgrey'}
                                                   style={{ marginRight: SIZES.sm }}
                                                />
                                             }
                                             keyboardType="numeric"
                                             value={`${variant.price}`}
                                             onChangeText={(text) => {
                                                setVariations((prev) => {
                                                   const newVariations = [...prev]
                                                   newVariations[index].price! = text
                                                   if (index === 0 && text) {
                                                      setProduct((prev) => ({
                                                         ...prev,
                                                         price: text
                                                      }))
                                                   }
                                                   return newVariations
                                                })
                                             }}
                                          />
                                       </Row>
                                    ))}
                                 </View>
                              </View>
                           )}
                           {product.category && (
                              <View style={{ marginTop: SIZES.md }}>
                                 <TouchableOpacity
                                    onPress={handleOpenBottomSheet}
                                    style={{
                                       borderRadius: SIZES.sm,
                                       minHeight: 100,
                                       backgroundColor,
                                       borderColor: 'lightgrey',
                                       borderWidth: StyleSheet.hairlineWidth,
                                       padding: SIZES.sm
                                    }}>
                                    <Text style={{ fontStyle: 'italic' }}>
                                       {product.description || 'Product description'}
                                    </Text>
                                 </TouchableOpacity>
                                 {/* <Input
                                    title="Description"
                                    placeholder="Product Description"
                                    value={product.description!}
                                    multiline
                                    containerStyle={{ borderRadius: SIZES.sm, minHeight: 100 }}
                                    onChangeText={(text) =>
                                       setProduct((prev) => ({ ...prev, description: text }))
                                    }
                                 /> */}
                              </View>
                           )}
                        </View>
                     )}
                  </View>
               </ScrollView>
            </View>
            {product.description && (
               <View style={{ width: '60%', alignSelf: 'center', paddingBottom: bottom }}>
                  <Button
                     disabled={loading}
                     title={productId ? 'Update Product' : 'Add Product'}
                     onPress={handleAddProduct}
                     contentTextStyle={{ color: '#ffffff' }}
                  />
               </View>
            )}
         </View>
         <Modal
            visible={showCategoryModal}
            style={{ backgroundColor }}
            presentationStyle="fullScreen"
            animationType="slide">
            <View
               style={{
                  padding: SIZES.md,
                  flex: 1,
                  marginTop: SIZES.statusBarHeight,
                  backgroundColor
               }}>
               <BackButton />
               <Text center type="title" style={{ marginTop: SIZES.md }}>
                  Pick One
               </Text>

               <ScrollView contentContainerStyle={{ padding: 20, gap: SIZES.lg }}>
                  {categories
                     .sort((a, b) => (a.name > b.name ? 1 : -1))
                     .map((cat, index) => (
                        //  <CategoryTile
                        //      key={index}
                        //      category={category}
                        //      onPress={(c) => {
                        //          setProduct({ ...product, category: c });
                        //          setShowCategoryModal(false);
                        //      }}
                        //  />
                        <CategoryTitle
                           key={cat.id}
                           index={index}
                           setIndex={() => {}}
                           setSelected={(c) => {}}
                           item={cat}
                           selected={category?.name || ''}
                           onCategoryPress={(c) => {
                              setCategory(c)
                              setProduct({ ...product, category: c })
                              setShowCategoryModal(false)
                           }}
                        />
                     ))}
               </ScrollView>
            </View>
         </Modal>
         <BottomSheetModal
            ref={bottomSheetModalRef}
            value={product.description!}
            onSubmit={() => {
               console.log('submit')
               Keyboard.dismiss()
            }}
            setValue={(text) => setProduct((prev) => ({ ...prev, description: text }))}
            onClose={handleCloseBottomSheet}
         />

         <Sheet snapPoints={['90%', '100%']} ref={bottomSheetAddonsRef}>
            <Row containerStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}>
               <TouchableOpacity
                  onPress={() => {
                     if (!productId && !selectedProduct) {
                        setSelectedIndex(0)
                        setSizeMode('none')
                     } else {
                        console.log('HERE')
                        if (
                           productId &&
                           selectedProduct &&
                           selectedProduct.multipleAddons &&
                           selectedProduct.multipleAddons > 0
                        ) {
                           setQty(selectedProduct.multipleAddons)
                           setSelectedAddons([])
                        }
                     }
                     bottomSheetAddonsRef.current?.close()
                  }}>
                  <Feather name="chevron-left" size={32} color={'#212121'} />
               </TouchableOpacity>
               <Row>
                  {selectedAddons > product.addons && (
                     <View style={{ marginRight: SIZES.md }}>
                        <TouchableOpacity
                           onPress={() => setSelectedAddons(product.addons)}
                           style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                           <EvilIcons name="undo" size={26} color="orange" />
                           <Text type="defaultSemiBold" center>
                              Undo
                           </Text>
                        </TouchableOpacity>
                     </View>
                  )}

                  <TouchableOpacity
                     onPress={async () => {
                        if (qty > selectedAddons.length) {
                           Alert.alert(
                              'Error',
                              `Addons that can be selected must be equal or less than ${selectedAddons.length}`,
                              [{ text: 'OK' }],
                              { cancelable: false }
                           )
                           return
                        }
                        await updateProduct({
                           ...product,
                           multipleAddons: qty || null,
                           addons: selectedAddons || []
                        })
                        bottomSheetAddonsRef.current?.close()
                        toastMessage({
                           title: 'Success',
                           message: 'Addons updated successfully',
                           preset: 'custom',
                           iconName: 'check',
                           duration: 2
                        })
                     }}
                     style={{
                        boxShadow: '1px 3px 2px 1px rbga(0,0,0,0.1)',
                        paddingHorizontal: SIZES.lg,
                        paddingVertical: SIZES.sm,
                        backgroundColor: 'white',
                        borderRadius: SIZES.md
                     }}>
                     <Text type="defaultSemiBold">Update Addons</Text>
                  </TouchableOpacity>
               </Row>
            </Row>
            <View
               style={{
                  flex: 1,
                  width: '80%',
                  alignSelf: 'center',
                  justifyContent: 'space-evenly',
                  gap: SIZES.sm
               }}>
               <View style={{ flex: 1 }}>
                  <View
                     style={{
                        alignSelf: 'center',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 16
                     }}>
                     <Text center type="title">
                        Addons for this Product
                     </Text>
                     <TouchableOpacity onPress={() => setAddingNewAddon(true)}>
                        <Feather name="plus-circle" size={28} color={ascentColor} />
                     </TouchableOpacity>
                  </View>
                  {addingNewAddon && (
                     <Animated.View
                        entering={SlideInUp}
                        exiting={SlideOutUp}
                        style={{
                           marginTop: SIZES.md,
                           maxWidth: 400,
                           alignSelf: 'center',
                           width: '100%',
                           flexDirection: 'row',
                           alignItems: 'center',
                           gap: SIZES.sm
                        }}>
                        <Input
                           value={newAddon}
                           contentContainerStyle={{ width: '90%' }}
                           autoCapitalize="words"
                           autoFocus
                           onChangeText={setNewAddon}
                           onEndEditing={() => {
                              if (!newAddon) return
                              const isAlreadyThere =
                                 selectedAddons.find(
                                    (a) => a.toLowerCase() === newAddon.toLowerCase()
                                 ) ||
                                 product.addons.find(
                                    (a) => a.toLowerCase() === newAddon.toLowerCase()
                                 )
                              if (isAlreadyThere) {
                                 toastMessage({
                                    title: 'Error',
                                    message: 'Addon already exists',
                                    preset: 'custom',
                                    iconName: 'x',
                                    duration: 2
                                 })
                                 return
                              }
                              if (newAddon) {
                                 const newAddons = [...selectedAddons, newAddon]
                                 if (restaurant) {
                                    updateBusiness({
                                       ...restaurant,
                                       addons: [...(restaurant.addons || []), newAddon]
                                    })
                                 }
                                 setSelectedAddons(newAddons)
                                 setNewAddon('')
                                 setAddingNewAddon(false)
                              }
                           }}
                           placeholder="Type new addon"
                        />
                        <TouchableOpacity
                           onPress={() => {
                              setAddingNewAddon(false)
                              setNewAddon('')
                           }}>
                           <Feather name="x-circle" size={26} color={ascentColor} />
                        </TouchableOpacity>
                     </Animated.View>
                  )}

                  <AddonsSelector
                     addons={restaurant?.addons || []}
                     maxSelectable={20}
                     showTitle={false}
                     selectedAddons={selectedAddons}
                     containerStyle={{
                        width: '100%',
                        flexDirection: 'row',
                        flexWrap: 'wrap'
                     }}
                     toggleAddonSelection={(name) => {
                        toggleAddonSelection(name, 20)
                     }}
                  />
               </View>

               <AnimatePresence>
                  {selectedAddons.length > 0 && (
                     <MotiView
                        style={{ flex: 1 }}
                        from={{ opacity: 0, translateY: -15 }}
                        animate={{ opacity: 1, translateY: 0 }}>
                        <View
                           style={{
                              alignSelf: 'center',
                              gap: SIZES.sm,
                              flex: 1,
                              alignItems: 'center'
                           }}>
                           <Text type="title">How many addons can be selected?</Text>

                           <ItemQuantitySetter
                              onPressAdd={() => {
                                 if (selectedAddons.length <= product.multipleAddons!) {
                                    return
                                 }
                                 setQty((prev) => {
                                    setProduct((p) => ({
                                       ...p,
                                       multipleAddons: prev + 1
                                    }))
                                    return prev + 1
                                 })
                              }}
                              onPressSub={() => {
                                 if (qty >= 2)
                                    setQty((prev) => {
                                       setProduct((p) => ({
                                          ...p,
                                          multipleAddons: prev - 1
                                       }))
                                       return prev - 1
                                    })
                              }}
                              quantity={qty}
                           />
                        </View>
                     </MotiView>
                  )}
               </AnimatePresence>
            </View>
         </Sheet>
      </View>
   )
}

export default AddProduct

const styles = StyleSheet.create({
   imageContainer: {
      width: '100%',
      height: SIZES.height * 0.3,
      overflow: 'hidden',
      resizeMode: 'cover'
   },
   image: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
      objectFit: 'cover'
   }
})
