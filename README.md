# ConnectMe
App to connect Sovrin with 3rd party authentication

# Pre requisite to run

- Mac machine
- [React native setup](http://facebook.github.io/react-native/docs/getting-started.html). Use tab `Building Projects with Native Code`
- XCode 9
- Ruby
- Node 8+

# Steps to run

- Clone this repository with `SSH`
- `yarn install`

## For ios
- `cd ios/fastlane`
- `bundle install`
- Make sure you get added to the connectme-callcenter-certs repo so that the following command is successful --
git clone 'git@github.com:evernym/connectme-callcenter-certs.git' '/var/folders/dt/sk594jpn40d0097bpg17gwc40000gn/T/d20180705-10510-lw9oue'
- To get the development release certificates do `bundle exec fastlane match development`. DO NOT use `--force` with this command. Do not use XCode automatic code signing.
- To get the beta release certificates do `bundle exec fastlane match adhoc`
- You'll be prompted to enter 2 passwords. Slack a contributor for what those are.
- Make sure that the ios/ConnectMe/Info.plist, ios/ConnectMeTests/Info.plist, ios/ConnectMe-tvOS/Info.plist, ios/ConnectMe-tvOSTests/Info.plist,  have their CFBundleVersion <string> set to the NEXT build number
- Make sure that the ios/ConnectMe.xcodeproj/project.pbxproj has it's 2 CURRENT_PROJECT_VERSION attributes set to the NEXT build number
- To get releasable .ipa launch Xcode and open the ios/ConnectMe.xcworkspace project
- Select the "Generic iOS Device"
- Then run Product -> Archive
- After it is done then login to hockeyapp.net and click on QA ConnectMe and then click add version button and upload it
- `cd .. && pod install` (Make sure `pod` is installed or `sudo gem install cocoapods`)
- `cd .. && npm run ios`

## For android local Relase build

- add my_keystore.jks file to ~/keystores folder
If you get this error during the ` bitrise run android ` build then you are missing the my_keystore.jks file
What went wrong:
Execution failed for task ':app:validateSigningRelease'.
> Keystore file /Users/norm/keystores/my_keystore.jks not found for signing config 'release'.
- ask your team members for .bitrise.secrets.yml file and place it in directory with bitirse.yml file
- run ` brew install bitirse && bitrise setup `
- Make sure that the android/app/build.gradle has it's versionCode attribute set to the PREVIOUS build number (be aware that a failed "bitrise run android" will STILL increment the number and so you will need to decrement it back to the PREVIOUS build number after a failure)
- run ` bitrise run android `
- If you get this error then rm -rf node_modules and re-run ` bitrise run android `
What went wrong:
Failed to capture snapshot of input files for task ':app:bundleReleaseJsAndAssets' property '$1' during up-to-date check.
> Could not list contents of '/Users/norm/forge/work/code/evernym/ConnectMe/node_modules/jest-runtime/node_modules/babel-core/node_modules/.bin/babylon'. Couldn't follow symbolic link.
- run ` brew install maven `
- download the vcx.aar file
- later run ` mvn install:install-file -Dfile=com.evernym-vcx_1.0.0-12-06-2018T16-17_x86-armv7-release.aar -DgroupId=com.connectme -DartifactId=vcx -Dversion=1.0.0-12-06-2018T16-17 -Dpackaging=aar `
- remember to change file names as required in the above mvn install command

# To Read
- [Coding guidelines](https://github.com/evernym/ConnectMe/blob/master/docs/CODING_GUIDELINES.md)
- [Contributing guidelines](https://github.com/evernym/ConnectMe/blob/master/docs/CONTRIBUTING_GUIDELINES.MD)

## Tech stack used
- [React Native](https://facebook.github.io/react-native/)
- [React Navigation](http://reactnavigation.org)
- [Redux](http://redux.js.org)
- [Redux Saga](https://redux-saga.js.org)
- [Flow](http://flow.org/)
- [Jest](https://facebook.github.io/jest/)
- [Yarn](http://yarnpkg.com)
- [Cocoa pods](http://cocoadocs.org)

## Run functional automated test

- Ensure that Node version greater than 8.5.0 and less than 9 is installed. We recommend using `nvm` to install node
- `$ brew tap wix/brew && brew install applesimutils`
- `$ npm i -g detox-cli`
- Ensure that iphone 7 simulator is installed and running
- Ensure that iphone 7 simulator has hardware keyboard disconnected. `Hardware -> Keyboard -> Un check 'Connect Hardware Keyboard'`
- `$ npm run test:e2e:build && npm run test:e2e`

> If you get an error in logs saying that `image not found`. Run `$ detox clean-framework-cache && detox build-framework-cache`, then run last command in above steps

## IDE
- You may use any IDE you feel more comfortable with.
- Our preferred IDE would be "VS Code" with extensions like
  - Prettier - Code formatter (esbenp.prettier-vscode)
  - VS Code ES7 React/Redux/React-Native/JS snippets
  - Code Spell Checker (streetsidesoftware.code-spell-checker)
  - Better Comments (aaron-bond.better-comments)
  - Path Autocomplete (ionutvmi.path-autocomplete)

# Makefile
- If you want to run the iOS or android emulators from a terminal without the need for
the Xcode or Android Studio IDE then you can use the Makefile (this is how Norman runs
the iOS and android emulator on his MacBook). The commands to setup
your environment for the Makefile are:
  - export PATH=$PWD/node_modules/.bin:$PATH
  - make clean
  - make pre-run
  - For iOS: SIMULATOR="iPhone 7" make run-ios
  - For Android: Start the android emulator in a separate terminal with
  - RUST_BACKTRACE=1 /Users/norm/Library/Android/sdk/emulator/emulator -writable-system -avd Pixel_API_26 -netdelay none -netspeed full
  - Then run the app in a separate terminal with: make run-android or VARIANT=release make run-android or VARIANT=debug make run-android

# Things to improve

- [ ] Hydration needs to replace whole store. As of now it just changes few values in config store
- [ ] Need to save whole store in keychain and implement proper hydration
- [ ] Show loader when user accept/reject invitation
- [ ] Need to consider scenario if user has not allowed permission for push notification or user disable the permission
- [ ] We need to communicate to user on why we need push notification permission
- [ ] Connections key should be remote DID and not user identifier
- [ ] Remove passing newConnection while saving new connection
- [ ] Save whole payload in connection instead of choosing selected props in connection store

# Frequently Encountered Problems (FEP)

## Unit test

- *Problem*: `Invariant Violation: Native module cannot be null.`. *Solution*: You are missing the mocks for native module. Open `<rootDir>/__mocks__/setup.js` and create a mock for native module which is throwing error. You can check which native module is throwing error from call stack printed in terminal

## iOS Simulator keyboard issue

- *Problem*" `The iOS simulator does not take input from my MacBook Pro keyboard`. *Workaround*: A temporary
workaround is to disconnect the hardward keyboard with the Shift+Cmd+K key combination (via the menu it is Hardware ->
Keyboard -> Connect Hardware Keyboard to unselect that option). Then only using the menu Hardware -> Shake Gesture will
bring up the React Native Developer Menu and then you select the Reload option from the React Native Developer Menu
and then the software keyboard will come up and allow you to use the mouse to input characters. After a while you can
try to re-enable The MacBook Pro keyboard but if it still fails then use this workaround again.

## Android OPENSSL Issue
- On Android https calls to the webserver will result in _verify failed_ error. This is because of the known issue in openssl crate in rust https://github.com/seanmonstar/reqwest/issues/70 . 
  - Workaround: Download the cacert.pem from the here https://curl.haxx.se/ca/cacert.pem . Push the cert to the device to a accessbile location (like sd card `SSL_CERT_FILE=/sdcard/cacert.pem`) so that the rust binary can access the cert.
  - As of the cacert.pem is a part of assets in android app and is created in createOneTimeInfo()