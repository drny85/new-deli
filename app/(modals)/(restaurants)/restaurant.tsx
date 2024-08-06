import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import ParallaxViewWithStickyHeader from '@/components/ParallaxViewWithStickyHeader'
import MostPopularProducts from '@/components/restaurants/MostPopularProducts'
import Products from '@/components/restaurants/Products'
import Row from '@/components/Row'
import ShareButton from '@/components/ShareLink'
import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { categoriedData } from '@/helpers/categorizedProducts'
import { useProducts } from '@/hooks/restaurants/useProducts'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useCartsStore } from '@/stores/cartsStore'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

type Params = {
   restaurantId: string
   categoryName: string
}

const RestaurantDetails = () => {
   const { restaurantId, categoryName } = useLocalSearchParams<Params>()

   //const { restaurant, loading } = useRestaurant(restaurantId!);
   const getRestaurant = useRestaurantsStore((s) => s.getRestaurant)
   const restaurant = getRestaurant(restaurantId!)
   const { products, loading: loadingProducts } = useProducts(restaurantId!)
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

   if (!restaurant || loadingProducts) return <Loading />
   return (
      <ParallaxViewWithStickyHeader
         backgroundImage={restaurant.image!}
         Header={<Header restaurantId={restaurantId!} cartQuantity={cartQuantity} />}
         HeaderWithTitle={
            <Header
               title={restaurant.name}
               restaurantId={restaurantId!}
               cartQuantity={cartQuantity}
            />
         }
         title={restaurant.name}
         subtitle={restaurant.address?.slice(0, -15)}>
         <View style={{ flex: 1, padding: SIZES.sm }}>
            {products.some((p) => p.unitSold > 0) && (
               <>
                  <Text type="header">Most Popular</Text>
                  <View style={{ height: SIZES.height * 0.12 }}>
                     <MostPopularProducts
                        products={popularProducts}
                        onPress={(product) => {
                           router.push({
                              pathname: '/product-details',
                              params: { productId: product.id, businessId: product.businessId }
                           })
                        }}
                     />
                  </View>
               </>
            )}
            <Text style={{ marginBottom: 4 }} type="header">
               Menu
            </Text>
            <Products items={data} categoryName={categoryName} />
         </View>
      </ParallaxViewWithStickyHeader>
   )
}

export default RestaurantDetails
const BAGDE_SIZE = 24
const Header = ({
   title,
   restaurantId,
   cartQuantity
}: {
   title?: string
   restaurantId: string
   cartQuantity: number
}) => {
   const textColor = useThemeColor('ascent')

   return (
      <Row
         align="between"
         containerStyle={{
            position: 'absolute',
            left: 0,
            right: 0,
            paddingHorizontal: SIZES.sm,
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
                  borderColor: '#ffffff'
               }}>
               <FontAwesome name="chevron-left" size={22} color={textColor} />
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
               <Text numberOfLines={1} ellipsizeMode="tail" type="header">
                  {title}
               </Text>
            </Animated.View>
         )}
         <Row containerStyle={{ gap: SIZES.sm, backgroundColor: 'transparent' }}>
            <NeoView
               rounded
               size={48}
               containerStyle={{
                  // backgroundColor: 'transparent',
                  borderWidth: 0.5,
                  borderColor: '#ffffff'
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
                        borderColor: '#ffffff'
                     }}>
                     <FontAwesome name="shopping-cart" size={22} color={textColor} />

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
