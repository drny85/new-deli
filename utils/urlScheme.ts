import * as Linking from 'expo-linking'
import Constants from 'expo-constants'

export const urlScheme = Constants.o === 'expo' ? Linking.createURL('/--/') : Linking.createURL('')
