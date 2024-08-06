import { Keyboard, StyleSheet } from 'react-native'

import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { useCallback, useMemo } from 'react'
import Button from '../Button'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import { container } from '@/parallax/src/styles'

type Props = {
   bottomSheetRef: any
   setInstructions: (value: string) => void
   instructions: string
   placeholder: string
}
const InstructionBottomSheet = ({
   bottomSheetRef,
   instructions,
   setInstructions,
   placeholder
}: Props) => {
   const backgroundColor = useThemeColor('primary')
   const textColor = useThemeColor('text')
   const ascent = useThemeColor('ascent')
   const snapPoints = useMemo(() => ['1%', '40%', '60%'], [])
   const renderBackdrop = useCallback(
      (props: any) => (
         <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={0}
            appearsOnIndex={1}
            enableTouchThrough={false}
         />
      ),
      []
   )
   return (
      <BottomSheet
         backgroundStyle={{
            backgroundColor: backgroundColor
         }}
         style={{ borderRadius: SIZES.lg, overflow: 'hidden' }}
         index={0}
         topInset={SIZES.statusBarHeight + SIZES.lg * 3}
         ref={bottomSheetRef}
         backdropComponent={renderBackdrop}
         snapPoints={snapPoints}
         overDragResistanceFactor={5}
         handleIndicatorStyle={{ backgroundColor: ascent }}
         handleStyle={{ backgroundColor }}>
         <View
            style={{
               padding: SIZES.md,
               marginTop: 20
            }}>
            <Text type="defaultSemiBold">Special Instructions</Text>
            <BottomSheetTextInput
               style={[styles.container, { color: textColor }]}
               placeholder={placeholder}
               value={instructions}
               multiline
               maxLength={160}
               onChangeText={setInstructions}
               //placeholderTextColor={theme.TEXT_COLOR + 90}
            />
            <View style={{ width: '60%', alignSelf: 'center', marginVertical: SIZES.lg }}>
               <Button
                  type="soft"
                  title={'Done'}
                  onPress={() => {
                     Keyboard.dismiss()
                     bottomSheetRef.current?.close()
                  }}
                  containerStyle={{ borderRadius: SIZES.lg * 1.5 }}
               />
            </View>
         </View>
      </BottomSheet>
   )
}

export default InstructionBottomSheet

const styles = StyleSheet.create({
   container: {
      marginTop: 10,
      marginBottom: 10,
      borderRadius: 10,
      minHeight: 70,
      fontSize: 16,
      lineHeight: 20,
      padding: SIZES.md,
      backgroundColor: 'rgba(151, 151, 151, 0.25)'
   }
})
