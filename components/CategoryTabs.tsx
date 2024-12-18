import { categoriesArray } from '@/helpers/categoriesArray'
import { Product } from '@/shared/types'
import React from 'react'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from './ThemedText'
import { View } from './ThemedView'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// Dummy data for categories and sections

type Props = {
   products: Product[]
   currentIndex: number
   onCategoryPress: (category: number) => void
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   categoryTabsRef: any
}

const CategoryTabs = ({ products, currentIndex, onCategoryPress, categoryTabsRef }: Props) => {
   const data = categoriesArray(products)
   return (
      <View style={styles.categoryTabsContainer}>
         <FlatList
            ref={categoryTabsRef}
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id!}
            renderItem={({ item, index }) => {
               console.log('IDEXES', index, currentIndex)
               return (
                  <TouchableOpacity
                     style={[styles.tab, currentIndex === index && styles.activeTab]}
                     onPress={() => onCategoryPress(index)}>
                     <Text style={currentIndex === index ? styles.activeTabText : styles.tabText}>
                        {item.name}
                     </Text>
                  </TouchableOpacity>
               )
            }}
         />
      </View>
   )
}

export default CategoryTabs

const styles = StyleSheet.create({
   categoryTabsContainer: {
      height: 46,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      backgroundColor: '#f8f8f8'
   },
   tab: {
      paddingHorizontal: 20,
      paddingVertical: 6,
      justifyContent: 'center',
      alignItems: 'center'
   },
   activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#007aff'
   },
   tabText: {
      fontSize: 16,
      color: '#666'
   },
   activeTabText: {
      fontSize: 16,
      color: '#007aff',
      fontWeight: 'bold'
   },
   sectionContainer: {
      height: SCREEN_WIDTH,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      marginVertical: 5
   },
   sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10
   },
   itemContainer: {
      padding: 10,
      backgroundColor: 'white',
      marginVertical: 5,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2
   }
})
