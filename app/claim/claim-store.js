// @flow

import { put, takeLatest, call, all } from 'redux-saga/effects'
import type {
  Claim,
  ClaimStore,
  ClaimAction,
  ClaimReceivedAction,
  ClaimStorageFailAction,
  ClaimStorageSuccessAction,
} from './type-claim'
import {
  CLAIM_RECEIVED,
  CLAIM_STORAGE_FAIL,
  CLAIM_STORAGE_SUCCESS,
} from './type-claim'
import type { CustomError } from '../common/type-common'
import { addClaim } from '../bridge/react-native-cxs/RNCxs'
import { CLAIM_STORAGE_ERROR } from '../services/error/error-code'

export const claimReceived = (claim: Claim): ClaimReceivedAction => ({
  type: CLAIM_RECEIVED,
  claim,
})

export const claimStorageSuccess = (
  messageId: string
): ClaimStorageSuccessAction => ({
  type: CLAIM_STORAGE_SUCCESS,
  messageId,
})

export const claimStorageFail = (
  messageId: string,
  error: CustomError
): ClaimStorageFailAction => ({
  type: CLAIM_STORAGE_FAIL,
  messageId,
  error,
})

export function* claimReceivedSaga(
  action: ClaimReceivedAction
): Generator<*, *, *> {
  try {
    yield call(addClaim, JSON.stringify(action.claim))
    yield put(claimStorageSuccess(action.claim.messageId))
  } catch (e) {
    // we got error while saving claim in wallet, what to do now?
    yield put(claimStorageFail(action.claim.messageId, CLAIM_STORAGE_ERROR(e)))
  }
}

export function* watchClaimReceived(): Generator<*, *, *> {
  yield takeLatest(CLAIM_RECEIVED, claimReceivedSaga)
}

export function* watchClaim(): Generator<*, *, *> {
  yield all([watchClaimReceived()])
}

const initialState = {}

export default function claimReducer(
  state: ClaimStore = initialState,
  action: ClaimAction
) {
  switch (action.type) {
    case CLAIM_RECEIVED:
      return {
        ...state,
        [action.claim.messageId]: {
          claim: action.claim,
        },
      }

    case CLAIM_STORAGE_FAIL:
      return {
        ...state,
        [action.messageId]: {
          ...state[action.messageId],
          error: action.error,
        },
      }

    case CLAIM_STORAGE_SUCCESS: {
      const { [action.messageId]: deleted, ...newState } = state
      return newState
    }

    default:
      return state
  }
}
