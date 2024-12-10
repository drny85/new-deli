import { TouchableOpacity } from 'react-native'
import React from 'react'
import { SIZES } from '@/constants/Colors'
import { P_Size } from '@/shared/types'
import NeoView from '../NeoView'
import { useThemeColor } from '@/hooks/useThemeColor'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'
import * as Haptics from 'expo-haptics'
import { letterSizes } from '@/helpers/lettersSizes'

type Props = {
   sizes: P_Size[]
   onPress: (size: P_Size) => void
   selected: P_Size | null
   disabled?: boolean
   showTitle?: boolean
   radius?: number
}

const SizePicker = ({
   sizes,
   onPress,
   selected,
   disabled,
   showTitle = true,
   radius = 60
}: Props) => {
   const ascent = useThemeColor('ascent')

   const letterSize = letterSizes(sizes)

   return (
      <View style={{ alignItems: 'center' }}>
         {showTitle && sizes.length > 0 && (
            <Text type="defaultSemiBold">
               Pick One{' '}
               <Text style={{ opacity: 0.6, fontSize: 13 }} type="error">
                  (required)
               </Text>
            </Text>
         )}
         <View
            style={{
               flexDirection: 'row',
               justifyContent: 'center',
               gap: SIZES.md,
               flexWrap: 'wrap',
               marginVertical: SIZES.md
               //flex: 1
            }}>
            {sizes.length > 0 &&
               sizes.map((p) => (
                  <TouchableOpacity
                     disabled={disabled}
                     key={p.id}
                     onPress={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
                        onPress(p)
                     }}>
                     {letterSize ? (
                        <NeoView
                           rounded
                           size={radius}
                           innerStyleContainer={{
                              borderColor:
                                 selected && selected.id === p.id ? ascent : 'transparent',
                              borderWidth: 2
                           }}>
                           <Text
                              style={{ textTransform: 'uppercase' }}
                              center
                              type={
                                 selected && selected.id === p.id ? 'defaultSemiBold' : 'default'
                              }>
                              {p.id}
                           </Text>
                        </NeoView>
                     ) : (
                        <NeoView
                           containerStyle={{
                              borderRadius: SIZES.lg * 1.5
                           }}
                           innerStyleContainer={{
                              borderRadius: SIZES.lg * 1.5,
                              paddingHorizontal: SIZES.md,
                              paddingVertical: SIZES.sm,
                              borderColor:
                                 selected && selected.id === p.id ? ascent : 'transparent',
                              borderWidth: 1,
                              width: SIZES.width * 0.4
                           }}>
                           <Text
                              center
                              type={
                                 selected && selected.id === p.id ? 'defaultSemiBold' : 'default'
                              }>
                              {p.size}
                           </Text>
                        </NeoView>
                     )}
                  </TouchableOpacity>
               ))}
         </View>
      </View>
   )
}

export default SizePicker
