import { StyleSheet, useColorScheme, View } from 'react-native'

import Parallax from '../parallax/src/index'
import { Colors, SIZES } from '@/constants/Colors'
import React, { useState } from 'react'
import { Image } from 'expo-image'
import Animated, { FadeInUp } from 'react-native-reanimated'
import { BlurView } from 'expo-blur'

const HEADER_HIGHT = SIZES.height * 0.14

type Props = {
   children: React.ReactNode
   Header: React.ReactElement
   HeaderWithTitle: React.ReactElement
   backgroundImage: string
   title?: string
   subtitle?: string
   curved?: boolean
}

const ParallaxViewWithStickyHeader = ({
   children,
   Header,
   backgroundImage,
   HeaderWithTitle,
   title,
   subtitle,
   curved = false
}: Props) => {
   if (!backgroundImage) {
      console.warn('backgroundImage is requied, use image url')
   }
   if (!children) {
      console.warn('Content is requied, use React Node')
   }
   const [isVisible, setIsVisible] = useState(false)
   const backgroundColor =
      useColorScheme() === 'dark' ? Colors.dark.background : Colors.light.background
   return (
      <Parallax
         style={{ flex: 1, backgroundColor }}
         backgroundColor={backgroundColor}
         onChangeHeaderVisibility={(isVisible: boolean) => {
            setIsVisible(isVisible)
         }}
         contentBackgroundColor={backgroundColor}
         showsVerticalScrollIndicator={false}
         parallaxHeaderHeight={SIZES.height * 0.3}
         stickyHeaderHeight={HEADER_HIGHT}
         fixedHeaderHeight={HEADER_HIGHT}
         renderStickyHeader={() => (
            <View style={[styles.fixedHeader, { backgroundColor }]}>
               {/* <BusinessHeader business={business} /> */}
               {isVisible ? Header : HeaderWithTitle}
            </View>
         )}
         renderFixedHeader={() => <View style={[styles.fixedHeader]}>{Header && Header}</View>}
         renderBackground={() => (
            <View>
               <Image
                  style={styles.headerImage}
                  source={{
                     uri: backgroundImage
                  }} // Replace with your image URL
               />
               <BlurView
                  intensity={10}
                  style={{
                     position: 'absolute',
                     bottom: curved ? 26 : 0,
                     backgroundColor: 'rgba(0,0,0,0.2)',
                     padding: SIZES.sm,

                     width: '100%'
                  }}>
                  {title && (
                     <Animated.Text
                        style={{
                           fontSize: 24,
                           fontFamily: 'Lobster',
                           color: '#ffffff'
                        }}
                        entering={FadeInUp.duration(800)}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {title}
                     </Animated.Text>
                  )}
                  {subtitle && (
                     <Animated.Text
                        style={{ fontSize: 16, fontFamily: 'MontserratBold', color: 'white' }}
                        entering={FadeInUp.duration(800)}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {subtitle}
                     </Animated.Text>
                  )}
               </BlurView>
            </View>
         )}>
         <View style={[styles.content, curved && styles.curved, { backgroundColor }]}>
            {children}
         </View>
      </Parallax>
   )
}

export default ParallaxViewWithStickyHeader

const styles = StyleSheet.create({
   content: {
      flex: 1,
      backgroundColor: Colors.light.background
   },
   curved: {
      marginTop: -20,
      borderRadius: 20,
      paddingTop: 10
   },

   headerImage: {
      width: '100%',
      height: '100%'
   },
   stickyHeader: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd'
   },
   stickyHeaderText: {
      fontSize: 16,
      fontWeight: 'bold'
   },
   fixedHeader: {
      paddingHorizontal: SIZES.sm,
      position: 'absolute',
      height: HEADER_HIGHT,
      top: 0,
      left: 0,
      //paddingTop: SIZES.statusBarHeight,
      right: 0,
      zIndex: 20
   },
   fixedHeaderText: {
      fontSize: 18,
      fontWeight: 'bold'
   }
})
