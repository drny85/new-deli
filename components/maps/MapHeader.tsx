import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { SymbolView } from 'expo-symbols'
import { TouchableOpacity, useColorScheme } from 'react-native'
import NeoView from '../NeoView'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'

type Props = {
   onCenter: () => void
   onPressBack: () => void
   onZoomIn: () => void
   onZoomOut: () => void
}
const MapHeader = ({ onPressBack, onCenter, onZoomIn, onZoomOut }: Props) => {
   const ascentColor = useThemeColor('ascent')
   const isDark = useColorScheme() === 'dark'

   return (
      <View
         style={{
            width: '100%',
            position: 'absolute',
            zIndex: 20,
            top: SIZES.statusBarHeight
         }}>
         <Row
            align="between"
            containerStyle={{
               width: '100%',
               paddingHorizontal: SIZES.sm,
               alignItems: 'flex-start'
            }}>
            <TouchableOpacity onPress={onPressBack}>
               <NeoView rounded size={48}>
                  <FontAwesome
                     name="chevron-left"
                     size={24}
                     color={isDark ? '#ffffff' : ascentColor}
                  />
               </NeoView>
            </TouchableOpacity>
            <Text center type="title" style={{ opacity: 0.7 }}>
               Pick-Up Order
            </Text>
            <View style={{ gap: SIZES.md }}>
               <TouchableOpacity onPress={onCenter}>
                  <NeoView rounded size={48}>
                     <MaterialIcons
                        name="location-searching"
                        size={28}
                        color={isDark ? '#ffffff' : ascentColor}
                     />
                  </NeoView>
               </TouchableOpacity>
               <TouchableOpacity onPress={onZoomIn}>
                  <NeoView rounded size={48}>
                     <SymbolView
                        name="plus"
                        weight="bold"
                        tintColor={isDark ? '#ffffff' : ascentColor}
                     />
                  </NeoView>
               </TouchableOpacity>
               <TouchableOpacity onPress={onZoomOut}>
                  <NeoView rounded size={48}>
                     <SymbolView name="minus.circle" tintColor={isDark ? '#ffffff' : ascentColor} />
                  </NeoView>
               </TouchableOpacity>
            </View>
         </Row>
      </View>
   )
}

export default MapHeader
