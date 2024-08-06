import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity, StyleSheet, TextInput, Keyboard } from 'react-native'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput } from '@gorhom/bottom-sheet'
import Button from '../Button'
import { SIZES } from '@/constants/Colors'
import NeoView from '../NeoView'
import Row from '../Row'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface TipsCalculatorProps {
   orderTotal: number
   bottomSheetRef: React.RefObject<BottomSheet>
}

const TipsCalculator: React.FC<TipsCalculatorProps> = ({ orderTotal, bottomSheetRef }) => {
   const [tipPercentage, setTipPercentage] = useState<number | null>(15)
   const [customTip, setCustomTip] = useState<string>('')
   const orderType = useOrderFlowStore((s) => s.orderType)
   const backgroundColor = useThemeColor('primary')
   const ascent = useThemeColor('ascent')
   const { bottom } = useSafeAreaInsets()
   const setTipAmount = useOrderFlowStore((s) => s.setTipAmount)

   const tipPercentages = useMemo(() => [10, 15, 20, 25], [])
   const tipAmount = useMemo(() => {
      if (tipPercentage !== null) {
         return (orderTotal * tipPercentage) / 100
      } else if (customTip) {
         return parseFloat(customTip)
      }
      return 0
   }, [tipPercentage, customTip, orderTotal])

   const totalAmount = useMemo(() => orderTotal + tipAmount, [orderTotal, tipAmount])

   const handleTipPercentagePress = (percentage: number) => {
      setTipPercentage(percentage)
      setCustomTip('')
   }

   const handleCustomTipChange = (text: string) => {
      setCustomTip(text)
      setTipPercentage(null)
   }

   const handleSheetChanges = (index: number) => {
      if (index === -1) Keyboard.dismiss()
   }

   const snapPoints = useMemo(() => ['1%', '80%'], [])
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

   useEffect(() => {
      if (orderType === 'pickup') {
         setTipAmount(0)
      } else {
         setTipAmount(tipAmount)
      }
   }, [tipAmount, setTipAmount, orderType])

   return (
      <BottomSheet
         backgroundStyle={{
            backgroundColor: backgroundColor
         }}
         onChange={handleSheetChanges}
         index={0}
         style={{ borderRadius: SIZES.lg * 2, overflow: 'hidden' }}
         ref={bottomSheetRef}
         backdropComponent={renderBackdrop}
         snapPoints={snapPoints}
         overDragResistanceFactor={5}
         handleIndicatorStyle={{ backgroundColor: ascent }}
         handleStyle={{ backgroundColor }}>
         <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.header}>Calculate Tip</Text>

            <Text style={styles.label}>Order Total: ${orderTotal.toFixed(2)}</Text>
            <Row align="evenly" containerStyle={{ marginVertical: SIZES.lg }}>
               {tipPercentages.map((percentage) => (
                  <TouchableOpacity
                     key={percentage}
                     onPress={() => {
                        handleTipPercentagePress(percentage)
                     }}>
                     <NeoView
                        rounded
                        size={60}
                        //containerStyle={{ backgroundColor }}
                        innerStyleContainer={{
                           backgroundColor: tipPercentage === percentage ? ascent : undefined
                        }}>
                        <Text
                           type="defaultSemiBold"
                           style={[
                              styles.buttonText,
                              tipPercentage === percentage && {
                                 color: '#ffffff',
                                 fontWeight: '800'
                              }
                           ]}>
                           {percentage}%
                        </Text>
                     </NeoView>
                  </TouchableOpacity>
               ))}
            </Row>

            <BottomSheetTextInput
               style={[styles.input, { borderColor: ascent }]}
               placeholder="Custom Tip"
               keyboardType="numeric"
               value={customTip}
               onChangeText={handleCustomTipChange}
            />

            <Text type="italic" style={styles.result}>
               Tip Amount: ${tipAmount.toFixed(2)}
            </Text>
            <Text type="defaultSemiBold" style={styles.result}>
               Total Amount: ${totalAmount.toFixed(2)}
            </Text>

            <View style={{ marginTop: SIZES.lg }}>
               <Button
                  //type="soft"
                  title="Update Tip"
                  contentTextStyle={{ color: '#ffffff' }}
                  onPress={() => bottomSheetRef.current?.close()}
               />
            </View>
            <View style={[styles.bottom, { bottom }]}>
               <Text center>Thank you for considering a tip for your driver!</Text>
               <Text center type="muted">
                  100% of the tip amount go directly to the delivery person, please be kind. tips
               </Text>
            </View>
         </View>
      </BottomSheet>
   )
}

const styles = StyleSheet.create({
   container: {
      padding: 20,
      flex: 1,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5
   },
   bottom: {
      position: 'absolute',
      gap: SIZES.sm,
      left: 0,
      right: 0,
      padding: 20
   },
   header: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: 'bold'
   },
   label: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center'
   },
   tipButton: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      alignItems: 'center'
   },

   buttonText: {
      fontSize: 16
   },
   input: {
      height: 40,
      borderWidth: StyleSheet.hairlineWidth,
      marginBottom: 20,
      paddingHorizontal: 10,
      borderRadius: SIZES.md,
      fontSize: 18,
      fontWeight: '600'
   },
   result: {
      fontSize: 18,
      marginTop: 10,
      textAlign: 'center'
   }
})

export default TipsCalculator
