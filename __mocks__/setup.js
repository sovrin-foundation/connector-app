import React from 'react'
import { NativeModules } from 'react-native'
import fetch from './fetch-mock'
import mockCamera from './camera-mock'
import mockModal from './modal-mock'
import mockView from './view-mock'

// mock this module to allow react-navigation to mock Linking
jest.mock('Linking', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve()),
  getInitialURL: jest.fn(() => Promise.resolve()),
}))

jest.mock('react-navigation', () => ({
  StackNavigator: jest.fn(),
  TabNavigator: jest.fn(() => mockView),
  TabBarTop: jest.fn(),
  NavigationActions: {
    reset() {
      return arguments
    },
    navigate() {
      return arguments
    },
  },
}))

jest.mock('react-native-fcm', () => ({
  setBadgeNumber: jest.fn(),
  removeAllDeliveredNotifications: jest.fn(),
  requestPermissions: jest.fn(() => Promise.resolve()),
  getFCMToken: jest.fn(() => Promise.resolve()),
  getInitialNotification: jest.fn(() => Promise.resolve()),
  on: jest.fn(),
  FCMEvent: {
    Notification: 'Notification',
    RefreshToken: 'RefreshToken',
  },
}))

jest.mock('PixelRatio', () => ({
  get: jest.fn(() => 3), //PixelRatio.get() === 3 then iPhone 6 plus
  roundToNearestPixel: jest.fn(num => num),
}))

jest.mock('react-native-sensitive-info', () => {
  // todo: need to handle empty key-chain case
  const secureStorage = {
    ConnectMeKeyChain: {
      identifier: '26u37qFNUk3QwCUQ9ctest',
      phone: '6428900484',
      seed: 'S1StqtsAL4zkFZxmW57sL75zmufmVFQ3',
      pushComMethod: 'dehVox1KRqM:APA91bFWrJea1avml_ELw2MaH60abydtest',
    },
  }
  return {
    setItem: jest.fn((key, value, st) =>
      Promise.resolve((secureStorage['ConnectMeKeyChain'][key] = value))
    ),
    getItem: jest.fn(key =>
      Promise.resolve(secureStorage['ConnectMeKeyChain'][key])
    ),
    deleteItem: jest.fn(key =>
      Promise.resolve(delete secureStorage['ConnectMeKeyChain'][key])
    ),
  }
})

jest.mock('react-native-animatable', () => ({
  View: 'Animatable.View',
}))

jest.mock('react-native-camera', () => mockCamera)

jest.mock('Dimensions', () => ({
  get: jest.fn(() => ({
    width: 320,
    height: 540,
  })),
}))

jest.mock('react-native-touch-id', () => {
  return {
    authenticate: jest.fn(message => Promise.resolve()),
    isSupported: jest.fn(_ => Promise.resolve()),
  }
})

jest.mock('react-native-sentry', () => ({
  Sentry: {
    install() {},
    config() {
      return { install() {} }
    },
    captureException(error) {},
  },
  SentryLog: {
    Debug: 1,
  },
}))

jest.mock('AlertIOS', () => ({
  alert() {},
}))

global.fetch = fetch

jest.mock('Modal', () => mockModal)

jest.mock('react-native-modal', () => mockModal)

jest.mock('react-native-fetch-blob', () => ({
  fetch: jest.fn((type, url) => Promise.resolve()),
  fs: {
    dirs: {
      DocumentDir: '/var/application/DocumentDir',
    },
    exists: jest.fn(path => Promise.resolve(true)),
    unlink: jest.fn(path => Promise.resolve(true)),
    cp: jest.fn((source, destination) => Promise.resolve(destination)),
  },
}))

jest.mock('WebView', () => 'WebView')

jest.mock('InteractionManager', () => ({
  runAfterInteractions(fn) {
    fn()
  },
  createInteractionHandle: jest.fn(),
  clearInteractionHandle: jest.fn(),
}))

jest.mock('TextInput', () => 'TextInput')

jest.mock('moment', () =>
  jest.fn(date => ({
    format(format) {
      if (format === 'MM/DD/YYYY') {
        return '01/10/2018'
      }

      if (format === 'MMMM YYYY') {
        return 'January 2018'
      }

      return '2018-01-10T04:32:43+05:30'
    },
  }))
)

jest.mock('react-native-branch', () => {
  return {
    ADD_TO_CART_EVENT: 'Add to Cart',
    ADD_TO_WISHLIST_EVENT: 'Add to Wishlist',
    PURCHASE_INITIATED_EVENT: 'Purchase Started',
    PURCHASED_EVENT: 'Purchased',
    REGISTER_VIEW_EVENT: 'View',
    SHARE_COMPLETED_EVENT: 'Share Completed',
    SHARE_INITIATED_EVENT: 'Share Started',

    STANDARD_EVENT_ADD_TO_CART: 'ADD_TO_CART',
    STANDARD_EVENT_ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
    STANDARD_EVENT_VIEW_CART: 'VIEW_CART',
    STANDARD_EVENT_INITIATE_PURCHASE: 'INITIATE_PURCHASE',
    STANDARD_EVENT_ADD_PAYMENT_INFO: 'ADD_PAYMENT_INFO',
    STANDARD_EVENT_PURCHASE: 'PURCHASE',
    STANDARD_EVENT_SPEND_CREDITS: 'SPEND_CREDITS',

    STANDARD_EVENT_SEARCH: 'SEARCH',
    STANDARD_EVENT_VIEW_ITEM: 'VIEW_ITEM',
    STANDARD_EVENT_VIEW_ITEMS: 'VIEW_ITEMS',
    STANDARD_EVENT_RATE: 'RATE',
    STANDARD_EVENT_SHARE: 'SHARE',

    STANDARD_EVENT_COMPLETE_REGISTRATION: 'COMPLETE_REGISTRATION',
    STANDARD_EVENT_COMPLETE_TUTORIAL: 'COMPLETE_TUTORIAL',
    STANDARD_EVENT_ACHIEVE_LEVEL: 'ACHIEVE_LEVEL',
    STANDARD_EVENT_UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',

    // don't need any type checks for mocks, because they are not used
    // for type checking in code
    subscribe(cb: any) {},
  }
})

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
}))

jest.mock('react-native-unique-id', () =>
  jest.fn(() => Promise.resolve('uniqueDeviceId'))
)

jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(() =>
    Promise.resolve({ path: '/var/application/DocumentDir/user-avatar.jpeg' })
  ),
}))

// Add mock for RNIndy on NativeModules
// we don't want to mock NativeModules the way we are doing for all above
// because then we would have to mock everything else as well of NativeModules
// a lot of other modules depend on it, so we are adding RNIndy
// which is what we need to mock
NativeModules.RNIndy = {
  deserializeConnection: jest.fn(_ => Promise.resolve(1)),
  setWalletItem: jest.fn(_ => Promise.resolve(1)),
  deleteWalletItem: jest.fn(_ => Promise.resolve(1)),
  updateWalletItem: jest.fn(_ => Promise.resolve(1)),
  createWalletKey: jest.fn(_ => Promise.resolve('walletKey')),
}

jest.mock('react-native-version-number', () => ({
  appVersion: '1.0',
  buildVersion: '500',
}))
