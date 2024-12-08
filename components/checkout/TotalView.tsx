import { SIZES } from '@/constants/Colors'
import { globalStyle } from '@/constants/styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useOrderFlowStore } from '@/stores/orderFlowStore'
import { stripeFee } from '@/utils/stripeFee'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from '../Button'
import Row from '../Row'
import { Text } from '../ThemedText'
import { View } from '../ThemedView'
import { useAuth } from '@/providers/authProvider'
import AnimatedNumber from '../AnimatedNumber'
import { MY_TRANSACTION_FEE } from '@/shared/types'

type Props = {
   title?: string
   onPress: () => void
   cartTotal: number
   cartQuantity: number
   showFees?: boolean
   onUpdateTip?: () => void
   tip?: number
   businessOrderType: 'delivery' | 'pickup'
}

const TotalView = ({
   title,
   onPress,
   cartTotal,
   cartQuantity,
   onUpdateTip,
   showFees = false,
   tip
}: Props) => {
   const backgroundColor = useThemeColor('background')
   const { user } = useAuth()
   const { bottom } = useSafeAreaInsets()
   const { orderType, tipAmount } = useOrderFlowStore()

   return (
      <View
         style={[
            styles.bottom,
            {
               backgroundColor,
               paddingBottom: bottom
            }
         ]}>
         {showFees && (
            <View style={{ padding: SIZES.md, gap: SIZES.sm * 0.5 }}>
               <Row align="between">
                  <Text fontSize="medium" style={{ fontWeight: '700' }} type="muted">
                     Sub Total
                  </Text>
                  <Text style={{ fontWeight: '700' }} fontSize="medium" type="muted">
                     ${cartTotal.toFixed(2)}
                  </Text>
               </Row>
               {user?.type === 'consumer' && (
                  <Row align="between">
                     <Text type="muted">Fees</Text>
                     <Text type="muted">${stripeFee(cartTotal, orderType)}</Text>
                  </Row>
               )}
               {orderType === 'delivery' && user?.type === 'consumer' && (
                  <Row align="between">
                     <Text type="muted">Tips for courier</Text>
                     {onUpdateTip && (
                        <TouchableOpacity onPress={onUpdateTip}>
                           <Text style={{ fontWeight: '800', fontSize: 16 }} type="muted">
                              Update Tip
                           </Text>
                        </TouchableOpacity>
                     )}
                     <Text type="muted">${tip ? tip.toFixed(2) : tipAmount.toFixed(2)}</Text>
                  </Row>
               )}
            </View>
         )}
         <View style={{ padding: SIZES.md, gap: SIZES.md }}>
            {user && user.type === 'business' && (
               <Row align="between">
                  <Text type="muted">Transaction Fee</Text>
                  <Text type="muted">${((cartTotal * MY_TRANSACTION_FEE) / 100).toFixed(2)}</Text>
               </Row>
            )}
            <Row align="between">
               <Text fontSize="large" type="defaultSemiBold">
                  Total
               </Text>

               <Text type="muted">
                  {cartQuantity} item{cartQuantity > 1 ? 's' : ''}
               </Text>
               {showFees ? (
                  <Text fontSize="large" type="defaultSemiBold">
                     $
                     {user && user.type === 'business'
                        ? (cartTotal - (cartTotal * MY_TRANSACTION_FEE) / 100).toFixed(2)
                        : (cartTotal + tipAmount + stripeFee(cartTotal, orderType)).toFixed(2)}
                  </Text>
               ) : (
                  <AnimatedNumber value={+cartTotal.toFixed(2)} fontSize={22} />
               )}
            </Row>
            {title && (
               <Button
                  title={title}
                  onPress={onPress}
                  type="primary"
                  contentTextStyle={{ color: 'white' }}
               />
            )}
         </View>
      </View>
   )
}

export default TotalView
const styles = StyleSheet.create({
   bottom: {
      ...globalStyle.shadow,
      borderTopLeftRadius: SIZES.lg * 2,
      borderTopRightRadius: SIZES.lg * 2,
      padding: SIZES.sm
   }
})
