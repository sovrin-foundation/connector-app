## General introduction

This app is written using react-native. Most of UI and business logic is written in JavaScript. Unit tests are written using Jest. For type checking we are using Flow. To better handle business logic, redux and redux-saga is used. There are other libraries as well that we have used for different purposes and those can be checked in package.json

## Folder structure

### `app` folder

- Each folder inside `app` folder can be corresponded to a feature. So folder named `backup` should contain all UI, business logic related to backup. All unit tests, and types related to backup should be inside backup folder. Same goes for other folders as well.
- There are few folders which are exception to above rule. For example: `components` folder. This folder contains common UI components that are shared among different screens. For example: a button, date, header, Keyboard, etc.
- General rule is that if we develop a new feature then it should have it's own folder inside `app` folder. All tests, types, UI, business logic, state changes, everything should be inside of the same folder.
- If we are creating some UI component that would be used at at least two different features, i.e. cross feature folders, then that UI component should be placed inside `components` folder. If we have a component that is used only inside a feature, but among different screens of a feature, then that component should be placed inside feature folder and not inside `components` folder. So, if we create a settings view, and there are three screens inside settings view, and all those screens share a common header. We would want to make a common component for Header. But we won't put Header inside components folder, because this is used only inside one feature. So, header component should named settings-header, and should be placed inside settings feature folder.
- `app` folder contains most of the code for application UI and business logic.
- app.js is the file that can be considered as an entry point to our app. Inside this file we create redux-store, define structure for our whole app navigation. This is the file where we handle Deep Linking, Push Notification, Offline handler etc. This file should include those components/features are not restricted to a specific screen or activated by some specific screen. Features that are written on included in this file are supposed to be run throughout all screens, they may or may not have a UI and could be considered a service running in background only inside the app
- navigator.js: We are using react-navigation v2 to handle navigation in our app. This file contains almost all screens that are present in our app. There are few other screens that are not inside navigator.js, and they are present in their own separate navigator. For example: settings.js has it's own navigator, and has two more screens inside of it.
- store: This is folder that combines all features state/data into single place for redux-store. People not familiar with store, they can consider it to be database of app. Each part of this store, can be considered a database table. This is place which runs our history middleware. This is the place that runs our Sagas (not define), which handles our business logic.
- splash-screen.js: We need to know about this file, because this is the file which is responsible for making decision that which screen to load at app start, and should we show lock screen or not, and if yes, then which lock screen needs to be displayed, either pin or fingerprint etc. This file also handles deep linking, and allows user to click on an SMS link, and open invitation screen with that SMS link invitation. We know this file should have been named something different and should have been placed at some different place. We will do that some time later.

### `android` folder

- This is a standard folder structure for an Android app or a standard folder structure that comes with any react-native app.
- There is one important file that we need to take notice is `RNIndyModule.java`. This is the file that acts a bridge between JavaScript and Java. This file calls APIs that are exposed by libVcx and libIndy binaries for Android. We use this extensively for communicating with sovrin ledger and with agency.

### `ios` folder

- Same folder structure that we get with any react-native app for ios. One extra thing that we use on top of existing react-native is the cocoapod. We use cocoapod to manage dependencies that are specific to ios. For example: libvcx binary is compiled into a cocoapod to distribute, and that's how it is included into this app via cocoapod.
- Whenever we open this project inside Xcode, workspace file should be used to open it, and not project file
- One important file to note in this folder is `RNIndy.m`. This file contains all external APIs that can be called from this app. These API has calls which interact with libVcx, libIndy, sovrin ledger and agency.

## Communication with Agency and Ledger

We have talking about communication with agency, ledger, libVcx and libIndy. Let us look into bit more detail on how it happens. Before understanding how it happens, let us look into different things that we need to support.

- Agency is the backend that handles peer-to-peer communication. And agency needs messages that conform to a standard, and encrypted in a certain way and then transmitted in a message pack binary format.
- Communication with sovrin ledger, happens over curve zmq, and also needs special format for messages.
- There are several protocols, that handles how a connection should be established, what types encryption should be used, how user gets credential, how user gets proof request, how user gets a proof, how an issuer can issue a credential, etc. So, there are protocols which are generic and has their own rules.

Now, looking on above requirements, there can be two approaches that we can take. One is that we can implement all of that inside react-native app. Another, we can write a generic library that can be called from any language. We have taken second approach and wrote few libraries such as libIndy, libVcx in Rust language. Here is step by step process of including these libraries inside this app.

- libIndy, libvcx are written in Rust
- These libraries are compiled to c-callable for each platform. For example: For android a single binary libvcx.so is generated that has all architecture that Android supports. So, a single binary that has x86, x86_64, arm v7, arm64, armeabi
- Once these binaries are generated we write code in each respective language and call them wrapper. These wrappers just provide an interface for same language so that don't have to call binaries functions by themselves and they can call a function just like they could call from their language's library. For example: For Android, we have written a wrapper in Java for libvcx, that calls libvcx.so binary's functions using JNA. For ios, we can directly call c-callable functions, but needs so c-compatible data type conversions. So, we have written same wrapper in Objective-C as well, so developers don't have to do that conversion as well.
- Once we have a wrapper and a binary for each platform. All that is left is to package them into a single file. So, we package android related files into an aar, and ios related files into a cocoapod
- This app specifies aar as dependency inside build.gradle, and inside Podfile for cocoapod on ios.

Now, we have these libraries available in Java and Objective-C. But our app is written in JavaScript. How do we call Java and Objective-C methods from JavaScript. Here is the step by step process:

- Remember two files in above section that we asked to note, `RNIndyModule.java`, and `RNIndy.m`. These are the files that acts a bridge between JavaScript and Java/Objective-C. These files exposes a promise/future based interface to JavaScript and talks to aar and cocoapod in their native language
- On JavaScript side as well, we have a file named `RNCxs.js` that acts a single point to call Java and Objective-C as per platform on this app would run and then gets the result from native side, and pass it to JavaScript side, and vice versa.
- Features inside this app, imports functions to call from `RNCxs.js`, and use them as normal JavaScript async function that does some job of either encryption, sending data to agency, to peer, to ledger or get from ledger, etc.

## Data persistence

- Data is persisted on device. None of user's data ever leave the device, until user decides to take an encrypted backup with a passphrase that user stores somewhere secretly.
- There are different libraries that can facilitate data persistence in redux based application. But we wanted more finer grained control. So, the way we persist data is by utilizing sagas which are generally named as `persist*`, `delete*`, `hydrate*`. `persist*` sagas, take care of create and update, `delete*` takes care of deleting data, and `hydrate*` takes care of loading data back into app when app is killed and started again.

## Tests

- Unit Tests are co-located with feature/folder. So, if we have a feature named `qr-code`, then it's tests would be inside `__tests__`, and for each file there would be a file that has `<feature>.spec.js`
- Unit tests are written using Jest
- Unit tests are run every time we push to git remote. This is done by git hooks

## Types

- Same as JavaScript community, we also discovered that having Types inside JavaScript yields lot many benefits that we don't need to write them here. So, we are using Flow to add types to our app
- Most of the type files starts with `type-*`
- We favor `types` instead of `interfaces`. There is no strong reason for that, we just found that UNION is much better with `types`, and we did not want to add cognitive load on developers to decided when to use what.

## CI/CD

- Our CI/CD is written using Fastlane. Most of the logic to generate an app binary comes from Fastlane.
- Version increment, commit of the incremented version back to git, upload of binary to app store, to hockeyapp, signing of binary, choosing certificate to sign that binary, choosing where to upload binary on the basis of branch that triggers the build. All these things are handled with Fastlane.
- These files can be found at `ios/fastlane/Fastfile` and `android/fastlane/Fastfile`


### Videos

<TBD>
