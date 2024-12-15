import { useMemo, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'
import { Button, Keyboard, StyleSheet } from 'react-native'
import BottomSheet, {
   BottomSheetBackdrop,
   BottomSheetBackdropProps,
   BottomSheetTextInput
} from '@gorhom/bottom-sheet'
import { View } from './ThemedView'
import { SIZES } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'

type BottomSheetModalProps = {
   value: string
   onSubmit: () => void
   setValue: (value: string) => void
   onClose: () => void
}

export interface BottomSheetModalRef {
   open: () => void
   close: () => void
}

const BottomSheetModal = forwardRef<BottomSheetModalRef, BottomSheetModalProps>(
   ({ value, setValue, onClose, onSubmit }, ref) => {
      const bottomSheetRef = useRef<BottomSheet>(null)
      const backgroundColor = useThemeColor('background')
      const textColor = useThemeColor('text')
      const snapPoints = useMemo(() => ['25%', '50%', '75%'], [])
      const renderBackdrop = useCallback(
         (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop
               {...props}
               disappearsOnIndex={0}
               appearsOnIndex={1}
               enableTouchThrough={false}
            />
         ),
         []
      )

      const handleSheetChanges = (index: number) => {
         if (index === -1) Keyboard.dismiss()
      }

      useImperativeHandle(ref, () => ({
         open: () => bottomSheetRef.current?.snapToIndex(0),
         close: () => bottomSheetRef.current?.close()
      }))

      return (
         <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            topInset={SIZES.statusBarHeight + SIZES.lg * 4}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            onClose={onClose}
            style={{ borderRadius: SIZES.lg, overflow: 'hidden' }}
            backgroundStyle={{ backgroundColor }}
            handleIndicatorStyle={{ backgroundColor: textColor }}
            backdropComponent={renderBackdrop}>
            <View style={styles.contentContainer}>
               <BottomSheetTextInput
                  style={[styles.input, { color: textColor }]}
                  placeholder="Product description"
                  value={value}
                  multiline
                  onChangeText={setValue}
               />
               <View style={{ marginVertical: SIZES.lg }}>
                  <Button
                     title="Update Description"
                     onPress={() => {
                        onSubmit()
                        onClose()
                     }}
                  />
               </View>
            </View>
         </BottomSheet>
      )
   }
)

const styles = StyleSheet.create({
   contentContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 16
   },

   input: {
      minHeight: 80,
      borderRadius: SIZES.sm,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 8,
      marginBottom: 12
   }
})

export default BottomSheetModal
