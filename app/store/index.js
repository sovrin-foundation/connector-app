import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import logger from 'redux-logger'
import user, { watchUserInfo, watchSendUserInfo } from './user-store'
import pushNotification from './pushNotification-store'
import connections, { watchLoadConnections } from './connections-store'
import invitation, { watchAuthRequest } from '../invitation/invitation-store'
import config, { watchConfig } from './config-store'
import home, { watchEnrollUser } from '../home/home-store'

const sagaMiddleware = createSagaMiddleware()

const appReducer = combineReducers({
  user,
  pushNotification,
  connections,
  invitation,
  home,
  config,
})

const store = createStore(appReducer, applyMiddleware(logger, sagaMiddleware))

sagaMiddleware.run(function*() {
  return yield all([
    watchLoadConnections(),
    watchUserInfo(),
    watchEnrollUser(),
    watchSendUserInfo(),
    watchAuthRequest(),
    watchConfig(),
  ])
})

export * from './user-store'
export * from './pushNotification-store'
export * from './connections-store'
export * from './config-store'
export * from '../invitation/invitation-store'
export * from '../home/home-store'

// make default export as the store
export default store
