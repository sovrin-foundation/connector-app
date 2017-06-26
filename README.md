# ConnectMe
App to connect Sovrin with 3rd party authentication


# Pre requisite to run

- React native setup

# Steps to run

- `yarn install`
- `react-native run-ios`


# Things to improve

- [] Move all user related data to user-store. As of now user permission, phone number, identifier are in separate store.
- [] Response for API should be proxied via store and component should make use of `componentWillReceiveProps` method to subscribe for store changes.
- [] Store should be calling API and cache
- [] Hydration needs to replace whole store. As of now it just changes few values in config store
- [] Need to save whole store in keychain and implement proper hydration
