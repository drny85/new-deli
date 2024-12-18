import { TouchableOpacity } from 'react-native'
import React from 'react'
import { SIZES } from '@/constants/Colors'
import { P_Size } from '@/shared/types'
import { useThemeColor } from '@/hooks/useThemeColor'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'
import * as Haptics from 'expo-haptics'
import { letterSizes } from '@/helpers/lettersSizes'
import NeumorphismView from '../NeumorphismView'

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
                        <NeumorphismView
                           borderRadius={radius}
                           style={{
                              height: radius,
                              width: radius,
                              justifyContent: 'center',
                              alignItems: 'center',
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
                        </NeumorphismView>
                     ) : (
                        <View
                           style={{
                              padding: SIZES.sm,
                              borderRadius: SIZES.lg * 1.5,
                              paddingHorizontal: SIZES.lg,
                              paddingVertical: SIZES.sm,
                              borderColor:
                                 selected && selected.id === p.id ? ascent : 'transparent',
                              borderWidth: 1,
                              width: 'auto',
                              minWidth: SIZES.width / 3.5,
                              justifyContent: 'center',
                              alignItems: 'center',
                              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                           }}>
                           <Text
                              center
                              type={
                                 selected && selected.id === p.id ? 'defaultSemiBold' : 'default'
                              }>
                              {p.size}
                           </Text>
                        </View>
                     )}
                  </TouchableOpacity>
               ))}
         </View>
      </View>
   )
}

export default SizePicker
