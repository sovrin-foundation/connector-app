// @flow
import { put, takeLatest, call, all } from 'redux-saga/effects'
import type { CustomError } from '../common/type-common'
import type {
  ProofRequestStore,
  ProofRequestAction,
} from './type-proof-request'

import {
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_STATUS,
  PROOF_STATUS,
  PROOF_REQUEST_SHOWN,
  PROOF_REQUEST_IGNORED,
  PROOF_REQUEST_ACCEPTED,
  PROOF_REQUEST_REJECTED,
} from './type-proof-request'
import type {
  AdditionalProofDataPayload,
  NotificationPayloadInfo,
} from '../push-notification/type-push-notification'

const proofRequestInitialState = {}

export const ignoreProofRequest = (uid: string) => ({
  type: PROOF_REQUEST_IGNORED,
  uid,
})
export const rejectProofRequest = (uid: string) => ({
  type: PROOF_REQUEST_REJECTED,
  uid,
})
export const acceptProofRequest = (uid: string) => ({
  type: PROOF_REQUEST_ACCEPTED,
  uid,
})
export const proofRequestShown = (uid: string) => ({
  type: PROOF_REQUEST_SHOWN,
  uid,
})

export const proofRequestReceived = (
  payload: AdditionalProofDataPayload,
  payloadInfo: NotificationPayloadInfo
) => ({
  type: PROOF_REQUEST_RECEIVED,
  payload,
  payloadInfo,
})
export default function proofRequestReducer(
  state: ProofRequestStore = proofRequestInitialState,
  action: ProofRequestAction
) {
  switch (action.type) {
    case PROOF_REQUEST_RECEIVED:
      return {
        ...state,
        [action.payloadInfo.uid]: {
          ...action.payload,
          ...action.payloadInfo,
          status: PROOF_REQUEST_STATUS.RECEIVED,
          proofStatus: PROOF_STATUS.NONE,
        },
      }
    case PROOF_REQUEST_SHOWN:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.SHOWN,
        },
      }
    case PROOF_REQUEST_ACCEPTED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.ACCEPTED,
          proofStatus: PROOF_STATUS.SEND_PROOF_SUCCESS,
        },
      }
    case PROOF_REQUEST_IGNORED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.IGNORED,
        },
      }
    case PROOF_REQUEST_REJECTED:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          status: PROOF_REQUEST_STATUS.REJECTED,
        },
      }
    default:
      return state
  }
}
