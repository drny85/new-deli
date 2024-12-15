import { SIZES } from '@/constants/Colors'
import Constants from 'expo-constants'
import { ScrollView, StyleSheet, Button, Alert } from 'react-native'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'
import { useRestaurantsStore } from '@/stores/restaurantsStore'
import { dayjsFormat } from '@/utils/dayjs'
import { updateBusiness } from '@/actions/business'
import { Route, router, useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/providers/authProvider'
import { useThemeColor } from '@/hooks/useThemeColor'
import { toast } from 'sonner-native'

type Props = {
   onPressDisagree: () => void
}

const TermsOfUse = ({ onPressDisagree }: Props) => {
   const restaurant = useRestaurantsStore((s) => s.restaurant)
   const { user } = useAuth()
   const backgroundColor = useThemeColor('background')
   const { returnUrl } = useLocalSearchParams<{ returnUrl: string }>()
   const handleAgree = () => {
      if (!restaurant) return

      updateBusiness({
         ...restaurant,
         agreedToTerms: true,
         agreedToTermsOn: new Date().toISOString()
      })
      router.dismissAll()
      if (returnUrl) {
         router.push(returnUrl as Route)
      } else {
         router.back()
      }
      toast.warning('Terms of Use', {
         description: 'You have agreed to the Terms of Use.'
      })

      // Implement further actions on agreement, such as navigating to the next screen
   }

   const handleDisagree = () => {
      Alert.alert('Agreement', 'You have disagreed with the Terms of Use.')
      onPressDisagree()

      // Implement further actions on disagreement, such as navigating back or closing the app
   }

   return (
      <ScrollView
         style={styles.container}
         contentContainerStyle={{ marginVertical: SIZES.lg, backgroundColor }}>
         <View style={styles.section}>
            <Text center style={styles.header}>
               Terms of Use for Restaurant Partners
            </Text>
            <Text style={styles.subHeader}>Last Updated: 07/05/2024</Text>
            <Text style={styles.text}>
               Welcome to {Constants.expoConfig?.name}, a food delivery service provided by [Your
               Company Name] ("we," "our," or "us"). These Terms of Use ("Terms") govern the
               relationship between [Your Company Name] and the restaurant ("Restaurant" or "you")
               regarding the use of our platform and services. By signing up and using our services,
               you agree to these Terms.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>1. Acceptance of Terms</Text>
            <Text style={styles.text}>
               By registering as a partner restaurant on [Your App Name], you agree to comply with
               and be bound by these Terms. If you do not agree to these Terms, you must not use our
               platform or services.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>2. Restaurant Responsibilities</Text>
            <Text style={styles.text}>
               <Text style={styles.boldText}>Menu and Pricing:</Text> You agree to provide accurate
               and up-to-date information about your menu items, prices, and availability. You are
               responsible for ensuring that the prices and descriptions are correct.
               {'\n'}
               <Text style={styles.boldText}>Food Quality and Safety:</Text> You must comply with
               all relevant food safety and health regulations. You are responsible for the quality
               and safety of the food you prepare and deliver.
               {'\n'}
               <Text style={styles.boldText}>Order Fulfillment:</Text> You agree to prepare and
               fulfill orders in a timely manner. Any delays or issues with order fulfillment must
               be communicated promptly.
               {'\n'}
               <Text style={styles.boldText}>Customer Service:</Text> You are responsible for
               handling any customer complaints or inquiries related to the food you provide.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>3. Our Responsibilities</Text>
            <Text style={styles.text}>
               <Text style={styles.boldText}>Platform Access:</Text> We will provide you with access
               to our platform to manage your menu, orders, and account information.
               {'\n'}
               <Text style={styles.boldText}>Marketing and Promotion:</Text> We may promote your
               restaurant and menu items on our platform and through various marketing channels.
               {'\n'}
               <Text style={styles.boldText}>Payment Processing:</Text> We will process customer
               payments and remit the agreed-upon amounts to you, minus any applicable fees or
               commissions.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>4. Fees and Commissions</Text>
            <Text style={styles.text}>
               You agree to pay the fees and commissions as outlined in our [Fee
               Schedule/Agreement]. We reserve the right to change our fee structure with prior
               notice to you.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>5. Termination</Text>
            <Text style={styles.text}>
               Either party may terminate this agreement with [number] days' written notice. We may
               also terminate this agreement immediately if you breach any of these Terms.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>6. Confidentiality</Text>
            <Text style={styles.text}>
               Both parties agree to keep any confidential information received from the other party
               secure and not to disclose it to any third party without prior written consent.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>7. Intellectual Property</Text>
            <Text style={styles.text}>
               All intellectual property rights related to our platform and services remain the
               property of [Your Company Name]. You are granted a limited, non-exclusive license to
               use our platform for the duration of this agreement.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>8. Indemnification</Text>
            <Text style={styles.text}>
               You agree to indemnify and hold harmless Your Deli LLC, its affiliates, and their
               respective officers, directors, employees, and agents from any claims, damages,
               liabilities, and expenses arising out of or related to your use of our platform and
               services.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>9. Limitation of Liability</Text>
            <Text style={styles.text}>
               To the fullest extent permitted by law, Your Deli LLC shall not be liable for any
               indirect, incidental, special, consequential, or punitive damages, or any loss of
               profits or revenues, whether incurred directly or indirectly, or any loss of data,
               use, goodwill, or other intangible losses, resulting from (a) your use or inability
               to use our platform or services; (b) any conduct or content of any third party on the
               platform; or (c) unauthorized access, use, or alteration of your transmissions or
               content.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>10. Governing Law</Text>
            <Text style={styles.text}>
               These Terms shall be governed by and construed in accordance with the laws of New
               York, without regard to its conflict of law principles.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>11. Changes to Terms</Text>
            <Text style={styles.text}>
               We may update these Terms from time to time. If we make material changes, we will
               notify you by email or through our platform. Your continued use of our services after
               any changes indicates your acceptance of the new Terms.
            </Text>
         </View>
         <View style={styles.section}>
            <Text style={styles.header}>12. Contact Us</Text>
            <Text style={styles.text}>
               If you have any questions about these Terms, please contact us at [Your Contact
               Information].
            </Text>
         </View>
         <Text style={styles.footer}>Your Deli LLC</Text>

         {!restaurant?.agreedToTerms ? (
            <View style={styles.buttonContainer}>
               <Button title="Agree" onPress={handleAgree} />
               <Button title="Disagree" onPress={handleDisagree} color="red" />
            </View>
         ) : user && restaurant.agreedToTerms && restaurant.agreedToTermsOn ? (
            <View style={styles.buttonContainer}>
               <Text>Agreed On {dayjsFormat(restaurant.agreedToTermsOn).format('lll')}</Text>
            </View>
         ) : (
            <View style={styles.buttonContainer}>
               <Text>You must agreed to these terms once you create your account</Text>
            </View>
         )}
         <View style={{ height: 20, marginBottom: 20 }} />
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20
   },
   section: {
      marginBottom: 20
   },
   header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10
   },
   subHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5
   },
   text: {
      fontSize: 16,
      lineHeight: 24
   },
   boldText: {
      fontWeight: 'bold'
   },
   footer: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 20
   },
   buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginVertical: 20
   }
})

export default TermsOfUse
