// @flow
import type { Middleware, MiddlewareAPI, Dispatch } from 'redux'
import { INVITATION_RECEIVED } from '../invitation/type-invitation'
import { NEW_CONNECTION_SUCCESS } from '../store/connections-store'
import { CLAIM_OFFER_RECEIVED } from '../claim-offer/type-claim-offer'
import {
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_AUTO_FILL,
} from '../proof-request/type-proof-request'
import {
  RECORD_HISTORY_EVENT,
  HISTORY_EVENT_STORAGE_KEY,
} from './type-connection-history'
import { historyEventOccurred } from './connection-history-store'
import { setItem } from '../services/secure-storage'

const actionToRecord = [
  INVITATION_RECEIVED,
  NEW_CONNECTION_SUCCESS,
  CLAIM_OFFER_RECEIVED,
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_AUTO_FILL,
]

// TODO:KS Fix any type using `redux` provided Generic Types
const history = (store: any) => (next: any) => (action: any) => {
  // pass on the action first to other middleware in line
  const nextState = next(action)

  // now go for our own history recorder
  if (actionToRecord.indexOf(action.type) > -1) {
    // we got an action that needs to be recorded
    // dispatch an action, that starts from beginning of middleware chain
    // we are dispatching a new action here
    store.dispatch(historyEventOccurred(action))
  }

  // if we get action to record history event
  // that means our history store is updated with data
  // we can now store history data to secure storage
  if (action.type === RECORD_HISTORY_EVENT) {
    setItem(
      HISTORY_EVENT_STORAGE_KEY,
      JSON.stringify(store.getState().history.data)
    )
  }

  return nextState
}

export default history
