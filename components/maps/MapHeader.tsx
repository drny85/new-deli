import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import { SymbolView } from 'expo-symbols'
import { TouchableOpacity } from 'react-native'
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
                  <FontAwesome name="chevron-left" size={22} color={ascentColor} />
               </NeoView>
            </TouchableOpacity>
            <Text center type="title" style={{ opacity: 0.7 }}>
               Pick-Up Order
            </Text>
            <View style={{ gap: SIZES.md }}>
               <TouchableOpacity onPress={onCenter}>
                  <NeoView rounded size={48}>
                     <MaterialIcons name="location-searching" size={28} color={ascentColor} />
                  </NeoView>
               </TouchableOpacity>
               <TouchableOpacity onPress={onZoomIn}>
                  <NeoView rounded size={48}>
                     <SymbolView name="plus" weight="bold" tintColor={ascentColor} />
                  </NeoView>
               </TouchableOpacity>
               <TouchableOpacity onPress={onZoomOut}>
                  <NeoView rounded size={48}>
                     <SymbolView name="minus.circle" tintColor={ascentColor} />
                  </NeoView>
               </TouchableOpacity>
            </View>
         </Row>
      </View>
   )
}

export default MapHeader
