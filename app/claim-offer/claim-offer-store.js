// @flow
import {
  put,
  takeLatest,
  take,
  race,
  call,
  all,
  select,
  takeEvery,
  fork,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { Platform } from 'react-native'
import {
  CLAIM_OFFER_STATUS,
  CLAIM_OFFER_RECEIVED,
  CLAIM_OFFER_SHOWN,
  CLAIM_OFFER_ACCEPTED,
  CLAIM_OFFER_REJECTED,
  SEND_CLAIM_REQUEST,
  CLAIM_REQUEST_SUCCESS,
  CLAIM_REQUEST_FAIL,
  CLAIM_OFFER_IGNORED,
  CLAIM_REQUEST_STATUS,
  ADD_SERIALIZED_CLAIM_OFFER,
  CLAIM_OFFERS,
  SAVE_CLAIM_OFFERS_SUCCESS,
  SAVE_CLAIM_OFFERS_FAIL,
  ERROR_SAVE_CLAIM_OFFERS,
  REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS,
  REMOVE_SERIALIZED_CLAIM_OFFERS_FAIL,
  HYDRATE_CLAIM_OFFERS_SUCCESS,
  HYDRATE_CLAIM_OFFERS_FAIL,
  ERROR_HYDRATE_CLAIM_OFFERS,
  ERROR_NO_SERIALIZED_CLAIM_OFFER,
  ERROR_SEND_CLAIM_REQUEST,
  INSUFFICIENT_BALANCE,
  SEND_PAID_CREDENTIAL_REQUEST,
  PAID_CREDENTIAL_REQUEST_SUCCESS,
  PAID_CREDENTIAL_REQUEST_FAIL,
  CLAIM_OFFER_SHOW_START,
  RESET_CLAIM_REQUEST_STATUS,
} from './type-claim-offer'
import type {
  ClaimOfferStore,
  ClaimOfferAction,
  ClaimOfferShownAction,
  ClaimOfferAcceptedAction,
  ClaimOfferResponse,
  ClaimOfferPayload,
  AddSerializedClaimOfferAction,
  SerializedClaimOffer,
} from './type-claim-offer'
import type {
  AdditionalDataPayload,
  NotificationPayloadInfo,
} from '../push-notification/type-push-notification'
import type { CustomError } from '../common/type-common'
import {
  getAgencyUrl,
  getClaimOffer,
  getUserPairwiseDid,
  getUserOneTimeInfo,
  getAgencyVerificationKey,
  getRemotePairwiseDidAndName,
  getPoolConfig,
  getClaimOffers,
  getConnection,
  getSerializedClaimOffer,
  getWalletBalance,
} from '../store/store-selector'
import type { IndyClaimOffer } from '../bridge/react-native-cxs/type-cxs'
import {
  getHandleBySerializedConnection,
  getClaimHandleBySerializedClaimOffer,
  serializeClaimOffer,
  getClaimOfferState,
  sendClaimRequest as sendClaimRequestApi,
} from '../bridge/react-native-cxs/RNCxs'
import type { IndyClaimRequest } from '../bridge/react-native-cxs/type-cxs'
import { CLAIM_STORAGE_FAIL, CLAIM_STORAGE_SUCCESS } from '../claim/type-claim'
import { CLAIM_STORAGE_ERROR } from '../services/error/error-code'
import { MESSAGE_TYPE } from '../api/api-constants'
import type { ApiClaimRequest, EdgeClaimRequest } from '../api/type-api'
import type { UserOneTimeInfo } from '../store/user/type-user-store'
import type { Connection } from '../store/type-connection-store'
import { RESET } from '../common/type-common'
import { secureSet, secureGet, secureDelete } from '../services/storage'
import { BigNumber } from 'bignumber.js'
import { refreshWalletBalance } from '../wallet/wallet-store'
import type {
  ClaimStorageSuccessAction,
  ClaimStorageFailAction,
} from '../claim/type-claim'

const claimOfferInitialState = {
  vcxSerializedClaimOffers: {},
}

// TODO:PS: data structure for claim offer received should be flat
// It should not have only payload
// Merge payload and payloadInfo
export const claimOfferReceived = (
  payload: AdditionalDataPayload,
  payloadInfo: NotificationPayloadInfo
) => ({
  type: CLAIM_OFFER_RECEIVED,
  payload,
  payloadInfo,
})

// this action is used because we don't want to show claim offer again to user
// we set claim offer status as shown, so another code path doesn't show it
export const claimOfferShown = (uid: string) => ({
  type: CLAIM_OFFER_SHOWN,
  uid,
})

export const claimOfferIgnored = (uid: string) => ({
  type: CLAIM_OFFER_IGNORED,
  uid,
})

export const claimOfferRejected = (uid: string) => ({
  type: CLAIM_OFFER_REJECTED,
  uid,
})

export const sendClaimRequest = (uid: string, payload: ClaimOfferPayload) => ({
  type: SEND_CLAIM_REQUEST,
  uid,
  payload,
})

export const claimRequestSuccess = (uid: string) => ({
  type: CLAIM_REQUEST_SUCCESS,
  uid,
})

export const claimRequestFail = (uid: string, error: CustomError) => ({
  type: CLAIM_REQUEST_FAIL,
  error,
  uid,
})

export const inSufficientBalance = (uid: string) => ({
  type: INSUFFICIENT_BALANCE,
  uid,
})

export const sendPaidCredentialRequest = (
  uid: string,
  payload: ClaimOfferPayload
) => ({
  type: SEND_PAID_CREDENTIAL_REQUEST,
  uid,
  payload,
})

export const paidCredentialRequestSuccess = (uid: string) => ({
  type: PAID_CREDENTIAL_REQUEST_SUCCESS,
  uid,
})

export const paidCredentialRequestFail = (uid: string) => ({
  type: PAID_CREDENTIAL_REQUEST_FAIL,
  uid,
})

export const acceptClaimOffer = (uid: string) => ({
  type: CLAIM_OFFER_ACCEPTED,
  uid,
})

export function convertClaimRequestToEdgeClaimRequest(
  claimRequest: ApiClaimRequest
): EdgeClaimRequest {
  const { blinded_ms, schema_seq_no, issuer_did } = claimRequest

  return {
    blinded_ms,
    issuer_did,
    schema_seq_no,
    msg_type: MESSAGE_TYPE.CLAIM_REQUEST,
    // hard coded version as of now, update once versioning is implemented
    version: '0.1',
    to_did: claimRequest.remoteDid,
    from_did: claimRequest.userPairwiseDid,
    tid: '1',
    mid: '1',
  }
}

export function* claimOfferAccepted(
  action: ClaimOfferAcceptedAction
): Generator<*, *, *> {
  const messageId = action.uid
  const claimOfferPayload: ClaimOfferPayload = yield select(
    getClaimOffer,
    messageId
  )
  const payTokenAmount = new BigNumber(claimOfferPayload.payTokenValue || '0')
  const isPaidCredential = payTokenAmount.isGreaterThan(0)
  const remoteDid = claimOfferPayload.remotePairwiseDID
  const [connection]: Connection[] = yield select(getConnection, remoteDid)
  const vcxSerializedClaimOffer: SerializedClaimOffer | null = yield select(
    getSerializedClaimOffer,
    connection.identifier,
    messageId
  )

  if (!vcxSerializedClaimOffer) {
    yield put(
      claimRequestFail(messageId, ERROR_NO_SERIALIZED_CLAIM_OFFER(messageId))
    )

    return
  }

  try {
    if (isPaidCredential) {
      const walletBalance: string = yield select(getWalletBalance)
      const balanceAmount = new BigNumber(walletBalance)
      if (balanceAmount.isLessThan(payTokenAmount)) {
        yield put(inSufficientBalance(messageId))
        return
      }
      yield put(sendPaidCredentialRequest(messageId, claimOfferPayload))
    } else {
      yield put(sendClaimRequest(messageId, claimOfferPayload))
    }
    // since these two api calls are independent, we can call them in parallel
    // but result of both calls are needed before we can move on with other logic
    // so we wait here till both calls are done
    const [connectionHandle, claimHandle] = yield all([
      call(getHandleBySerializedConnection, connection.vcxSerializedConnection),
      call(
        getClaimHandleBySerializedClaimOffer,
        vcxSerializedClaimOffer.serialized
      ),
    ])

    // TODO We don't have any payment handle as of now, so hard code to 0
    const paymentHandle = 0

    yield call(
      sendClaimRequestApi,
      claimHandle,
      connectionHandle,
      paymentHandle
    )

    if (isPaidCredential) {
      // if we are able to send claim request successfully,
      // then we can raise an action to show that we have sent claim request
      // so that our history middleware can record this event
      // it also means payment was successful and we can show success to user in modal
      yield put(sendClaimRequest(messageId, claimOfferPayload))
      yield put(paidCredentialRequestSuccess(messageId))
      yield put(refreshWalletBalance())
    }

    // since we have sent claim request, state of claim offer in vcx is changed
    // so we need to update stored serialized claim offer in store
    // update serialized state in background
    yield call(
      saveSerializedClaimOffer,
      claimHandle,
      connection.identifier,
      messageId
    )
    // now the updated claim offer is secure stored now we can update claim request
  } catch (e) {
    if (isPaidCredential) {
      yield put(paidCredentialRequestFail(messageId))
    } else {
      yield put(
        claimRequestFail(messageId, ERROR_SEND_CLAIM_REQUEST(e.message))
      )
    }
  }
}

function* claimStorageSuccessSaga(
  action: ClaimStorageSuccessAction
): Generator<*, *, *> {
  const { messageId } = action
  yield put(claimRequestSuccess(messageId))
}

export function* watchClaimStorageSuccess(): any {
  yield takeEvery(CLAIM_STORAGE_SUCCESS, claimStorageSuccessSaga)
}

function* claimStorageFailSaga(
  action: ClaimStorageFailAction
): Generator<*, *, *> {
  const { messageId } = action
  yield put(claimRequestFail(messageId, CLAIM_STORAGE_ERROR()))
}

export function* watchClaimStorageFail(): any {
  yield takeEvery(CLAIM_STORAGE_FAIL, claimStorageFailSaga)
}

export function* saveSerializedClaimOffer(
  claimHandle: number,
  userDID: string,
  messageId: string
): Generator<*, *, *> {
  try {
    const [serializedClaimOffer, claimOfferVcxState]: [
      string,
      number,
    ] = yield all([
      call(serializeClaimOffer, claimHandle),
      call(getClaimOfferState, claimHandle),
    ])
    yield put(
      addSerializedClaimOffer(
        serializedClaimOffer,
        userDID,
        messageId,
        claimOfferVcxState
      )
    )
  } catch (e) {
    // TODO:KS need to think about what happens when serialize call from vcx fails
  }
}

function* watchClaimOfferAccepted(): any {
  yield takeEvery(CLAIM_OFFER_ACCEPTED, claimOfferAccepted)
}

export const addSerializedClaimOffer = (
  serializedClaimOffer: string,
  userDID: string,
  messageId: string,
  claimOfferVcxState: number
) => ({
  type: ADD_SERIALIZED_CLAIM_OFFER,
  serializedClaimOffer,
  userDID,
  messageId,
  claimOfferVcxState,
})

export function* watchAddSerializedClaimOffer(): any {
  //save claimOffers as well or rename to save ClaimOfferSaga
  yield takeEvery(
    [
      ADD_SERIALIZED_CLAIM_OFFER,
      CLAIM_OFFER_RECEIVED,
      SEND_CLAIM_REQUEST,
      CLAIM_OFFER_SHOWN,
    ],
    saveClaimOffersSaga
  )
}

export function* saveClaimOffersSaga(
  action: AddSerializedClaimOfferAction
): Generator<*, *, *> {
  try {
    const claimOffers = yield select(getClaimOffers)
    yield call(secureSet, CLAIM_OFFERS, JSON.stringify(claimOffers))
    yield put({
      type: SAVE_CLAIM_OFFERS_SUCCESS,
    })
  } catch (e) {
    yield put({
      type: SAVE_CLAIM_OFFERS_FAIL,
      error: ERROR_SAVE_CLAIM_OFFERS(e.message),
    })
  }
}

export function* removePersistedSerializedClaimOffersSaga(): Generator<
  *,
  *,
  *
> {
  try {
    yield call(secureDelete, CLAIM_OFFERS)
    yield put({
      type: REMOVE_SERIALIZED_CLAIM_OFFERS_SUCCESS,
    })
  } catch (e) {
    yield put({
      type: REMOVE_SERIALIZED_CLAIM_OFFERS_FAIL,
    })
  }
}

export function* hydrateClaimOffersSaga(): Generator<*, *, *> {
  try {
    const claimOffersJson = yield call(secureGet, CLAIM_OFFERS)
    if (claimOffersJson) {
      const serializedClaimOffers = JSON.parse(claimOffersJson)
      yield put(hydrateClaimOffers(serializedClaimOffers))
    }
  } catch (e) {
    yield put({
      type: HYDRATE_CLAIM_OFFERS_FAIL,
      error: ERROR_HYDRATE_CLAIM_OFFERS(e.message),
    })
  }
}

export const hydrateClaimOffers = (claimOffers: ClaimOfferStore) => ({
  type: HYDRATE_CLAIM_OFFERS_SUCCESS,
  claimOffers,
})

export function* watchClaimOffer(): any {
  yield all([
    watchClaimOfferAccepted(),
    watchAddSerializedClaimOffer(),
    watchClaimStorageSuccess(),
    watchClaimStorageFail(),
  ])
}

export const claimOfferShowStart = (uid: string) => ({
  type: CLAIM_OFFER_SHOW_START,
  uid,
})

export const resetClaimRequestStatus = (uid: string) => ({
  type: RESET_CLAIM_REQUEST_STATUS,
  uid,
})

export default function claimOfferReducer(
  state: ClaimOfferStore = claimOfferInitialState,
  action: ClaimOfferAction
) {
  switch (action.type) {
    case CLAIM_OFFER_RECEIVED:
      return {
        ...state,
        [action.payloadInfo.uid]: {
          ...action.payload,
          ...action.payloadInfo,
          status: CLAIM_OFFER_STATUS.RECEIVED,
          claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
          error: null,
        },
      }
    case CLAIM_OFFER_SHOWN:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: CLAIM_OFFER_STATUS.SHOWN,
        },
      }
    case CLAIM_OFFER_ACCEPTED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: CLAIM_OFFER_STATUS.ACCEPTED,
        },
      }
    case CLAIM_OFFER_IGNORED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: CLAIM_OFFER_STATUS.IGNORED,
        },
      }
    case CLAIM_OFFER_REJECTED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: CLAIM_OFFER_STATUS.REJECTED,
        },
      }
    case SEND_CLAIM_REQUEST:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          claimRequestStatus: CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST,
        },
      }
    case CLAIM_REQUEST_SUCCESS:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          claimRequestStatus: CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS,
        },
      }
    case CLAIM_REQUEST_FAIL:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          claimRequestStatus: CLAIM_REQUEST_STATUS.CLAIM_REQUEST_FAIL,
        },
      }
    case INSUFFICIENT_BALANCE:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          claimRequestStatus: CLAIM_REQUEST_STATUS.INSUFFICIENT_BALANCE,
        },
      }
    case SEND_PAID_CREDENTIAL_REQUEST:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          claimRequestStatus:
            CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST,
        },
      }
    case PAID_CREDENTIAL_REQUEST_SUCCESS:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          claimRequestStatus:
            CLAIM_REQUEST_STATUS.PAID_CREDENTIAL_REQUEST_SUCCESS,
        },
      }
    case PAID_CREDENTIAL_REQUEST_FAIL:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          claimRequestStatus: CLAIM_REQUEST_STATUS.PAID_CREDENTIAL_REQUEST_FAIL,
        },
      }
    case RESET:
      return claimOfferInitialState
    case ADD_SERIALIZED_CLAIM_OFFER:
      return {
        ...state,
        vcxSerializedClaimOffers: {
          ...state.vcxSerializedClaimOffers,
          [action.userDID]: {
            ...state.vcxSerializedClaimOffers[action.userDID],
            [action.messageId]: {
              serialized: action.serializedClaimOffer,
              state: action.claimOfferVcxState,
              messageId: action.messageId,
            },
          },
        },
      }
    case HYDRATE_CLAIM_OFFERS_SUCCESS:
      return action.claimOffers

    case CLAIM_OFFER_SHOW_START:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: CLAIM_OFFER_STATUS.RECEIVED,
          claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
        },
      }

    case RESET_CLAIM_REQUEST_STATUS:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
        },
      }
    default:
      return state
  }
}
