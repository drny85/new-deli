import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Input from '@/components/Input'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useAuth } from '@/providers/authProvider'
import { Redirect, router, useLocalSearchParams } from 'expo-router'

import Loading from '@/components/Loading'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { formatPhone } from '@/utils/formatPhone'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Modal, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { z } from 'zod'
import { useMMKV } from 'react-native-mmkv'

const signupSchema = z
   .object({
      name: z.string().min(2, { message: 'name must be at least 2 characters' }),
      lastName: z.string().min(2, { message: 'last name must be at least 2 characters' }),
      phone: z.string().min(14, { message: 'phone must be at least 10 characters' }),
      email: z.string().email(),
      password: z.string().min(6, { message: 'password must be at least 6 characters' }),
      confirmPassword: z.string().min(6, { message: 'password must be at least 6 characters' })
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'passwords do not match',
      path: ['confirmPassword']
   })
type SignupSchema = z.infer<typeof signupSchema>

const BusinessSignup = () => {
   const params = useLocalSearchParams<{ returnUrl: string }>()
   const { signUp, user, setUser } = useAuth()
   const mmk = useMMKV()

   const [showReviewModal, setShowReviewModal] = useState(false)

   const {
      control,
      handleSubmit,
      getValues,
      formState: { errors, isLoading, isSubmitting }
   } = useForm<SignupSchema>({
      defaultValues: {
         email: '',
         password: ''
      },
      resolver: zodResolver(signupSchema)
   })

   const handleSignup = useCallback(async (values: SignupSchema) => {
      try {
         const { email, password } = values
         if (email && password) {
            setShowReviewModal(true)
         }
      } catch (error) {
         console.log(error)
      }
   }, [])

   const completeSignup = async (values: SignupSchema) => {
      try {
         setShowReviewModal(false)
         const success = await signUp(
            values.email,
            values.password,
            values.name,
            values.lastName,
            values.phone,
            'business'
         )
         //router.push('/(deli)/home')
         if (success) {
            mmk.set('email', values.email)
            mmk.set('password', values.password)
            router.replace('/login')
         }
      } catch (error) {
         const err = error as Error
         console.log('E', err.message)
      }
   }

   if (user) return <Redirect href={params.returnUrl as any} />

   if (isSubmitting) return <Loading />

   return (
      <Container>
         <BackButton />
         <KeyboardAvoidingView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: SIZES.md }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={2}>
            <ScrollView contentContainerStyle={{ marginTop: SIZES.lg * 2 }}>
               <Text center type="title">
                  You are creating a Business Account
               </Text>
               <View
                  style={{
                     width: '100%',
                     justifyContent: 'center',
                     flex: 1,
                     padding: SIZES.md,
                     gap: SIZES.lg
                  }}>
                  <View>
                     <Controller
                        name="name"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <Input
                              autoCapitalize="words"
                              value={value}
                              placeholder="First Name"
                              error={errors.name?.message}
                              onChangeText={onChange}
                           />
                        )}
                     />
                     <View style={{ height: SIZES.md }} />
                     <Controller
                        name="lastName"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <Input
                              autoCapitalize="words"
                              value={value}
                              placeholder="Last Name"
                              error={errors.lastName?.message}
                              onChangeText={onChange}
                           />
                        )}
                     />
                     <View style={{ height: SIZES.md }} />
                     <Controller
                        name="phone"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <Input
                              value={value}
                              placeholder="Cell Phone Number"
                              keyboardType="number-pad"
                              error={errors.phone?.message}
                              onChangeText={(text) => onChange(formatPhone(text))}
                           />
                        )}
                     />
                     <View style={{ height: SIZES.md }} />
                     <Controller
                        name="email"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <Input
                              autoCapitalize="none"
                              value={value}
                              placeholder="Email Address"
                              error={errors.email?.message}
                              onChangeText={(text) => onChange(text.toLowerCase())}
                           />
                        )}
                     />
                     <View style={{ height: SIZES.md }} />
                     <Controller
                        name="password"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <Input
                              placeholder="Password"
                              error={errors.password?.message}
                              secureTextEntry={true}
                              textContentType="oneTimeCode"
                              onChangeText={onChange}
                              value={value}
                           />
                        )}
                     />
                     <View style={{ height: SIZES.md }} />
                     <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                           <Input
                              placeholder="Confirm Password"
                              error={errors.confirmPassword?.message}
                              secureTextEntry={true}
                              textContentType="oneTimeCode"
                              onChangeText={onChange}
                              value={value}
                           />
                        )}
                     />
                     <View style={{ height: SIZES.md, marginBottom: 10 }} />
                     <Button
                        disabled={isLoading}
                        title="Sign Up For Business"
                        type="soft"
                        onPress={handleSubmit(handleSignup)}
                     />
                  </View>
                  {/* <Row>
                     <View style={{ height: 1, flex: 1, backgroundColor: bgColor, opacity: 0.6 }} />
                     <Text style={{ marginHorizontal: 10 }}>or</Text>
                     <View style={{ height: 1, flex: 1, backgroundColor: bgColor, opacity: 0.6 }} />
                  </Row> */}
                  {/* <Row containerStyle={{ alignSelf: 'center', gap: SIZES.lg }}>
                     <SigninWithGoogle />
                     {Platform.OS === 'ios' && <SigninWithApple />}
                  </Row> */}
               </View>
            </ScrollView>
            <View style={{ marginVertical: SIZES.lg * 2 }}>
               <Text onPress={() => router.push('/business-terms')} type="muted" center>
                  Terms & Conditions
               </Text>
            </View>
            <Row align="evenly">
               <TouchableOpacity onPress={() => router.dismissAll()}>
                  <Text
                     center
                     type="muted"
                     style={{ marginBottom: SIZES.md, fontWeight: '700', fontSize: 16 }}>
                     Back to Login
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={router.back}>
                  <Text
                     center
                     type="muted"
                     style={{ marginBottom: SIZES.md, fontWeight: '700', fontSize: 16 }}>
                     Consumer account?
                  </Text>
               </TouchableOpacity>
            </Row>
         </KeyboardAvoidingView>
         <Modal
            animationType="slide"
            visible={showReviewModal}
            onRequestClose={() => setShowReviewModal(false)}>
            <Container>
               <View center style={{ padding: SIZES.md }}>
                  <Text type="header"> Review Information</Text>
                  <View style={{ gap: SIZES.md, marginVertical: SIZES.lg }}>
                     {Object.entries(getValues()).map(
                        ([key, value]) =>
                           typeof value === 'string' &&
                           key !== 'confirmPassword' && (
                              <Text key={key}>
                                 <Text capitalize>{key === 'lastName' ? 'Last Name' : key}</Text>:{' '}
                                 {value}
                              </Text>
                           )
                     )}
                  </View>
                  <Button
                     disabled={isLoading}
                     title="Look Good!"
                     type="soft"
                     contentTextStyle={{ paddingHorizontal: SIZES.lg * 2 }}
                     onPress={() => {
                        const values = getValues()
                        completeSignup(values)
                     }}
                  />
               </View>
            </Container>
         </Modal>
      </Container>
   )
}

export default BusinessSignup
