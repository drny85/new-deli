import { View, TouchableOpacity } from 'react-native'
import Row from '../Row'
import { EvilIcons, Feather } from '@expo/vector-icons'
import { SIZES } from '@/constants/Colors'
import { Text } from '../ThemedText'

type Props = {
   onPressUpdateAddons: () => void
   onPressSetSeletecAddons: () => void
   onPressBack: () => void
   show: boolean
}

const AddonsHeader = ({
   onPressSetSeletecAddons,
   show,
   onPressUpdateAddons,
   onPressBack
}: Props) => {
   return (
      <Row containerStyle={{ justifyContent: 'space-between', paddingHorizontal: 20 }}>
         <TouchableOpacity onPress={onPressBack}>
            <Feather name="chevron-left" size={32} color={'#212121'} />
         </TouchableOpacity>
         <Row>
            {show && (
               <View style={{ marginRight: SIZES.md }}>
                  <TouchableOpacity
                     onPress={onPressSetSeletecAddons}
                     style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                     <EvilIcons name="undo" size={26} color="orange" />
                     <Text type="defaultSemiBold" center>
                        Undo
                     </Text>
                  </TouchableOpacity>
               </View>
            )}

            <TouchableOpacity
               onPress={onPressUpdateAddons}
               style={{
                  boxShadow: '1px 3px 2px 1px rbga(0,0,0,0.1)',
                  paddingHorizontal: SIZES.lg,
                  paddingVertical: SIZES.sm,
                  backgroundColor: 'white',
                  borderRadius: SIZES.md
               }}>
               <Text type="defaultSemiBold">Update Addons</Text>
            </TouchableOpacity>
         </Row>
      </Row>
   )
}

export default AddonsHeader
