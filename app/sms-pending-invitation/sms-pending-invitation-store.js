// @flow
import { put, takeLatest, call, all, select } from 'redux-saga/effects'
import type { CustomError } from '../common/type-common'
import type {
  SMSPendingInvitationStore,
  SMSPendingInvitationAction,
  SMSPendingInvitationStatusType,
  SMSPendingInvitationPayload,
  SMSPendingInvitationRequestAction,
} from './type-sms-pending-invitation'
import type { InvitationPayload } from '../invitation/type-invitation'
import {
  SMS_PENDING_INVITATION_REQUEST,
  SMS_PENDING_INVITATION_RECEIVED,
  SMS_PENDING_INVITATION_FAIL,
  SMS_PENDING_INVITATION_SEEN,
  SMSPendingInvitationStatus,
} from './type-sms-pending-invitation'
import { invitationDetailsRequest, getInvitationLink } from '../api/api'
import {
  ERROR_PENDING_INVITATION_RESPONSE_PARSE,
  ERROR_PENDING_INVITATION_RESPONSE_PARSE_CODE,
} from '../api/api-constants'
import { getAgencyUrl } from '../store/store-selector'
import { invitationReceived } from '../invitation/invitation-store'

const initialState = {
  payload: null,
  status: SMSPendingInvitationStatus.NONE,
  isFetching: false,
  error: null,
}

export const getSmsPendingInvitation = (smsToken: string) => ({
  type: SMS_PENDING_INVITATION_REQUEST,
  smsToken,
})

export const smsPendingInvitationReceived = (
  data: SMSPendingInvitationPayload
) => ({
  type: SMS_PENDING_INVITATION_RECEIVED,
  data,
})

export const smsPendingInvitationFail = (error: CustomError) => ({
  type: SMS_PENDING_INVITATION_FAIL,
  error,
})

export const smsPendingInvitationSeen = () => ({
  type: SMS_PENDING_INVITATION_SEEN,
})

export const convertSmsPayloadToInvitation = (
  pendingInvitation: SMSPendingInvitationPayload
): InvitationPayload => ({
  senderEndpoint: pendingInvitation.senderEndpoint,
  requestId: pendingInvitation.connReqId,
  senderAgentKeyDelegationProof: pendingInvitation.senderAgentKeyDlgProof,
  senderName: pendingInvitation.senderName,
  senderDID: pendingInvitation.senderDID,
  senderLogoUrl: pendingInvitation.senderLogoUrl,
  senderVerificationKey: pendingInvitation.senderDIDVerKey,
  targetName: pendingInvitation.targetName,
})

export function* callSmsPendingInvitationRequest(
  action: SMSPendingInvitationRequestAction
): Generator<*, *, *> {
  const agencyUrl: string = yield select(getAgencyUrl)
  const { smsToken } = action

  try {
    // get invitation link
    // TODO:KS Handle error for this API, all business logic and API related
    const invitationLink = yield call(getInvitationLink, {
      agencyUrl,
      smsToken,
    })

    // get pending invitation
    // TODO:KS Handle error for this API, all business logic and API related
    const pendingInvitationPayload = yield call(invitationDetailsRequest, {
      url: invitationLink.url,
    })
    yield put(smsPendingInvitationReceived(pendingInvitationPayload))
    yield put(
      invitationReceived({
        payload: convertSmsPayloadToInvitation(pendingInvitationPayload),
      })
    )
  } catch (e) {
    let error: CustomError = {
      code: ERROR_PENDING_INVITATION_RESPONSE_PARSE_CODE,
      message: ERROR_PENDING_INVITATION_RESPONSE_PARSE,
    }

    try {
      error = JSON.parse(e.message)
    } catch (e) {}

    yield put(smsPendingInvitationFail(error))
  }
}

function* watchSmsPendingInvitationRequest(): Generator<*, *, *> {
  yield takeLatest(
    SMS_PENDING_INVITATION_REQUEST,
    callSmsPendingInvitationRequest
  )
}

export function* watchSmsPendingInvitationSaga(): Generator<*, *, *> {
  yield all([watchSmsPendingInvitationRequest()])
}

export default function smsPendingInvitationReducer(
  state: SMSPendingInvitationStore = initialState,
  action: SMSPendingInvitationAction
) {
  switch (action.type) {
    case SMS_PENDING_INVITATION_REQUEST:
      return {
        ...state,
        payload: null,
        isFetching: true,
        status: SMSPendingInvitationStatus.NONE,
      }

    case SMS_PENDING_INVITATION_RECEIVED:
      return {
        ...state,
        isFetching: false,
        payload: action.data,
        status: SMSPendingInvitationStatus.RECEIVED,
      }

    case SMS_PENDING_INVITATION_FAIL:
      return {
        ...state,
        payload: null,
        isFetching: false,
        error: action.error,
        status: SMSPendingInvitationStatus.FETCH_FAILED,
      }

    case SMS_PENDING_INVITATION_SEEN:
      return {
        ...state,
        status: SMSPendingInvitationStatus.SEEN,
      }

    default:
      return state
  }
}
