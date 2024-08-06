import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MotiView } from 'moti'
import { Skeleton } from 'moti/skeleton'
import { StyleSheet, useColorScheme } from 'react-native'
import Row from '../Row'
import { View } from '../ThemedView'

export default function HomeSkelenton() {
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
         <Row align="between">
            <Skeleton colorMode={colorMode} width={SIZES.width * 0.6} height={40} radius={6} />
            <Skeleton colorMode={colorMode} width={SIZES.width * 0.3} height={40} radius={30} />
         </Row>
         <Spacer height={20} />
         <Skeleton colorMode={colorMode} width={SIZES.width * 0.9} radius={30} height={40} />
         <Spacer height={20} />
         <View style={{ gap: SIZES.md, flexDirection: 'row' }}>
            {[...Array(6)].map((_, index) => (
               <Skeleton
                  key={index}
                  colorMode={colorMode}
                  width={SIZES.width * 0.25}
                  height={40}
                  radius={30}
               />
            ))}
         </View>
         <Spacer height={20} />
         <View style={{ gap: SIZES.md }}>
            {[...Array(3)].map((_, index) => (
               <Skeleton
                  key={index}
                  colorMode={colorMode}
                  width={'100%'}
                  height={SIZES.height * 0.2}
               />
            ))}
         </View>
      </MotiView>
   )
}

const Spacer = ({ height = 16 }) => <View style={{ height }} />

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center'
   },
   padded: {
      padding: 16
   }
})
