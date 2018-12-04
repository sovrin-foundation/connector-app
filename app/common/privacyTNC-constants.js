// @flow

import { Platform } from 'react-native'

const isAndroid = Platform.OS === 'android'
export { EULA_URL as TermsAndConditionUrl } from '../eula/type-eula'
export const TermsAndConditionsTitle = 'Terms and Conditions'

export const PrivacyPolicyUrl = 'https://www.connect.me/privacy.html'
export const localPrivacyPolicySource = isAndroid
  ? 'file:///android_asset/external/connectme/privacy.html'
  : './privacy.html'
export const PrivacyPolicyTitle = 'Privacy Policy'
