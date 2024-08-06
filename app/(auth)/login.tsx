import SigninWithGoogle from '@/components/auth/SigninWithGoogle'
import SigninWithApple from '@/components/auth/useAppleSignin'
import BackButton from '@/components/BackButton'
import Button from '@/components/Button'
import { Container } from '@/components/Container'
import Input from '@/components/Input'
import { View } from '@/components/ThemedView'
import { SIZES } from '@/constants/Colors'
import { useAuth } from '@/providers/authProvider'
import { Link, Redirect, useLocalSearchParams } from 'expo-router'

import Loading from '@/components/Loading'
import Row from '@/components/Row'
import { Text } from '@/components/ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { z } from 'zod'
import { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons'

const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6, { message: 'password must be at least 6 characters' })
})
type LoginSchema = z.infer<typeof loginSchema>

const Login = () => {
   const params = useLocalSearchParams<{ returnUrl: string }>()
   const { signIn, user } = useAuth()
   const bgColor = useThemeColor('icon')
   const [showPassword, setShowPassword] = useState(false)
   console.log(params)

   const {
      control,
      handleSubmit,
      formState: { errors, isLoading, isSubmitting }
   } = useForm<LoginSchema>({
      defaultValues: {
         email: '',
         password: ''
      },
      resolver: zodResolver(loginSchema)
   })

   const handleLogin = async (values: LoginSchema) => {
      try {
         const { email, password } = values
         if (email && password) {
            console.log(values)
            await signIn(email, password)
         }
      } catch (error) {
         console.log('ZEZEE', error)
      }
   }

   if (user && user.type === 'consumer') return <Redirect href={params.returnUrl as any} />
   if (user && user.type === 'business') return <Redirect href={'/(deli)/home'} />

   if (isSubmitting) return <Loading />

   return (
      <Container center>
         <BackButton />
         <KeyboardAvoidingView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: SIZES.md }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={2}>
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
                           textContentType="oneTimeCode"
                           error={errors.password?.message}
                           secureTextEntry={!showPassword}
                           onChangeText={onChange}
                           RightIcon={
                              <FontAwesome
                                 selectionColor={'grey'}
                                 name={showPassword ? 'eye' : 'eye-slash'}
                                 size={20}
                                 color={'grey'}
                                 onPress={() => setShowPassword((p) => !p)}
                              />
                           }
                           value={value}
                        />
                     )}
                  />
                  <View style={{ height: SIZES.md }} />
                  <Button
                     disabled={isLoading}
                     title="Login"
                     type="soft"
                     onPress={handleSubmit(handleLogin)}
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
            <Link href={{ pathname: '/signup', params }}>
               <Text
                  center
                  type="muted"
                  style={{ marginBottom: SIZES.lg, fontWeight: '700', fontSize: 16 }}>
                  Create Account
               </Text>
            </Link>
         </KeyboardAvoidingView>
      </Container>
   )
}

export default Login
