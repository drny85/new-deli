import { useThemeColor } from '@/hooks/useThemeColor'
import { View } from './ThemedView'
import { SIZES } from '@/constants/Colors'
import { StyleSheet } from 'react-native'

type Props = {
   size?: 'small' | 'medium' | 'large'
}

const Divider = ({ size = 'medium' }: Props) => {
   const ascent = useThemeColor('icon')
   return (
      <View
         style={{
            height: size === 'small' ? StyleSheet.hairlineWidth : size === 'medium' ? 1 : 1.8,
            backgroundColor: ascent,
            width: '80%',
            alignSelf: 'center',
            marginVertical: SIZES.sm
         }}
      />
   )
}

export default Divider
