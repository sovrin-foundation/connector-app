import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import logger from 'redux-logger'
import user, { watchUserInfo } from './user-store'
import pnStore from './pn-store'
import connections, { watchLoadConnections } from './connections-store'
import invitation, { watchAuthRequest } from '../invitation/invitation-store'
import home from '../home/home-store'
import {
  watchEnrollUser,
  watchPollAuthRequest,
  watchAppContext,
} from '../home/home-saga'
import secureStorageStore, { watchSecureStorage } from './secure-storage-store'

const sagaMiddleware = createSagaMiddleware()

const appReducer = combineReducers({
  user,
  pnStore,
  connections,
  invitation,
  home,
  secureStorageStore,
})

const store = createStore(appReducer, applyMiddleware(logger, sagaMiddleware))

sagaMiddleware.run(function*() {
  return yield all([
    watchLoadConnections(),
    watchUserInfo(),
    watchEnrollUser(),
    watchPollAuthRequest(),
    watchAppContext(),
    watchAuthRequest(),
    watchSecureStorage(),
  ])
})

export * from './user-store'
export * from './pn-store'
export * from './connections-store'
export * from './secure-storage-store'
export * from '../invitation/invitation-store'
export * from '../home/home-store'

// make default export as the store
export default store
