import fetch from './fetch-mock'

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
}))

jest.mock('react-native-fcm', () => ({
  requestPermissions: jest.fn(),
  getFCMToken: jest.fn(() => Promise.resolve()),
  getInitialNotification: jest.fn(() => Promise.resolve()),
  on: jest.fn(),
  FCMEvent: {
    Notification: 'Notification',
    RefreshToken: 'RefreshToken',
  },
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

global.fetch = fetch
