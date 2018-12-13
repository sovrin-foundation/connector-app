# ConnectMe
App to connect Sovrin with 3rd party authentication

# Introduction

We have an ongoing effort to build and run the Connector App, then make it interoperable with the hyperledger Indy open source protocols. 

* [Building the Connector App Q&A Video](https://youtu.be/EHrlqku3OC8)
  
# Pre requisite to run

- Mac machine
- XCode 9
- Node 8+. Preferred way to install node is via [nvm](https://www.sitepoint.com/quick-tip-multiple-versions-node-nvm/)
- [React native setup](http://facebook.github.io/react-native/docs/getting-started.html). Use tab `Building Projects with Native Code`.
- Ruby
- Make sure `pod` (1.5.3) is installed or run `sudo gem install cocoapods -v 1.5.3`
- Android Studio 3+

# Steps to run

- Clone this repository with `SSH`
- `yarn` or `yarn install`
- `yarn start`

## Run on ios simulator
- `yarn pod:dev:install`
- `yarn react-native run-ios`

## Run ios on device
- Do not use XCode automatic code signing
- `cd ios/fastlane`
- `sudo gem install bundle`
- `bundle install`
- Make sure you get added to the connectme-callcenter-certs repo so that the following command is successful --
git clone 'git@github.com:evernym/connectme-callcenter-certs.git' '/var/folders/dt/sk594jpn40d0097bpg17gwc40000gn/T/d20180705-10510-lw9oue'
- To get the development release certificates do `bundle exec fastlane match development`. DO NOT use `--force` with this command.
- You'll be prompted to enter 2 passwords. Slack a contributor for credentials
- Open Xcode, select your device and run

## Run on Android simulator
### Manual steps
- Make sure a simulator is already created. Otherwise create one from Android studio
- `cd android/keystores && keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000`
- `yarn react-native run-android`

### By using scripts
- Run `android/scripts/generate.key.sh` one time to generate keystore
- Run `android/scripts/android.build.sh` to build android apk

## Create a release build for ios
- `yarn pod:install`
- To get the beta release certificates do `bundle exec fastlane match adhoc`
- You'll be prompted to enter 2 passwords. Slack a contributor for what those are.
- Make sure that the ios/ConnectMe/Info.plist, ios/ConnectMeTests/Info.plist, ios/ConnectMe-tvOS/Info.plist, ios/ConnectMe-tvOSTests/Info.plist,  have their CFBundleVersion <string> set to the NEXT build number
- Make sure that the ios/ConnectMe.xcodeproj/project.pbxproj has it's 2 CURRENT_PROJECT_VERSION attributes set to the NEXT build number
- To get releasable .ipa launch Xcode and open the ios/ConnectMe.xcworkspace project
- Select the "Generic iOS Device"
- Then run Product -> Archive
- After it is done then login to hockeyapp.net and click on QA ConnectMe and then click add version button and upload it

## For android local Release build

- add my_keystore.jks file to ~/keystores folder
If you get this error during the ` bitrise run android ` build then you are missing the my_keystore.jks file
What went wrong:
Execution failed for task ':app:validateSigningRelease'.
> Keystore file /Users/norm/keystores/my_keystore.jks not found for signing config 'release'.
- ask your team members for .bitrise.secrets.yml file and place it in directory with bitrise.yml file
- run ` brew install bitrise && bitrise setup `
- Make sure that the android/app/build.gradle has it's versionCode attribute set to the PREVIOUS build number (be aware that a failed "bitrise run android" will STILL increment the number and so you will need to decrement it back to the PREVIOUS build number after a failure)
- run ` bitrise run android `
- If you get this error then rm -rf node_modules and re-run ` bitrise run android `
What went wrong:
Failed to capture snapshot of input files for task ':app:bundleReleaseJsAndAssets' property '$1' during up-to-date check.
> Could not list contents of '/Users/norm/forge/work/code/evernym/ConnectMe/node_modules/jest-runtime/node_modules/babel-core/node_modules/.bin/babylon'. Couldn't follow symbolic link.
- run ` brew install maven `
- download the vcx.aar file
- later run ` mvn install:install-file -Dfile=com.evernym-vcx_1.0.0-12-06-2018T16-17_x86-armv7-release.aar -DgroupId=com.evernym -DartifactId=vcx -Dversion=1.0.0-12-06-2018T16-17 -Dpackaging=aar `
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

## iOS build issue

- *Problem*: `third-party/glog-0.3.4/src/base/mutex.h 'config.h' file not found`. *Solution*: https://github.com/facebook/react-native/issues/16097. Basically from the ConnectMe toplevel source code directory do 1) cd node_modules/react-native/third-party/glog-0.3.4/ && ../../scripts/ios-configure-glog.sh