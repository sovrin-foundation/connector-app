import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all } from 'redux-saga/effects'
import logger from 'redux-logger'
import user, { watchUserInfo } from './user-store'
import connections, { watchLoadConnections } from './connections-store'
import invitation from '../invitation/invitation-store'
import home from '../home/home-store'

const sagaMiddleware = createSagaMiddleware()

const appReducer = combineReducers({
  user,
  connections,
  invitation,
  home,
})

const store = createStore(appReducer, applyMiddleware(logger, sagaMiddleware))

sagaMiddleware.run(function*() {
  return yield all([watchLoadConnections(), watchUserInfo()])
})

export * from './user-store'
export * from './connections-store'
export * from '../invitation/invitation-store'
export * from '../home/home-store'

// make default export as the store
export default store
