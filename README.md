# ConnectMe
App to connect Sovrin with 3rd party authentication

# Pre requisite to run

- Mac machine
- [React native setup](http://facebook.github.io/react-native/docs/getting-started.html). Use tab `Building Projects with Native Code`
- XCode 9

# Steps to run

- `yarn install`

## For ios
- `cd ios`
- `match development`. DO NOT use `--force` with this command
- `pod install`
- `cd .. && npm run ios`

# To Read
- [Coding guidelines](https://github.com/evernym/ConnectMe/blob/master/CODING_GUIDELINES.md)
- [Contributing guidelines](https://github.com/evernym/ConnectMe/blob/master/CONTRIBUTING_GUIDELINES.MD)

## Tech stack used
- [React Native](https://facebook.github.io/react-native/)
- [React Navigation](http://reactnavigation.org)
- [Redux](http://redux.js.org)
- [Redux Saga](https://redux-saga.js.org)
- [Flow](http://flow.org/)
- [Jest](https://facebook.github.io/jest/)
- [Yarn](http://yarnpkg.com)
- [Cocoa pods](http://cocoadocs.org)

# Things to remember
- We are putting a restriction on length of data that can be passed in QR code

# Things to improve

- [X] Add one more property to check if app lock is set, then save that property once lock setup is success. Get it in `hydrateConfig` saga, then check this value in splashscreen.js. It will help in case user has not completed pin setup and kills the app for first time, next time user opens the app, he won't be asked to setup pin
- [ ] Hydration needs to replace whole store. As of now it just changes few values in config store
- [ ] Need to save whole store in keychain and implement proper hydration
- [ ] Show loader when user accept/reject invitation or authentication request
- [ ] Need to consider scenario if user has not allowed permission for push notification or user disable the permission
- [ ] We need to communicate to user on why we need push notification permission
- [ ] Wallet implementation on mobile app is a huge stuff which is pending
- [X] API requests should use a common function to call API and return response
- [X] Fix all skipped tests
- [ ] Handle all API errors while downloading url, downloading data, accepting/rejecting as per new changes. As of now we are not doing that

# Frequently Encountered Problems (FEP)

## Unit test

- *Problem*: `Invariant Violation: Native module cannot be null.`. *Solution*: You are missing the mocks for native module. Open `<rootDir>/__mocks__/setup.js` and create a mock for native module which is throwing error. You can check which native module is throwing error from call stack printed in terminal
