// @flow
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import type {
  Claim,
  ClaimStore,
  ClaimAction,
  ClaimReceivedAction,
  ClaimStorageFailAction,
  ClaimStorageSuccessAction,
  MapClaimToSenderAction,
  ClaimMap,
  HydrateClaimMapAction,
  HydrateClaimMapFailAction,
} from './type-claim'
import {
  CLAIM_RECEIVED,
  CLAIM_STORAGE_FAIL,
  CLAIM_STORAGE_SUCCESS,
  MAP_CLAIM_TO_SENDER,
  HYDRATE_CLAIM_MAP,
  HYDRATE_CLAIM_MAP_FAIL,
  ERROR_CLAIM_HYDRATE_FAIL,
} from './type-claim'
import type { CustomError } from '../common/type-common'
import { addClaim, getClaim } from '../bridge/react-native-cxs/RNCxs'
import { CLAIM_STORAGE_ERROR } from '../services/error/error-code'
import { getConnectionLogoUrl, getPoolConfig } from '../store/store-selector'
import { setItem, getItem } from '../services/secure-storage'
import { CLAIM_MAP } from '../common/secure-storage-constants'
import { RESET } from '../common/type-common'

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
    const { claim: { from_did: senderDID, forDID: myPairwiseDid } } = action
    const poolConfig: string = yield select(getPoolConfig)
    const claimFilterJSON: string = yield call(
      addClaim,
      JSON.stringify(action.claim),
      poolConfig
    )
    yield put(claimStorageSuccess(action.claim.messageId))
    const claimString = yield call(getClaim, claimFilterJSON, poolConfig)
    const { claim_uuid: claimUuid } = JSON.parse(claimString)
    const logoUrl = yield select(getConnectionLogoUrl, senderDID)
    yield put(mapClaimToSender(claimUuid, senderDID, myPairwiseDid, logoUrl))

    // persist claimMap to secure storage
    // TODO:PS: replace with fork redux-effect
    let claimMap = yield call(getItem, CLAIM_MAP)
    claimMap = claimMap ? JSON.parse(claimMap) : {}

    Object.assign(claimMap, {
      [claimUuid]: {
        senderDID,
        myPairwiseDid,
        logoUrl,
      },
    })

    yield call(setItem, CLAIM_MAP, JSON.stringify(claimMap))
  } catch (e) {
    // we got error while saving claim in wallet, what to do now?
    yield put(claimStorageFail(action.claim.messageId, CLAIM_STORAGE_ERROR(e)))
  }
}

export const mapClaimToSender = (
  claimUuid: string,
  senderDID: string,
  myPairwiseDID: string,
  logoUrl: string
): MapClaimToSenderAction => ({
  type: MAP_CLAIM_TO_SENDER,
  claimUuid,
  senderDID,
  myPairwiseDID,
  logoUrl,
})

export const hydrateClaimMap = (claimMap: ClaimMap) => ({
  type: HYDRATE_CLAIM_MAP,
  claimMap,
})

export const hydrateClaimMapFail = (error: CustomError) => ({
  type: HYDRATE_CLAIM_MAP_FAIL,
  error,
})

export function* hydrateClaimMapSaga(): Generator<*, *, *> {
  try {
    const fetchedClaimMap = yield call(getItem, CLAIM_MAP)
    if (fetchedClaimMap) {
      const claimMap: ClaimMap = JSON.parse(fetchedClaimMap)
      yield put(hydrateClaimMap(claimMap))
    }
  } catch (e) {
    yield put(
      hydrateClaimMapFail({
        code: ERROR_CLAIM_HYDRATE_FAIL.code,
        message: `${ERROR_CLAIM_HYDRATE_FAIL.message}:${e.message}`,
      })
    )
  }
}

export function* watchClaimReceived(): any {
  yield takeLatest(CLAIM_RECEIVED, claimReceivedSaga)
}

export function* watchClaim(): Generator<*, *, *> {
  yield all([watchClaimReceived()])
}

const initialState = { claimMap: {} }

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

    case MAP_CLAIM_TO_SENDER:
      const { claimUuid, senderDID, myPairwiseDID, logoUrl } = action
      return {
        ...state,
        claimMap: {
          ...state.claimMap,
          [claimUuid]: {
            senderDID,
            myPairwiseDID,
            logoUrl,
          },
        },
      }

    case HYDRATE_CLAIM_MAP:
      return {
        ...state,
        claimMap: action.claimMap,
      }

    case RESET:
      return initialState

    default:
      return state
  }
}
