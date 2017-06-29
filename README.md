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

# Things to improve

- [] Move all user related data to user-store. As of now user permission, phone number, identifier are in separate store.
- [] Response for API should be proxied via store and component should make use of `componentWillReceiveProps` method to subscribe for store changes.
- [] Store should be calling API and cache
- [] Hydration needs to replace whole store. As of now it just changes few values in config store
- [] Need to save whole store in keychain and implement proper hydration

# Frequently Encountered Problems (FEP)

## Unit test

- *Problem*: `Invariant Violation: Native module cannot be null.`. *Solution*: You are missing the mocks for native module. Open `<rootDir>/__mocks__/setup.js` and create a mock for native module which is throwing error. You can check which native module is throwing error from call stack printed in terminal
