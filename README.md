# ConnectMe
App to connect Sovrin with 3rd party authentication


# Pre requisite to run

- React native setup

# Steps to run

- `yarn install`

## For ios
- `cd ios`
- `match development`. DO NOT use `--force` with this command
- `react-native run-ios`

# Things to remember
- We are putting a restriction on length of data that can be passed in QR code, we are putting this restriction so that we don't consume too much memory 

# Things to improve

- [ ] Add one more property to check if app lock is set, then save that property once lock setup is success. Get it in `hydrateConfig` saga, then check this value in splashscreen.js. It will help in case user has not completed pin setup and kills the app for first time, next time user opens the app, he won't be asked to setup pin
- [ ] Verify signature for after reading QR code. Once libindy is integrated
- [ ] Move all user related data to user-store. As of now user permission, phone number, identifier are in separate store.
- [ ] Response for API should be proxied via store and component should make use of `componentWillReceiveProps` method to subscribe for store changes.
- [ ] Store should be calling API and cache
- [ ] Hydration needs to replace whole store. As of now it just changes few values in config store
- [ ] Need to save whole store in keychain and implement proper hydration
- [ ] Show loader when user accept/reject invitation or authentication request
- [ ] Need to consider scenario if user has not allowed permission for push notification or user disable the permission
- [ ] We don't communicate to user on why we need push notification permission
- [ ] User invitation acceptance from SMS or QR code should work even without push notification permission
- [ ] Wallet implementation on mobile app is a huge stuff which is pending
- [ ] API requests should use a common function to call API and return response
- [ ] Fix all skipped tests

# Frequently Encountered Problems (FEP)

## Unit test

- *Problem*: `Invariant Violation: Native module cannot be null.`. *Solution*: You are missing the mocks for native module. Open `<rootDir>/__mocks__/setup.js` and create a mock for native module which is throwing error. You can check which native module is throwing error from call stack printed in terminal
