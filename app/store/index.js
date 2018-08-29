// @flow
import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import logger from 'redux-logger'
import user, { watchUserStore } from './user/user-store'
import pushNotification, {
  watchPushNotification,
} from '../push-notification/push-notification-store'
import connections, { watchConnection } from './connections-store'
import config, { watchConfig, watchGetMessagesSaga } from './config-store'
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
  watchPersistProofRequests,
  watchProofRequestReceived,
} from '../proof-request/proof-request-store'
import invitation, { watchInvitation } from '../invitation/invitation-store'
import claim, { watchClaim } from '../claim/claim-store'
import proof, { watchProof } from '../proof/proof-store'
import history, {
  watchConnectionHistory,
} from '../connection-history/connection-history-store'
import historyRecorder from '../connection-history/history-middleware'
import wallet, { watchWalletStore } from '../wallet/wallet-store'
import eula, { watchEula } from '../eula/eula-store'
import restore, { watchRestore } from '../restore/restore-store'
import backup, { watchBackup } from '../backup/backup-store'
import { hydrate } from './hydration-store'

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
  wallet,
  eula,
  restore,
  backup,
})

let middlewares = [historyRecorder]

if (process.env.NODE_ENV !== 'test') {
  // skip logger middleware if we are running tests
  middlewares.push(logger)
}

middlewares.push(sagaMiddleware)

const store = createStore(appReducer, applyMiddleware(...middlewares))

// $FlowFixMe Don't know how to fix polymorphic type coercion
sagaMiddleware.run(function*() {
  return yield all([
    watchConnection(),
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
    watchWalletStore(),
    watchBackup(),
    watchEula(),
    watchRestore(),
    hydrate(),
    watchGetMessagesSaga(),
    watchPersistProofRequests(),
    watchProofRequestReceived(),
  ])
})

export default store
