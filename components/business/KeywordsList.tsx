import { SIZES } from '@/constants/Colors'
import NeumorphismView from '../NeumorphismView'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'

const KeywordsList = ({
   keywords,
   onPress,
   disabled = false
}: {
   keywords: string[]
   onPress: (keyword: string) => void
   disabled?: boolean
}) => {
   const ascent = useThemeColor('ascent')
   return (
      <View style={{ flexDirection: 'row', gap: SIZES.md, flexWrap: 'wrap', padding: SIZES.sm }}>
         {keywords.map((keyword, index) => (
            <NeumorphismView
               key={index}
               style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  paddingHorizontal: SIZES.sm * 0.5
               }}>
               <Text type="defaultSemiBold">{keyword}</Text>
               <TouchableOpacity
                  disabled={disabled}
                  onPress={() => onPress(keyword)}
                  style={{ padding: SIZES.sm * 0.7 }}>
                  <Feather name="x-circle" size={20} color={ascent} />
               </TouchableOpacity>
            </NeumorphismView>
         ))}
      </View>
   )
}

export default KeywordsList
