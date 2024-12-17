/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')
import Constants from 'expo-constants'

const tintColorLight = '#0a7ea4'
const tintColorDark = '#ffffff'

export const Colors = {
   light: {
      text: '#212121',
      background: '#ffffff',
      primary: '#DEE9F7',
      secondary: '#FBFFFF',
      tint: tintColorLight,
      icon: '#687076',
      tabIconDefault: '#687076',
      tabIconSelected: tintColorLight,
      ascent: '#8d0801',
      white: '#ffffff',
      error: '#dc2f02'
   },
   dark: {
      text: '#ffffff',
      primary: '#264653',
      background: '#001a2c',
      secondary: '#110e1b',
      tint: tintColorDark,
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
      tabIconSelected: tintColorDark,
      ascent: '#7c162e',
      white: '#ffffff',
      error: '#dc2f02'
   }
}

export const SIZES = {
   sm: 10,
   md: 16,
   lg: 22,
   width,
   height,
   statusBarHeight: Constants.statusBarHeight,
   navBarHeight: 50
}
