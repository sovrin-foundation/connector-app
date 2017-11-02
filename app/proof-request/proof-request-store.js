// @flow
import { put, takeLatest, call, all } from 'redux-saga/effects'
import type { ClaimOfferNotificationPayload as NotificationPayload } from '../claim-offer/type-claim-offer'
import type {
  ProofRequestStore,
  FetchProofRequestAction,
  ProofRequestAction,
} from './type-proof-request'
import {
  FETCH_PROOF_REQUEST,
  FETCH_PROOF_REQUEST_ERROR,
  PROOF_REQUEST_RECEIVED,
} from './type-proof-request'
import type { CustomError } from '../common/type-common'

const proofRequestInitialState = {
  payload: {
    ['CRM2M28']: {
      proofRequest: {
        name: 'Home Address',
        version: '1.0.8',
        revealedAttributes: [
          {
            label: 'Address 1',
          },
          {
            label: 'Address 2',
          },
          {
            label: 'City',
          },
          {
            label: 'State',
          },
          {
            label: 'ZIP',
          },
        ],
      },
      issuer: {
        name: 'Suncoast Financial Partners',
        logoUrl: 'https://agency-ea.evernym.com/agent/profile/logo',
        pairwiseDID: 'N6NW54s9a85iyZpc4Z8pkq',
      },
      statusMessage: 'message pending',
    },
  },
  isPristine: true,
  isFetching: false,
  error: null,
}

export const fetchProofRequest = () => ({
  type: FETCH_PROOF_REQUEST,
})

export const fetchProofRequestError = (error: CustomError) => ({
  type: FETCH_PROOF_REQUEST,
  error,
})

export function* proofRequestFetching(
  action: FetchProofRequestAction
): Generator<*, *, *> {
  try {
    yield put(proofRequestReceived(proofRequestInitialState.payload))
  } catch (e) {
    yield put(
      fetchProofRequestError({
        code: 'OCS-000',
        message: 'Invalid proof request payload',
      })
    )
  }
}

export const proofRequestReceived = (proofRequestData: any) => ({
  type: FETCH_PROOF_REQUEST,
  proofRequestData,
})

function* watchFetchProofRequest(): Generator<*, *, *> {
  yield takeLatest(FETCH_PROOF_REQUEST, proofRequestFetching)
}

export function* watchProofRequest(): Generator<*, *, *> {
  yield all([watchFetchProofRequest()])
}

export default function proofRequestReducer(
  state: ProofRequestStore = proofRequestInitialState,
  action: ProofRequestAction
) {
  switch (action.type) {
    case FETCH_PROOF_REQUEST:
      return {
        ...state,
        isPristine: false,
        isFetching: true,
      }
    case FETCH_PROOF_REQUEST_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      }
    case PROOF_REQUEST_RECEIVED:
      return {
        ...state,
        payload: action.payload,
        isFetching: false,
      }
    default:
      return state
  }
}
