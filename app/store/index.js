import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import logger from 'redux-logger'
import user, { watchUserInfo } from './user-store'
import pushNotification from './push-notification-store'
import connections, { watchNewConnection } from './connections-store'
import config, { watchConfig } from './config-store'
import invitation, { watchInvitation } from '../invitation/invitation-store'
import deepLink from '../deep-link/deep-link-store'
import route from './route-store'
import { watchAppHydration } from './hydration-store'
import qrConnection, {
  watchQrConnection,
} from '../qr-connection-request/qr-connection-request-store'
import lock, { watchLock } from '../lock/lock-store'
import smsConnection, {
  watchSMSConnectionSagas,
} from '../sms-connection-request/sms-connection-request-store'
import claimOffer from '../claim-offer/claim-offer-store'

const sagaMiddleware = createSagaMiddleware()

const appReducer = combineReducers({
  config,
  connections,
  deepLink,
  invitation,
  pushNotification,
  qrConnection,
  route,
  smsConnection,
  user,
  lock,
  claimOffer,
})

let middlewares = []

if (process.env.NODE_ENV !== 'test') {
  // skip logger middleware if we are running tests
  middlewares.push(logger)
}

middlewares.push(sagaMiddleware)

const store = createStore(appReducer, applyMiddleware(...middlewares))

sagaMiddleware.run(function*() {
  return yield all([
    watchNewConnection(),
    watchUserInfo(),
    watchConfig(),
    watchInvitation(),
    watchAppHydration(),
    watchQrConnection(),
    watchLock(),
    watchSMSConnectionSagas(),
  ])
})

export * from './user-store'
export * from './push-notification-store'
export * from './connections-store'
export * from './config-store'
export * from './route-store'
export * from './hydration-store'
export * from '../invitation/invitation-store'
export * from '../deep-link/deep-link-store'
export * from '../qr-connection-request/qr-connection-request-store'
export * from '../lock/lock-store'
export * from '../sms-connection-request/sms-connection-request-store'
export * from '../claim-offer/claim-offer-store'

// make default export as the store
export default store
