import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import user, { watchUserInfo } from "./user-store";
import connections, { watchLoadConnections } from "./connections-store";

const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
  user,
  connections
});

const store = createStore(appReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(function*() {
  return yield all([watchLoadConnections(), watchUserInfo()]);
});

export * from "./user-store";
export * from "./connections-store";

// make default export as the store
export default store;
