import { StyleSheet, ScrollView } from 'react-native'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'

const TermsOfUseScreen = () => {
   return (
      <ScrollView style={styles.container}>
         <View style={styles.section}>
            <Text style={styles.header}>Terms of Use for Your Deli</Text>
            <Text style={styles.date}>Effective Date: {new Date().toDateString()}</Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>1. Acceptance of Terms</Text>
            <Text style={styles.text}>
               By downloading, installing, or using the Your Deli mobile application ("App"), you
               agree to be bound by these Terms of Use ("Terms"). If you do not agree to these
               Terms, do not use the App.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>2. Changes to Terms</Text>
            <Text style={styles.text}>
               We may update these Terms from time to time. We will notify you of any changes by
               posting the new Terms on this page. You are advised to review these Terms
               periodically for any changes. Changes to these Terms are effective when they are
               posted on this page.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>3. Use of the App</Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>a. Eligibility</Text>
               {'\n'}
               You must be at least 18 years old to use the App. By using the App, you represent and
               warrant that you have the legal capacity to enter into a binding agreement.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>b. License</Text>
               {'\n'}
               We grant you a non-exclusive, non-transferable, revocable license to access and use
               the App in accordance with these Terms. You agree not to use the App for any unlawful
               or prohibited purpose.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>c. Account</Text>
               {'\n'}
               To use certain features of the App, you may need to create an account. You agree to
               provide accurate, current, and complete information during the registration process
               and to update such information to keep it accurate, current, and complete. You are
               responsible for maintaining the confidentiality of your account and password and for
               restricting access to your mobile device. You agree to accept responsibility for all
               activities that occur under your account.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>4. Orders and Payments</Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>a. Orders</Text>
               {'\n'}
               When you place an order through the App, you agree to pay the specified amount for
               your order, including any applicable taxes and fees. All orders are subject to
               acceptance by us.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>b. Payments</Text>
               {'\n'}
               We use third-party payment processors to process payments made through the App. By
               making a payment through the App, you agree to the terms and conditions of the
               third-party payment processor. We are not responsible for any errors made by the
               payment processor.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>5. User Conduct</Text>
            <Text style={styles.text}>You agree not to use the App to:</Text>
            <Text style={styles.text}>
               - Violate any local, state, national, or international law.{'\n'}- Engage in any
               conduct that restricts or inhibits anyone's use or enjoyment of the App.{'\n'}-
               Impersonate any person or entity or misrepresent your affiliation with a person or
               entity.{'\n'}- Interfere with or disrupt the operation of the App or the servers or
               networks used to make the App available.{'\n'}- Transmit any viruses, worms, defects,
               Trojan horses, or other items of a destructive nature.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>6. Intellectual Property</Text>
            <Text style={styles.text}>
               All content on the App, including but not limited to text, graphics, logos, images,
               and software, is the property of Your Deli or its content suppliers and is protected
               by intellectual property laws. You agree not to reproduce, duplicate, copy, sell,
               resell, or exploit any portion of the App without our express written permission.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>7. Disclaimers and Limitation of Liability</Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>a. Disclaimers</Text>
               {'\n'}
               The App is provided on an "as-is" and "as-available" basis. We make no
               representations or warranties of any kind, express or implied, regarding the
               operation of the App or the information, content, materials, or products included on
               the App.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>b. Limitation of Liability</Text>
               {'\n'}
               To the fullest extent permitted by law, we will not be liable for any damages of any
               kind arising from the use of the App, including but not limited to direct, indirect,
               incidental, punitive, and consequential damages.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>8. Indemnification</Text>
            <Text style={styles.text}>
               You agree to indemnify, defend, and hold harmless Your Deli, its officers, directors,
               employees, agents, and third parties, for any losses, costs, liabilities, and
               expenses (including reasonable attorney's fees) relating to or arising out of your
               use of or inability to use the App, your violation of these Terms, or your violation
               of any rights of a third party.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>9. Termination</Text>
            <Text style={styles.text}>
               We may terminate or suspend your access to the App at any time, without prior notice
               or liability, for any reason, including if you breach these Terms. Upon termination,
               your right to use the App will immediately cease.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>10. Governing Law</Text>
            <Text style={styles.text}>
               These Terms are governed by and construed in accordance with the laws of
               [State/Country], without regard to its conflict of law principles. You agree to
               submit to the personal jurisdiction of the courts located in [State/Country] for the
               purpose of litigating all such claims or disputes.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>11. Contact Us</Text>
            <Text style={styles.text}>
               If you have any questions about these Terms, please contact us at:
            </Text>
            <Text style={styles.text}>Your Deli{'\n'}</Text>
         </View>
      </ScrollView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff'
   },
   section: {
      marginBottom: 20
   },
   header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10
   },
   subHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10
   },
   text: {
      fontSize: 16,
      lineHeight: 24
   },
   bold: {
      fontWeight: 'bold'
   },
   date: {
      fontSize: 16,
      marginBottom: 20
   }
})

export default TermsOfUseScreen
