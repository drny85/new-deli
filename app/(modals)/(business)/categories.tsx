import Loading from '@/components/Loading'
import { View } from '@/components/ThemedView'
import CategoryTitle from '@/components/restaurants/CategoryTitle'
import { SIZES } from '@/constants/Colors'
import { useAllCategories } from '@/hooks/category/useAllCategories'
import { useAuth } from '@/providers/authProvider'
import React, { useMemo, useState } from 'react'
import { ScrollView } from 'react-native'

import { addCategory } from '@/actions/categories'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { concatenateAndReturnNotInArray1 } from '@/helpers/concatinateArrays'
import { onlyLetters } from '@/helpers/onlyLetters'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import SegmentedControl from '@react-native-segmented-control/segmented-control'
import { router } from 'expo-router'
import { toast } from 'sonner-native'

const BusinessCatyegories = () => {
   const { user } = useAuth()
   const ascentColor = useThemeColor('ascent')
   const { restaurants } = useRestaurantsStore()
   const { categories, loading } = useAllCategories([user?.id || ''])
   const { categories: cats, loading: lod } = useAllCategories([...restaurants.map((r) => r.id!)])
   const [category, setCategoty] = useState('')
   const data = useMemo(() => concatenateAndReturnNotInArray1(cats, categories), [categories, cats])

   const [index, setIndex] = useState(1)

   const onAddCategoryPress = async () => {
      try {
         if (!category) return
         if (categories.some((c) => c.name.toLowerCase() === category.toLowerCase())) {
            setIndex(1)
            return toast.error('Category already exists', {
               description: 'Select category from the list'
            })
         }
         if (!user) return
         const added = await addCategory({ name: category }, user?.id || '')
         if (added) {
            setCategoty('')
            setIndex(1)
            toast.success('Success', {
               description: 'Category added successfully'
            })

            router.back()
         }
      } catch (error) {
         console.log('Errro adding category', error)
      }
   }

   if (loading || lod) return <Loading />
   return (
      <View style={{ flex: 1, padding: SIZES.md }}>
         <View style={{ width: '100%', alignSelf: 'center' }}>
            <Input
               // title="Category's Name"
               placeholder="Coffee, Juices, etc"
               value={category}
               autoCapitalize="words"
               onChangeText={(text) => setCategoty(onlyLetters(text.trimEnd()))}
               contentContainerStyle={{ width: '80%' }}
            />

            <View
               style={{
                  position: 'absolute',
                  right: 50
               }}>
               <Button
                  disabled={category.length < 3}
                  type="soft"
                  title="Add New Category"
                  contentTextStyle={{ paddingHorizontal: SIZES.lg }}
                  containerStyle={{
                     // paddingHorizontal: SIZES.md,
                     borderBottomLeftRadius: 0,
                     borderTopLeftRadius: 0,
                     height: 48,
                     borderLeftWidth: 0,
                     shadowOpacity: 0,
                     shadowColor: 'transparent',
                     shadowOffset: {
                        width: -4,
                        height: -4
                     }
                  }}
                  onPress={onAddCategoryPress}
               />
            </View>
         </View>

         <View style={{ width: '50%', alignSelf: 'center', marginVertical: SIZES.md }}>
            <SegmentedControl
               values={['Current', 'Available']}
               selectedIndex={index}
               activeFontStyle={{
                  fontSize: 20,
                  fontFamily: 'Montserrat-Bold',
                  color: ascentColor
               }}
               fontStyle={{ fontSize: 18, fontFamily: 'Montserrat' }}
               onChange={(event) => {
                  setCategoty('')
                  setIndex(event.nativeEvent.selectedSegmentIndex)
               }}
            />
         </View>

         <ScrollView
            style={{ flex: 1 }}
            automaticallyAdjustKeyboardInsets
            contentInsetAdjustmentBehavior="automatic"
            keyboardDismissMode="on-drag"
            // horizontal
            contentContainerStyle={{
               marginVertical: SIZES.lg,
               flexWrap: 'wrap',
               flexDirection: 'row',
               gap: SIZES.sm
            }}
            showsHorizontalScrollIndicator={false}>
            {index === 0 &&
               categories
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((c) => (
                     <CategoryTitle
                        item={c}
                        key={c.id}
                        selected={''}
                        index={0}
                        setSelected={() => {}}
                        onCategoryPress={() => {}}
                        setIndex={() => {}}
                     />
                  ))}
            {index === 1 &&
               data.map((c) => (
                  <CategoryTitle
                     item={c}
                     key={c.id}
                     selected={c.name === category ? c.name : ''}
                     index={0}
                     setSelected={() => {
                        setCategoty(c.name)
                     }}
                     onCategoryPress={() => {}}
                     setIndex={() => {}}
                  />
               ))}
         </ScrollView>
      </View>
   )
}

export default BusinessCatyegories
