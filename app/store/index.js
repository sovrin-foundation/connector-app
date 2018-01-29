import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import logger from 'redux-logger'
import user, { watchUserStore } from './user/user-store'
import pushNotification, {
  watchPushNotification,
} from '../push-notification/push-notification-store'
import connections, { watchNewConnection } from './connections-store'
import config, { watchConfig } from './config-store'
import authentication, {
  watchAuthentication,
} from '../authentication/authentication-store'
import deepLink from '../deep-link/deep-link-store'
import route from './route-store'
import lock, {
  watchLock,
  watchPressEventInLockSelectionScreen,
  watchEnableTouchId,
  watchDisableTouchId,
} from '../lock/lock-store'
import smsPendingInvitation, {
  watchSmsPendingInvitationSaga,
} from '../sms-pending-invitation/sms-pending-invitation-store'
import claimOffer, { watchClaimOffer } from '../claim-offer/claim-offer-store'
import proofRequest, {
  watchProofRequestAccepted,
} from '../proof-request/proof-request-store'
import invitation, { watchInvitation } from '../invitation/invitation-store'
import claim, { watchClaim } from '../claim/claim-store'
import proof, { watchProof } from '../proof/proof-store'
import history, {
  watchConnectionHistory,
} from '../connection-history/connection-history-store'
import historyRecorder from '../connection-history/history-middleware'

const sagaMiddleware = createSagaMiddleware()

const appReducer = combineReducers({
  config,
  connections,
  deepLink,
  authentication,
  pushNotification,
  route,
  smsPendingInvitation,
  user,
  lock,
  claimOffer,
  proofRequest,
  invitation,
  claim,
  proof,
  history,
})

let middlewares = [historyRecorder]

if (process.env.NODE_ENV !== 'test') {
  // skip logger middleware if we are running tests
  middlewares.push(logger)
}

middlewares.push(sagaMiddleware)

const store = createStore(appReducer, applyMiddleware(...middlewares))

sagaMiddleware.run(function*() {
  return yield all([
    watchNewConnection(),
    watchConfig(),
    watchAuthentication(),
    watchLock(),
    watchSmsPendingInvitationSaga(),
    watchClaimOffer(),
    watchPushNotification(),
    watchInvitation(),
    watchClaim(),
    watchPressEventInLockSelectionScreen(),
    watchEnableTouchId(),
    watchDisableTouchId(),
    watchProof(),
    watchProofRequestAccepted(),
    watchConnectionHistory(),
    watchUserStore(),
  ])
})

export * from '../push-notification/push-notification-store'
export * from './connections-store'
export * from '../connection-history/connection-history-store'
export * from './config-store'
export * from './route-store'
export * from './hydration-store'
export * from '../authentication/authentication-store'
export * from '../deep-link/deep-link-store'
export * from '../lock/lock-store'
export * from '../sms-pending-invitation/sms-pending-invitation-store'
export * from '../claim-offer/claim-offer-store'
export * from '../proof-request/proof-request-store'
export * from '../proof/proof-store'
export * from '../invitation/invitation-store'

// make default export as the store
export default store
