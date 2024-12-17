import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import PhoneCall from '@/components/PhoneCall'
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
import { Feather, FontAwesome } from '@expo/vector-icons'
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
const BAGDE_SIZE = 30
const HEADER = SIZES.statusBarHeight * 2.1
const INFO_HEIGHT = screenHeight * 0.12

type Params = {
   restaurantId: string
   categoryName: string
}

const RestaurantDetails = () => {
   const scrollY = useSharedValue<number>(0)
   const backgroundColor = useThemeColor('background')
   const ascentColor = useThemeColor('ascent')
   const { restaurantId, categoryName } = useLocalSearchParams<Params>()
   const listRef = useRef<FlashList<CategorizedProduct>>(null)
   const { restaurant, loading } = useRestaurant(restaurantId)
   const { products, loading: loadingProducts } = useProducts(restaurantId)

   const data = categoriedData(products.filter((p) => p.available))
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
   const animatedBannerStyle = useAnimatedStyle(() => ({
      transform: [
         {
            translateY: interpolate(scrollY.value, [0, HEADER_HEIGHT], [0, -HEADER_HEIGHT], 'clamp')
         }
      ],
      height: interpolate(scrollY.value, [0, HEADER_HEIGHT], [INFO_HEIGHT, HEADER], 'clamp')
   }))

   const animatedImageStyle = useAnimatedStyle(() => ({
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT / 2], [1, 0], 'clamp')
   }))

   const opacity = useAnimatedStyle(() => ({
      opacity: interpolate(scrollY.value, [0, HEADER_HEIGHT / 2], [1, 0], 'clamp')
   }))

   const animatedHeaderTitle = useAnimatedStyle(() => ({
      top: interpolate(
         scrollY.value,
         [0, HEADER_HEIGHT / 2],
         [0, SIZES.statusBarHeight + SIZES.md],
         'clamp'
      ),
      transform: [
         {
            scale: interpolate(
               scrollY.value,
               [0, HEADER_HEIGHT, HEADER_HEIGHT + SIZES.statusBarHeight],
               [1, 0, 1],
               'clamp'
            )
         }
      ]
   }))

   const index = data.findIndex((c) => c.title?.toLowerCase() === categoryName?.toLowerCase())

   useEffect(() => {
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
               styles.header,
               {
                  top: HEADER_HEIGHT,
                  position: 'absolute',
                  height: INFO_HEIGHT,
                  backgroundColor,
                  width: '100%',
                  zIndex: 1
               },
               animatedBannerStyle
            ]}>
            <Animated.View>
               <Animated.Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  ellipsizeMode={'tail'}
                  style={[
                     {
                        fontFamily: 'Lobster',
                        position: 'sticky',
                        fontSize: 24,
                        top: 0,
                        textAlign: 'center'
                     },
                     animatedHeaderTitle
                  ]}>
                  {restaurant.name}
               </Animated.Text>
               <Animated.View style={[{ padding: SIZES.sm }, opacity]}>
                  <Row align="between">
                     <View>
                        <Text
                           numberOfLines={1}
                           adjustsFontSizeToFit
                           ellipsizeMode="tail"
                           type="defaultSemiBold"
                           fontSize="medium">
                           {restaurant.address?.slice(0, -5)}
                        </Text>
                        <Row containerStyle={{ gap: SIZES.lg, marginTop: 4 }}>
                           <Text type="subtitle">{restaurant.phone}</Text>
                           <PhoneCall phone={restaurant.phone || ''} size={26} />
                        </Row>
                     </View>
                     <TouchableOpacity
                        style={{ padding: SIZES.sm }}
                        onPress={() =>
                           router.push({ pathname: '/store-info', params: { id: restaurantId } })
                        }>
                        <Feather name="chevron-right" size={20} color={ascentColor} />
                     </TouchableOpacity>
                  </Row>
               </Animated.View>
            </Animated.View>
         </Animated.View>

         <Header
            restaurantId={restaurantId!}
            cartQuantity={cartQuantity}
            scrollY={scrollY}
            //title={restaurant.name}
         />

         <FlashList
            data={data || []}
            estimatedItemSize={205}
            scrollEventThrottle={16}
            key={index}
            ref={listRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
               paddingTop: HEADER + HEADER_HEIGHT + SIZES.md,
               paddingHorizontal: SIZES.sm,
               paddingBottom: SIZES.md
            }}
            ListHeaderComponent={
               <View>
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
