import { SIZES } from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import { ViewStyle } from 'react-native'
import Input from '../Input'

type Props = {
   placeholder: string
   onValueChange: (value: string) => void
   onClose: () => void
   value: string
   contentContainerStyle?: ViewStyle
}
const RestaurantSearch = ({
   placeholder,
   value,
   onValueChange,
   onClose,
   contentContainerStyle
}: Props) => {
   return (
      <Input
         RightIcon={
            <FontAwesome
               disabled={value.length === 0}
               onPress={onClose}
               name={value.length > 0 ? 'close' : 'search'}
               size={20}
               color={'grey'}
            />
         }
         contentContainerStyle={[
            {
               borderRadius: SIZES.lg * 3,
               height: 40,
               borderColor: 'transparent'
            },
            contentContainerStyle
         ]}
         containerStyle={{ borderRadius: SIZES.lg * 3 }}
         placeholder={placeholder}
         value={value}
         returnKeyType="done"
         autoCapitalize="none"
         onChangeText={onValueChange}
      />
   )
}

export default RestaurantSearch
