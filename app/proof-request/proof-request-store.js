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
  SEND_PROOF_STATUS,
  PROOF_REQUEST_SHOWN,
} from './type-proof-request'
import type {
  AdditionalDataPayload,
  NotificationPayloadInfo,
} from '../push-notification/type-push-notification'

const proofRequestInitialState = {}

export const proofRequestReceived = (
  payload: AdditionalDataPayload,
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
          proofStatus: SEND_PROOF_STATUS.NONE,
        },
      }
    default:
      return state
  }
}
