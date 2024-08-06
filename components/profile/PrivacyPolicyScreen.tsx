import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { View } from '../ThemedView'
import { Text } from '../ThemedText'

const PrivacyPolicyScreen = () => {
   return (
      <ScrollView style={styles.container}>
         <View style={styles.section}>
            <Text style={styles.header}>Privacy Policy for Your Deli</Text>
            <Text style={styles.date}>Effective Date: {new Date().toDateString()}</Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>1. Introduction</Text>
            <Text style={styles.text}>
               Welcome to Your Deli! We value your privacy and are committed to protecting your
               personal information. This Privacy Policy explains how we collect, use, disclose, and
               safeguard your information when you use our mobile application ("App"). Please read
               this Privacy Policy carefully. If you do not agree with the terms of this Privacy
               Policy, please do not access the App.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>2. Information We Collect</Text>
            <Text style={styles.text}>
               We may collect information about you in a variety of ways. The information we may
               collect via the App includes:
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>a. Personal Data</Text>
               {'\n'}
               Personally identifiable information, such as your name, shipping address, email
               address, and telephone number, and demographic information, such as your age, gender,
               hometown, and interests, that you voluntarily give to us when you register with the
               App or when you choose to participate in various activities related to the App (such
               as placing an order or contacting support).
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>b. Derivative Data</Text>
               {'\n'}
               Information our servers automatically collect when you access the App, such as your
               IP address, your operating system, your access times, and the pages you have viewed
               directly before and after accessing the App.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>c. Financial Data</Text>
               {'\n'}
               Financial information, such as data related to your payment method (e.g., valid
               credit card number, card brand, expiration date) that we may collect when you
               purchase, order, return, exchange, or request information about our services from the
               App. We store only very limited, if any, financial information that we collect.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>d. Mobile Device Data</Text>
               {'\n'}
               Device information, such as your mobile device ID, model, and manufacturer, and
               information about the location of your device, if you access the App from a mobile
               device.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>e. Third-Party Data</Text>
               {'\n'}
               Information from third parties, such as personal information or network friends, if
               you connect your account to the third party and grant the App permission to access
               this information.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>3. Use of Your Information</Text>
            <Text style={styles.text}>
               Having accurate information about you permits us to provide you with a smooth,
               efficient, and customized experience. Specifically, we may use information collected
               about you via the App to:
            </Text>
            <Text style={styles.text}>
               - Create and manage your account.{'\n'}- Process your orders and deliver the products
               you request.{'\n'}- Improve our services and enhance your experience with the App.
               {'\n'}- Send you marketing and promotional communications.{'\n'}- Respond to your
               comments, questions, and provide customer service.{'\n'}- Monitor and analyze usage
               and trends to improve your experience with the App.{'\n'}- Protect against
               fraudulent, unauthorized, or illegal activity.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>4. Disclosure of Your Information</Text>
            <Text style={styles.text}>
               We may share information we have collected about you in certain situations. Your
               information may be disclosed as follows:
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>a. By Law or to Protect Rights</Text>
               {'\n'}
               If we believe the release of information about you is necessary to respond to legal
               process, to investigate or remedy potential violations of our policies, or to protect
               the rights, property, and safety of others, we may share your information as
               permitted or required by any applicable law, rule, or regulation.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>b. Third-Party Service Providers</Text>
               {'\n'}
               We may share your information with third parties that perform services for us or on
               our behalf, including payment processing, data analysis, email delivery, hosting
               services, customer service, and marketing assistance.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>c. Business Transfers</Text>
               {'\n'}
               We may share or transfer your information in connection with, or during negotiations
               of, any merger, sale of company assets, financing, or acquisition of all or a portion
               of our business to another company.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>d. Affiliates</Text>
               {'\n'}
               We may share your information with our affiliates, in which case we will require
               those affiliates to honor this Privacy Policy. Affiliates include our parent company
               and any subsidiaries, joint venture partners, or other companies that we control or
               that are under common control with us.
            </Text>
            <Text style={styles.text}>
               <Text style={styles.bold}>e. Other Third Parties</Text>
               {'\n'}
               We may share your information with advertisers and investors for the purpose of
               conducting general business analysis. We may also share your information with such
               third parties for marketing purposes, as permitted by law.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>5. Security of Your Information</Text>
            <Text style={styles.text}>
               We use administrative, technical, and physical security measures to help protect your
               personal information. While we have taken reasonable steps to secure the personal
               information you provide to us, please be aware that despite our efforts, no security
               measures are perfect or impenetrable, and no method of data transmission can be
               guaranteed against any interception or other type of misuse.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>6. Policy for Children</Text>
            <Text style={styles.text}>
               We do not knowingly solicit information from or market to children under the age of
               13. If we learn that we have collected personal information from a child under age 13
               without verification of parental consent, we will delete that information as quickly
               as possible. If you believe we might have any information from or about a child under
               13, please contact us at [Contact Information].
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>7. Changes to This Privacy Policy</Text>
            <Text style={styles.text}>
               We may update this Privacy Policy from time to time in order to reflect, for example,
               changes to our practices or for other operational, legal, or regulatory reasons. We
               will notify you of any changes by posting the new Privacy Policy on this page. You
               are advised to review this Privacy Policy periodically for any changes. Changes to
               this Privacy Policy are effective when they are posted on this page.
            </Text>
         </View>

         <View style={styles.section}>
            <Text style={styles.subHeader}>8. Contact Us</Text>
            <Text style={styles.text}>
               If you have questions or comments about this Privacy Policy, please contact us at:
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

export default PrivacyPolicyScreen
