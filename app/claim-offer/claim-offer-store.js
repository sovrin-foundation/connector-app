// @flow
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import {
  CLAIM_OFFER_STATUS,
  FETCH_CLAIM_OFFER,
  FETCH_CLAIM_OFFER_ERROR,
  CLAIM_OFFER_RECEIVED,
  CLAIM_OFFER_SHOWN,
  CLAIM_OFFER_ACCEPTED,
  CLAIM_OFFER_REJECTED,
  SEND_CLAIM_REQUEST,
  CLAIM_REQUEST_SUCCESS,
  CLAIM_REQUEST_FAIL,
  CLAIM_OFFER_IGNORED,
  CLAIM_REQUEST_STATUS,
} from './type-claim-offer'
import type {
  ClaimOfferStore,
  ClaimOfferAction,
  ClaimOfferShownAction,
  ClaimOfferPayload,
  ClaimOfferAcceptedAction,
  FetchClaimOfferAction,
  ClaimOfferResponse,
  ClaimOfferNotificationPayload,
} from './type-claim-offer'
import type { CustomError } from '../common/type-common'
import { getAgencyUrl } from '../store/store-selector'
import { pushNotificationReceived } from '../store/push-notification-store'
import {
  fetchClaimOfferRequest,
  PAYLOAD_TYPE,
  claimOfferPayloadMapper,
} from '../services'

const claimOfferInitialState = {
  status: CLAIM_OFFER_STATUS.IDLE,
  payload: undefined,
  claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
  isPristine: true,
  isFetching: false,
  error: null,
}

export const fetchClaimOffer = (
  notificationPayload: ClaimOfferNotificationPayload
) => ({
  type: FETCH_CLAIM_OFFER,
  notificationPayload,
})

export const fetchClaimOfferError = (error: CustomError) => ({
  type: FETCH_CLAIM_OFFER_ERROR,
  error,
})

export function* claimOfferFetching(
  action: FetchClaimOfferAction
): Generator<*, *, *> {
  const agencyUrl: string = yield select(getAgencyUrl)
  const { forDID, uid, type } = action.notificationPayload
  try {
    const claimOfferResponse: ClaimOfferResponse = yield call(
      fetchClaimOfferRequest,
      {
        agencyUrl,
        dataBody: {
          to: forDID,
          agentPayload: JSON.stringify({
            uid,
            type: PAYLOAD_TYPE.GET_MESSAGE,
            includeEdgePayload: 'Y',
          }),
        },
      }
    )

    try {
      const parsedData = JSON.parse(claimOfferResponse.msgs[0].edgeAgentPayload)
      const claimOfferStatusMsg = claimOfferResponse.msgs[0].statusMsg

      const claimOfferData: ClaimOfferPayload = claimOfferPayloadMapper(
        parsedData,
        claimOfferStatusMsg
      )
      yield put(claimOfferReceived(claimOfferData))
      yield put(pushNotificationReceived({ forDID, uid, type }))
    } catch (e) {
      put(fetchClaimOfferError(e))
    }
  } catch (e) {
    yield put(
      fetchClaimOfferError({
        code: 'OCS-000',
        message: 'Invalid claim offer payload',
      })
    )
  }
}

function* watchFetchClaimOffer() {
  yield takeLatest(FETCH_CLAIM_OFFER, claimOfferFetching)
}

export const claimOfferReceived = (payload: ClaimOfferPayload) => ({
  type: CLAIM_OFFER_RECEIVED,
  payload,
})

// this action is used because we don't want to show claim offer again to user
// we set claim offer status as shown, so another code path doesn't show it
export const claimOfferShown = () => ({
  type: CLAIM_OFFER_SHOWN,
})

export const claimOfferIgnored = () => ({
  type: CLAIM_OFFER_IGNORED,
})

export const claimOfferRejected = () => ({
  type: CLAIM_OFFER_REJECTED,
})

export const sendClaimRequest = () => ({
  type: SEND_CLAIM_REQUEST,
})

export const claimRequestSuccess = () => ({
  type: CLAIM_REQUEST_SUCCESS,
})

export const claimRequestFail = () => ({
  type: CLAIM_REQUEST_FAIL,
})

export const acceptClaimOffer = () => ({
  type: CLAIM_OFFER_ACCEPTED,
})

export function* claimOfferAccepted(
  action: ClaimOfferAcceptedAction
): Generator<*, *, *> {
  yield put(sendClaimRequest())
  yield call(delay, 2000)
  yield put(claimRequestSuccess())
}

function* watchClaimOfferAccepted() {
  yield takeLatest(CLAIM_OFFER_ACCEPTED, claimOfferAccepted)
}

export function* watchClaimOffer(): Generator<*, *, *> {
  yield all([watchFetchClaimOffer(), watchClaimOfferAccepted()])
}

export default function claimOfferReducer(
  state: ClaimOfferStore = claimOfferInitialState,
  action: ClaimOfferAction
) {
  switch (action.type) {
    case FETCH_CLAIM_OFFER:
      return {
        ...state,
        isPristine: false,
        isFetching: true,
      }
    case FETCH_CLAIM_OFFER_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case CLAIM_OFFER_RECEIVED:
      return {
        ...state,
        status: CLAIM_OFFER_STATUS.RECEIVED,
        payload: action.payload,
        claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
        isFetching: false,
      }
    case CLAIM_OFFER_SHOWN:
      return {
        ...state,
        status: CLAIM_OFFER_STATUS.SHOWN,
      }
    case CLAIM_OFFER_ACCEPTED:
      return {
        ...state,
        status: CLAIM_OFFER_STATUS.ACCEPTED,
      }
    case CLAIM_OFFER_IGNORED:
      return {
        ...state,
        status: CLAIM_OFFER_STATUS.IGNORED,
      }
    case CLAIM_OFFER_REJECTED:
      return {
        ...state,
        status: CLAIM_OFFER_STATUS.REJECTED,
      }
    case SEND_CLAIM_REQUEST:
      return {
        ...state,
        claimRequestStatus: CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST,
      }
    case CLAIM_REQUEST_SUCCESS:
      return {
        ...state,
        claimRequestStatus: CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS,
      }
    case CLAIM_REQUEST_FAIL:
      return {
        ...state,
        claimRequestStatus: CLAIM_REQUEST_STATUS.CLAIM_REQUEST_FAIL,
      }
    default:
      return state
  }
}
