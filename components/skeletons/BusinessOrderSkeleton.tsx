import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'
import { StyleSheet, useColorScheme } from 'react-native'
import Row from '../Row'
import { View } from '../ThemedView'

export default function BusinessOrderSkeleton() {
   const dark = useColorScheme() === 'dark'
   const colorMode = dark ? 'dark' : 'light'

   const backgrounColor = useThemeColor('background')

   return (
      <MotiView
         transition={{
            duration: 1000
         }}
         style={[styles.container, styles.padded]}
         animate={{ backgroundColor: backgrounColor }}>
         <View style={{ gap: SIZES.md }}>
            {[...Array(6)].map((_, index) => (
               <Row align="between" key={index}>
                  <Skeleton
                     colorMode={colorMode}
                     width={SIZES.width * 0.45}
                     height={100}
                     radius={6}
                  />
                  <Skeleton
                     colorMode={colorMode}
                     width={SIZES.width * 0.45}
                     height={100}
                     radius={SIZES.md}
                  />
               </Row>
            ))}
         </View>
         <Spacer height={20} />
      </MotiView>
   )
}

const Spacer = ({ height = 16 }) => <View style={{ height }} />

const styles = StyleSheet.create({
   container: {
      flex: 1,
      paddingVertical: SIZES.lg * 2
   },
   padded: {
      padding: 16
   }
})
