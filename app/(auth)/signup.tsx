import SigninWithGoogle from '@/components/auth/SigninWithGoogle'
import SigninWithApple from '@/components/auth/useAppleSignin'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Input from '@/components/Input'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useAuth } from '@/providers/authProvider'
import { Redirect, Route, router, useLocalSearchParams } from 'expo-router'

import Loading from '@/components/Loading'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
import { formatPhone } from '@/utils/formatPhone'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native'
import { z } from 'zod'

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

const Signup = () => {
   const params = useLocalSearchParams<{ returnUrl: string }>()
   const { signUp, user } = useAuth()
   const bgColor = useThemeColor('icon')

   const {
      control,
      handleSubmit,
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
            await signUp(
               values.email,
               values.password,
               values.name,
               values.lastName,
               values.phone,
               'consumer'
            )
         }
      } catch (error) {
         console.log(error)
      }
   }, [])

   if (user) return <Redirect href={params.returnUrl as Route} />

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
                              placeholder="Phone Number"
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
                     <View style={{ height: SIZES.md }} />
                     <Button
                        disabled={isLoading}
                        title="Sign Up"
                        type="soft"
                        onPress={handleSubmit(handleSignup)}
                     />
                  </View>
                  <Row>
                     <View style={{ height: 1, flex: 1, backgroundColor: bgColor, opacity: 0.6 }} />
                     <Text style={{ marginHorizontal: 10 }}>or</Text>
                     <View style={{ height: 1, flex: 1, backgroundColor: bgColor, opacity: 0.6 }} />
                  </Row>
                  <Row containerStyle={{ alignSelf: 'center', gap: SIZES.lg }}>
                     <SigninWithGoogle />
                     {Platform.OS === 'ios' && <SigninWithApple />}
                  </Row>
               </View>
            </ScrollView>
            <Row align="evenly">
               <TouchableOpacity onPress={router.back}>
                  <Text
                     center
                     type="muted"
                     style={{ marginBottom: SIZES.md, fontWeight: '700', fontSize: 16 }}>
                     Already has an account?
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => router.push('/businessSignup')}>
                  <Text
                     center
                     type="muted"
                     style={{ marginBottom: SIZES.md, fontWeight: '700', fontSize: 16 }}>
                     Business account?
                  </Text>
               </TouchableOpacity>
            </Row>
         </KeyboardAvoidingView>
      </Container>
   )
}

export default Signup
