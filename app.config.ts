import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
   name: 'Your Deli',
   slug: 'new-deli',
   version: '1.0.3',
   orientation: 'portrait',
   icon: './assets/images/icon.png',
   scheme: 'new-deli',
   userInterfaceStyle: 'automatic',
   newArchEnabled: true,
   splash: {
      image: './assets/images/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#8d0801'
   },
   ios: {
      supportsTablet: true,
      bundleIdentifier: 'net.robertdev.new-deli',
      buildNumber: '1.0.3',

      usesAppleSignIn: true,
      associatedDomains: ['applinks:yourdeliapp.com'],
      infoPlist: {
         NSLocationWhenInUseUsageDescription: 'Allow $(PRODUCT_NAME) to use your location.',

         LSApplicationQueriesSchemes: ['tel'],
         UIBackgroundModes: ['audio']
         // CFBundleURLTypes: [
         //    {
         //       CFBundleURLSchemes: [
         //          'com.googleusercontent.apps.1079176907860-v8bcnd3ahooqb1vtnofmqqh48u7280qt'
         //       ]
         //    }
         // ]
      },
      googleServicesFile: './GoogleService-Info.plist',
      config: {
         googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY
      }
   },
   android: {
      adaptiveIcon: {
         foregroundImage: './assets/images/adaptive-icon.png',
         backgroundColor: '#ffffff'
      },

      package: 'net.robertdev.new.deli',
      googleServicesFile: './google-android.json',
      config: {
         googleMaps: {
            apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY
         }
      }
   },
   web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
   },
   plugins: [
      'expo-router',
      'expo-apple-authentication',
      'expo-build-properties',
      'expo-font',
      [
         'expo-location',
         {
            locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.'
         }
      ],
      [
         'expo-dev-launcher',
         {
            launchMode: 'most-recent'
         }
      ],
      [
         'expo-image-picker',
         {
            photosPermission:
               'The app accesses your photos to let you share them with your friends.'
         }
      ],

      [
         '@stripe/stripe-react-native',
         {
            merchantIdentifier: ['merchant.net.robertdev.deli.app'],
            enableGooglePay: true
         }
      ]
   ],
   extra: {
      eas: {
         projectId: '10add964-ca80-4a99-b36a-554c8bbbae17'
      }
   },
   experiments: {
      typedRoutes: true,
      tsconfigPaths: true
   },
   owner: 'drny85',
   updates: {
      url: 'https://u.expo.dev/10add964-ca80-4a99-b36a-554c8bbbae17'
   },
   runtimeVersion: {
      policy: 'appVersion'
   }
}

export default config
