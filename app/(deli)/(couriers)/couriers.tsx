import { updateBusiness, updateCourierFromWaitingList } from '@/actions/business'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Loading from '@/components/Loading'
import NeoView from '@/components/NeoView'
import PhoneCall from '@/components/PhoneCall'
import Row from '@/components/Row'

import { Text } from '@/components/ThemedText'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useCourierWaitingList } from '@/hooks/couriers/useCourierAwaitigList'
import { useRestaurant } from '@/hooks/restaurants/useRestaurant'
import { useNavigationSearch } from '@/hooks/useNavigationSearch'
import { useAuth } from '@/providers/authProvider'
import { Business, Courier } from '@/shared/types'
import { dayjsFormat } from '@/utils/dayjs'
import { router, Stack } from 'expo-router'
import { useMemo, useState } from 'react'
import { FlatList, ListRenderItem, ScrollView, TouchableOpacity } from 'react-native'

import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useCouriers } from '@/hooks/couriers/useCouriers'
const OPTIONS = ['Active', 'Waiting', 'De-activated']
const Couriers = () => {
   const { user } = useAuth()
   const ascentColor = useThemeColor('ascent')
   const textColor = useThemeColor('text')
   const { restaurant, loading } = useRestaurant(user?.id!)
   const { loading: loadingCouriers, couriers: data } = useCouriers()
   const [submitting, setSubmitting] = useState(false)
   const [option, setOption] = useState(0)
   const search = useNavigationSearch({
      searchBarOptions: {
         placeholder: 'Search couriers',
         headerIconColor: 'white',
         hintTextColor: 'white'
      }
   })

   const { list, loadingList } = useCourierWaitingList()
   const couriers = useMemo(() => {
      if (!search) return list
      return list.filter(
         (courier) =>
            courier.name.toLowerCase().includes(search.toLowerCase()) ||
            courier.status.toLowerCase().includes(search.toLowerCase())
      )
   }, [list, search])

   const couriersActive = useMemo(() => {
      if (!search) return data
      return data.filter(
         (courier) =>
            courier.name.toLowerCase().includes(search.toLowerCase()) ||
            courier.lastName.toLowerCase().includes(search.toLowerCase())
      )
   }, [data, search])

   const filteredCourier = useMemo(() => {
      return couriers.filter((courier) => {
         if (option === 1) return courier.status === 'pending'
         if (option === 2) return courier.status === 'inactive'
      })
   }, [option, couriers])

   const onHandleApprove = async (userId: string, courierId: string) => {
      const courier = couriers.find((c) => c.courierId === userId)
      if (courier?.status === 'completed') return
      try {
         if (!restaurant) return
         if (restaurant?.couriers.includes(courierId)) return
         const newCouriers = restaurant?.couriers ? [...restaurant.couriers, courierId] : []
         const updatedBusiness: Business = {
            ...restaurant,
            couriers: newCouriers,
            ordersMethod: 'both'
         }
         setSubmitting(true)
         const addedToBusiness = await updateBusiness(updatedBusiness)
         if (addedToBusiness) {
            console.log('Courier added to business successfully')
            await updateCourierFromWaitingList(userId, 'completed')
            console.log('Courier deleted from waiting list')
         }
      } catch (error) {
         console.log(error)
      } finally {
         setSubmitting(false)
      }
   }

   const renderActiveCouriers: ListRenderItem<Courier> = ({ item }) => {
      return (
         <TouchableOpacity
            onPress={() =>
               router.push({ pathname: '/[courierId]', params: { courierId: item.id! } })
            }
            style={{ flex: 1, borderRadius: SIZES.md }}>
            <NeoView
               containerStyle={{ borderRadius: SIZES.md }}
               innerStyleContainer={{
                  borderRadius: SIZES.md,
                  padding: SIZES.md
               }}>
               <Row align="between">
                  <View>
                     <Text type="defaultSemiBold">
                        {item.name} {item.lastName}
                     </Text>

                     <Row containerStyle={{ gap: SIZES.md, marginTop: 3 }}>
                        <Text>Phone: {item.phone}</Text>
                        <PhoneCall phone={item.phone!} />
                     </Row>
                     <Row
                        containerStyle={{
                           gap: SIZES.lg,
                           alignItems: 'center'
                        }}>
                        <Row>
                           <Text>Online: </Text>
                           <View>
                              {item.isOnline ? (
                                 <View
                                    style={{
                                       width: 18,
                                       height: 18,
                                       borderRadius: 9,
                                       backgroundColor: 'green'
                                    }}
                                 />
                              ) : (
                                 <View
                                    style={{
                                       width: 18,
                                       height: 18,
                                       borderRadius: 9,
                                       backgroundColor: 'red'
                                    }}
                                 />
                              )}
                           </View>
                        </Row>
                        <Row>
                           <Text>Is Busy: </Text>
                           {item.isOnline ? (
                              <View
                                 style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 9,
                                    backgroundColor: 'green'
                                 }}
                              />
                           ) : (
                              <View
                                 style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 9,
                                    backgroundColor: 'yellow'
                                 }}
                              />
                           )}
                        </Row>
                     </Row>
                  </View>
                  <Button
                     disabled={true}
                     loading={submitting}
                     contentTextStyle={{ paddingHorizontal: SIZES.lg }}
                     type="soft"
                     onPress={() => {}}
                     title={item.status === 'completed' ? 'Active' : 'Activate'}
                  />
               </Row>
            </NeoView>
         </TouchableOpacity>
      )
   }

   if (loadingList || loading || loadingCouriers) return <Loading />

   return (
      <Container>
         <Stack.Screen
            options={{
               headerTitle: () => (
                  <SegmentedControl
                     values={OPTIONS}
                     onChange={(event) => {
                        setOption(event.nativeEvent.selectedSegmentIndex)
                     }}
                     selectedIndex={option}
                     fontStyle={{
                        fontSize: 18,
                        color: textColor
                     }}
                     tintColor={ascentColor}
                     activeFontStyle={{
                        color: '#ffffff',
                        fontSize: 22
                     }}
                     style={{
                        height: 40,
                        width: '76%',
                        alignSelf: 'center',
                        alignItems: 'center'
                     }}
                  />
               )
            }}
         />
         <ScrollView contentInsetAdjustmentBehavior="automatic">
            {option === 0 ? (
               <FlatList
                  scrollEnabled={false}
                  data={couriersActive}
                  keyExtractor={(item) => item.id!}
                  ListEmptyComponent={
                     <View style={{ marginTop: SIZES.lg * 2 }}>
                        <Text type="defaultSemiBold" center>
                           No couriers found
                        </Text>
                     </View>
                  }
                  renderItem={renderActiveCouriers}
               />
            ) : (
               <FlatList
                  data={filteredCourier}
                  scrollEnabled={false}
                  contentContainerStyle={{ gap: SIZES.md, padding: SIZES.md }}
                  ListEmptyComponent={
                     <View style={{ marginTop: SIZES.lg * 2 }}>
                        <Text type="defaultSemiBold" center>
                           No couriers found
                        </Text>
                     </View>
                  }
                  renderItem={({ item }) => (
                     <View style={{ flex: 1, borderRadius: SIZES.md }}>
                        <NeoView
                           containerStyle={{ borderRadius: SIZES.md }}
                           innerStyleContainer={{
                              borderRadius: SIZES.md,
                              padding: SIZES.md
                           }}>
                           <Row align="between">
                              <View>
                                 <Text type="defaultSemiBold">{item.name}</Text>
                                 <Text>
                                    Status: {item.status === 'completed' ? 'Active' : item.status}
                                 </Text>
                                 <Text>
                                    Submitted On: {dayjsFormat(item.submittedOn).format('lll')}
                                 </Text>
                                 <Row containerStyle={{ gap: SIZES.md, marginTop: 3 }}>
                                    <Text>Phone: {item.phone}</Text>
                                    <PhoneCall phone={item.phone} />
                                 </Row>
                              </View>
                              <Button
                                 disabled={submitting}
                                 loading={submitting}
                                 contentTextStyle={{ paddingHorizontal: SIZES.lg }}
                                 type="soft"
                                 onPress={() => onHandleApprove(item.id!, item.courierId)}
                                 title={item.status === 'completed' ? 'Active' : 'Activate'}
                              />
                           </Row>
                        </NeoView>
                     </View>
                  )}
               />
            )}
         </ScrollView>
      </Container>
   )
}

export default Couriers
