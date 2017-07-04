import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import logger from 'redux-logger'
import user, { watchUserInfo, watchSendUserInfo } from './user-store'
import pushNotification from './push-notification-store'
import connections, { watchLoadConnections } from './connections-store'
import config, { watchConfig } from './config-store'
import home, { watchEnrollUser } from '../home/home-store'
import invitation, { watchInvitation } from '../invitation/invitation-store'
import deepLink from '../deep-link/deep-link-store'

const sagaMiddleware = createSagaMiddleware()

const appReducer = combineReducers({
  user,
  pushNotification,
  connections,
  invitation,
  home,
  config,
  deepLink,
})

const store = createStore(appReducer, applyMiddleware(logger, sagaMiddleware))

sagaMiddleware.run(function*() {
  return yield all([
    watchLoadConnections(),
    watchUserInfo(),
    watchEnrollUser(),
    watchSendUserInfo(),
    watchConfig(),
    watchInvitation(),
  ])
})

export * from './user-store'
export * from './push-notification-store'
export * from './connections-store'
export * from './config-store'
export * from '../invitation/invitation-store'
export * from '../home/home-store'
export * from '../deep-link/deep-link-store'

// make default export as the store
export default store
