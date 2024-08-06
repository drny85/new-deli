import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
import Row from '../Row'
import { Feather } from '@expo/vector-icons'
import { SIZES } from '@/constants/Colors'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

type AddonsSelectorProps = {
   addons: string[]
   maxSelectable: number
   selectedAddons: string[]
   toggleAddonSelection: (addonName: string) => void
}

const AnimatedIcon = Animated.createAnimatedComponent(Feather)

const AddonsSelector: React.FC<AddonsSelectorProps> = ({
   addons,
   maxSelectable,
   selectedAddons,
   toggleAddonSelection
}) => {
   const backgroundColor = useThemeColor('ascent')
   const textColor = useThemeColor('text')
   return (
      <View style={styles.container}>
         <Row
            align="center"
            containerStyle={{ alignItems: 'center', marginBottom: SIZES.md, gap: SIZES.md }}>
            {maxSelectable === selectedAddons.length && (
               <AnimatedIcon
                  entering={FadeIn.duration(600)}
                  exiting={FadeOut.duration(300)}
                  name="check-circle"
                  color={backgroundColor}
                  size={26}
               />
            )}
            <Text center style={styles.title}>
               Select up to {maxSelectable}
            </Text>
         </Row>
         {addons.map((addon) => {
            const isSelected = selectedAddons.includes(addon)
            const isDisabled = !isSelected && selectedAddons.length >= maxSelectable

            return (
               <TouchableOpacity
                  key={addon}
                  style={[styles.addonItem, isDisabled && styles.disabled]}
                  onPress={() => !isDisabled && toggleAddonSelection(addon)}>
                  <View
                     style={[
                        styles.checkbox,
                        { borderColor: textColor },
                        isSelected && { borderColor: backgroundColor }
                     ]}>
                     {isSelected && (
                        <View style={[styles.checkboxInner, isSelected && { backgroundColor }]} />
                     )}
                  </View>
                  <Text capitalize style={[styles.addonText, isDisabled && styles.disabledText]}>
                     {addon}
                  </Text>
               </TouchableOpacity>
            )
         })}
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: SIZES.sm
   },
   title: {
      fontSize: 22,
      fontWeight: '500'
   },
   addonItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10
   },
   disabled: {
      opacity: 0.5
   },
   checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 4,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center'
   },

   checkboxInner: {
      width: 14,
      height: 14,
      borderRadius: 4
   },
   addonText: {
      fontSize: 16,
      fontWeight: 'condensedBold'
   },
   disabledText: {
      color: '#888'
   }
})

export default AddonsSelector
