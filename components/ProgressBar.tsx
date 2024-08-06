import { StyleSheet } from 'react-native'
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { View } from './ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'

const ProgressBar = ({ progress }: { progress: SharedValue<number> }) => {
   const ascent = useThemeColor('ascent')
   const bg = useThemeColor('background')
   const animateView = useAnimatedStyle(() => {
      return {
         width: `${progress.value * 100}%`
      }
   })

   return (
      <View style={[styles.progressBar, { backgroundColor: bg }]}>
         <Animated.View style={[styles.progress, { backgroundColor: ascent }, animateView]} />
      </View>
   )
}

export default ProgressBar

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20
   },
   progressBar: {
      width: '100%',
      height: 20,

      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 20
   },
   progress: {
      height: '100%'
   }
})
