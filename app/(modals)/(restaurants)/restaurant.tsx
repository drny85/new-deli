import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import MostPopularProducts from '@/components/restaurants/MostPopularProducts'
import ProductsView from '@/components/restaurants/ProductsView'
import Row from '@/components/Row'
import ShareButton from '@/components/ShareLink'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { categoriedData, CategorizedProduct } from '@/helpers/categorizedProducts'
import { useProducts } from '@/hooks/restaurants/useProducts'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useCartsStore } from '@/stores/cartsStore'
import { FontAwesome } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'

import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useRef } from 'react'
import {
   Dimensions,
   NativeScrollEvent,
   NativeSyntheticEvent,
   StyleSheet,
   TouchableOpacity,
   useColorScheme
} from 'react-native'
import Animated, {
   FadeInDown,
   FadeInUp,
   interpolate,
   SharedValue,
   useAnimatedStyle,
   useSharedValue
} from 'react-native-reanimated'

const { height: screenHeight } = Dimensions.get('window')
const HEADER_HEIGHT = screenHeight * 0.25 // 30% of the screen height
const BAGDE_SIZE = 24
const HEADER = SIZES.statusBarHeight + BAGDE_SIZE * 2 + SIZES.sm

type Params = {
   restaurantId: string
   categoryName: string
}

const RestaurantDetails = () => {
   const scrollY = useSharedValue<number>(0)
   const backgroundColor = useThemeColor('background')
   const { restaurantId, categoryName } = useLocalSearchParams<Params>()
   const listRef = useRef<FlashList<CategorizedProduct>>(null)
   const { restaurant, loading } = useRestaurant(restaurantId)
   const { products, loading: loadingProducts } = useProducts(restaurantId)

   const data = categoriedData(products)
   const { getCart, carts } = useCartsStore()

   const popularProducts = useMemo(
      () =>
         products
            .filter((p) => p.unitSold > 0)
            .sort((a, b) => (a.unitSold < b.unitSold ? 1 : -1))
            .slice(0, 10),
      [products]
   )

   const cartQuantity = useMemo(() => {
      const cart = getCart(restaurantId!)
      return cart?.quantity || 0
   }, [restaurantId, carts])

   const scrollHandler = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = event.nativeEvent.contentOffset.y
   }

   // Animated styles for the header
   const animatedHeaderStyle = useAnimatedStyle(() => ({
      transform: [
         {
            translateY: interpolate(scrollY.value, [0, HEADER_HEIGHT], [0, -HEADER_HEIGHT], 'clamp')
         },
         {
            scale: interpolate(scrollY.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1])
         }
      ]
   }))

   const animatedImageStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
         scrollY.value,
         [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
         [1, 0.5, 0],
         'clamp'
      )
   }))

   const animatedHeaderOpacity = useAnimatedStyle(() => ({
      opacity: interpolate(scrollY.value, [0, HEADER], [1, 0], 'clamp')
   }))

   const index = data.findIndex((c) => c.title?.toLowerCase() === categoryName?.toLowerCase())

   useEffect(() => {
      console.log(categoryName, index)
      if (data.length === 0 || !categoryName || categoryName === 'All Categories') return
      let timer: NodeJS.Timeout

      if (index > 0) {
         // listRef.current?.scrollToIndex({ index, animated: true })

         setTimeout(() => {
            scrollToIndex(index)
         }, 800)
      }
      return () => {
         clearTimeout(timer)
      }
   }, [categoryName, data.length, index])

   const scrollToIndex = (index: number) => {
      if (listRef.current) {
         listRef.current.scrollToIndex({
            index,
            viewPosition: 0.5,
            animated: true
         })
      }
   }

   if (!restaurant || loadingProducts || loading) return <Loading />

   return (
      <View style={[styles.container, { backgroundColor }]}>
         {/* Header */}

         <Animated.View style={[styles.header, animatedHeaderStyle]}>
            <Animated.Image
               source={{
                  uri: restaurant.image || 'https://via.placeholder.com/800x600' // Replace with your image
               }}
               style={[styles.headerImage, animatedImageStyle]}
               resizeMode="cover"
            />
         </Animated.View>

         <Animated.View
            style={[
               {
                  height: HEADER,
                  backgroundColor: backgroundColor,
                  position: 'sticky',
                  top: 0
               },
               animatedHeaderOpacity
            ]}
         />

         <Header
            restaurantId={restaurantId!}
            cartQuantity={cartQuantity}
            scrollY={scrollY}
            title={restaurant.name}
         />

         <FlashList
            data={data || []}
            estimatedItemSize={205}
            scrollEventThrottle={16}
            key={index}
            ref={listRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
               paddingTop: SIZES.md,
               paddingHorizontal: SIZES.md,
               paddingBottom: SIZES.lg
            }}
            ListHeaderComponent={
               <View style={{ paddingTop: SIZES.statusBarHeight * 1.7 }}>
                  {products.some((p) => p.unitSold > 0) && (
                     <>
                        <Text type="header">Most Popular</Text>
                        <View style={{ height: SIZES.height * 0.1 }}>
                           <MostPopularProducts
                              products={popularProducts}
                              onPress={(product) => {
                                 router.push({
                                    pathname: '/product-details',
                                    params: {
                                       productId: product.id,
                                       businessId: product.businessId
                                    }
                                 })
                              }}
                           />
                        </View>
                     </>
                  )}
                  <Text
                     type="header"
                     style={{ fontSize: 26, marginTop: SIZES.lg, marginBottom: SIZES.sm }}>
                     Menu
                  </Text>
               </View>
            }
            renderItem={({ item }) => (
               <View style={{ gap: SIZES.sm }}>
                  <Text type="title">{item.title}</Text>
                  {index !== -1 && categoryName.toLowerCase() === item.title.toLowerCase() && (
                     <Text type="muted">based on your search..</Text>
                  )}
                  <ProductsView item={item} />
               </View>
            )}
            // onScroll={scrollHandler}
            onScroll={
               scrollHandler as unknown as (event: {
                  nativeEvent: {
                     contentOffset: {
                        y: number
                     }
                  }
               }) => void
            }
         />
      </View>
   )
}

export default RestaurantDetails

const Header = ({
   title,
   restaurantId,
   cartQuantity,
   scrollY
}: {
   title?: string
   restaurantId: string
   cartQuantity: number
   scrollY: SharedValue<number>
}) => {
   const textColor = useThemeColor('ascent')
   const isDark = useColorScheme() === 'dark'
   const HEADER_HEIGHT = screenHeight * 0.3
   const TITLE_FADE_SCROLL = HEADER_HEIGHT / 2
   const animatedTitleStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
         scrollY.value,
         [0, TITLE_FADE_SCROLL, HEADER_HEIGHT],
         [1, 0, 0],
         'clamp'
      ),
      transform: [
         {
            translateY: interpolate(
               scrollY.value,
               [0, TITLE_FADE_SCROLL],
               [0, -20], // Moves title slightly upward while fading
               'clamp'
            )
         }
      ]
   }))

   return (
      <Row
         align="between"
         containerStyle={{
            position: 'absolute',
            left: 0,
            right: 0,
            paddingHorizontal: SIZES.sm,
            zIndex: 20,
            paddingTop: SIZES.statusBarHeight,
            paddingBottom: SIZES.sm,
            backgroundColor: 'transparent'
         }}>
         <TouchableOpacity onPress={router.back}>
            <NeoView
               rounded
               size={48}
               containerStyle={{
                  //backgroundColor: 'transparent',
                  borderWidth: 0.5,
                  borderColor: '#ffffff',
                  shadowColor: 'transparent'
               }}>
               <FontAwesome name="chevron-left" size={22} color={isDark ? '#ffffff' : textColor} />
            </NeoView>
         </TouchableOpacity>
         {title && (
            <Animated.View
               entering={FadeInDown}
               exiting={FadeInUp}
               style={{
                  width: '50%',
                  flexGrow: 1,
                  alignItems: 'center',
                  justifyContent: 'center'
               }}>
               {/* <Text numberOfLines={1} adjustsFontSizeToFit ellipsizeMode="tail" type="header">
                  {title}
               </Text> */}
               <Animated.Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={[
                     { fontSize: 22, fontWeight: '600', fontFamily: 'Lobster' },
                     animatedTitleStyle
                  ]}>
                  {title}
               </Animated.Text>
            </Animated.View>
         )}
         <Row containerStyle={{ gap: SIZES.sm, backgroundColor: 'transparent' }}>
            <NeoView
               rounded
               size={48}
               containerStyle={{
                  // backgroundColor: 'transparent',
                  borderWidth: 0.5,
                  borderColor: '#ffffff',
                  shadowColor: 'transparent'
               }}>
               {/* <TouchableOpacity onPress={() => toggleFavorite(restaurantId, user!)}>
                  <FontAwesome name="share-alt-square" size={24} color={'#c1121f'} />
               </TouchableOpacity> */}
               <ShareButton id={restaurantId} type="restaurant" ascentColor />
            </NeoView>

            {cartQuantity > 0 && (
               <TouchableOpacity
                  disabled={cartQuantity === 0}
                  onPress={() => router.push(`/restaurant-cart/${restaurantId}`)}>
                  <NeoView
                     rounded
                     size={48}
                     containerStyle={{
                        //backgroundColor: 'transparent',
                        borderWidth: 0.5,
                        borderColor: '#ffffff',
                        shadowColor: 'transparent'
                     }}>
                     <FontAwesome
                        name="shopping-cart"
                        size={22}
                        color={isDark ? '#ffffff' : textColor}
                     />

                     {cartQuantity > 0 && (
                        <View
                           style={{
                              position: 'absolute',
                              right: -4,
                              top: -4,
                              width: BAGDE_SIZE,
                              height: BAGDE_SIZE,
                              borderRadius: BAGDE_SIZE / 2,
                              backgroundColor: textColor,
                              justifyContent: 'center',
                              alignItems: 'center',
                              zIndex: 2
                           }}>
                           <Text textColor="white" type="defaultSemiBold">
                              {cartQuantity}
                           </Text>
                        </View>
                     )}
                  </NeoView>
               </TouchableOpacity>
            )}
         </Row>
      </Row>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff'
   },
   header: {
      position: 'absolute',
      width: '100%',
      height: HEADER_HEIGHT,
      top: 0,
      zIndex: 1,
      overflow: 'hidden'
   },
   headerImage: {
      width: '100%',
      height: '100%'
   },
   listItem: {
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd'
   },
   listItemText: {
      fontSize: 16
   }
})
