// // @flow
// import { Sentry, SentryLog } from 'react-native-sentry'

// // Configure install to add error handler
// const originalSentryInstall = Sentry.install
// Sentry.install = () => {
//   const result = originalSentryInstall()
//   configureSentryErrorHandler()
//   return result
// }

// function configureSentryErrorHandler() {
//   let sentryErrorHandler =
//     // $FlowFixMe ErrorUtils is global variable
//     (ErrorUtils.getGlobalHandler && ErrorUtils.getGlobalHandler()) ||
//     ErrorUtils._globalHandler

//   ErrorUtils.setGlobalHandler((error, isFatal) => {
//     console.log('is fatal, ', isFatal)
//     sentryErrorHandler(error, isFatal)
//   })
// }

// Sentry.config('https://66b7fcd2ca4943c6b7dfcc956ec5e2bf@sentry.io/188725', {
//   logLevel: SentryLog.None,
//   disableNativeIntegration: true,
// }).install()

// export default Sentry
