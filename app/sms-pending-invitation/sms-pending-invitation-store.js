// @flow
import {
  put,
  takeLatest,
  takeEvery,
  call,
  take,
  all,
  select,
} from 'redux-saga/effects'
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
  SAFE_TO_DOWNLOAD_SMS_INVITATION,
} from './type-sms-pending-invitation'
import { invitationDetailsRequest, getInvitationLink } from '../api/api'
import {
  ERROR_PENDING_INVITATION_RESPONSE_PARSE,
  ERROR_PENDING_INVITATION_RESPONSE_PARSE_CODE,
} from '../api/api-constants'
import {
  getAgencyUrl,
  getCurrentScreen,
  getHydrationState,
} from '../store/store-selector'
import { invitationReceived } from '../invitation/invitation-store'
import {
  HYDRATED,
  UNSAFE_SCREENS_TO_DOWNLOAD_SMS,
} from '../store/type-config-store'
import { RESET } from '../common/type-common'

const initialState = {}

export const getSmsPendingInvitation = (smsToken: string) => ({
  type: SMS_PENDING_INVITATION_REQUEST,
  smsToken,
})

export const smsPendingInvitationReceived = (
  smsToken: string,
  data: SMSPendingInvitationPayload
) => ({
  type: SMS_PENDING_INVITATION_RECEIVED,
  data,
  smsToken,
})

export const smsPendingInvitationFail = (
  smsToken: string,
  error: CustomError
) => ({
  type: SMS_PENDING_INVITATION_FAIL,
  smsToken,
  error,
})

export const smsPendingInvitationSeen = (smsToken: string) => ({
  type: SMS_PENDING_INVITATION_SEEN,
  smsToken,
})

// Below action tells that now user can't change the environment
// and so whatever environment we have available now, we can go ahead and
// start downloading SMS invitation from that environment
export const safeToDownloadSmsInvitation = () => ({
  type: SAFE_TO_DOWNLOAD_SMS_INVITATION,
})

export const convertSmsPayloadToInvitation = (
  pendingInvitation: SMSPendingInvitationPayload
): InvitationPayload => ({
  senderEndpoint: pendingInvitation.senderAgencyDetail.endpoint,
  requestId: pendingInvitation.connReqId,
  senderAgentKeyDelegationProof:
    pendingInvitation.senderDetail.agentKeyDlgProof,
  senderName: pendingInvitation.senderDetail.name,
  senderDID: pendingInvitation.senderDetail.DID,
  senderLogoUrl: pendingInvitation.senderDetail.logoUrl,
  senderVerificationKey: pendingInvitation.senderDetail.verKey,
  targetName: pendingInvitation.targetName,
  senderAgencyDetail: pendingInvitation.senderAgencyDetail,
  senderDetail: pendingInvitation.senderDetail,
})

export function* callSmsPendingInvitationRequest(
  action: SMSPendingInvitationRequestAction
): Generator<*, *, *> {
  // we wait to download SMS invitation till we know that we are safe
  // because user can still change the environment and point to something else
  // to download sms invitation from updated environment
  // if a user is gone past lock selection screen, then we know we are safe
  // or user has already setup lock and is now coming for second SMS invitation
  // or user is not on one of these screens
  // splash screen, lock selection, dev environment switch
  const currentScreen: string = yield select(getCurrentScreen)
  if (UNSAFE_SCREENS_TO_DOWNLOAD_SMS.indexOf(currentScreen) > -1) {
    // user is on screens where he has chance to change environment details
    // so we wait for event which tells that we are safe
    yield take(SAFE_TO_DOWNLOAD_SMS_INVITATION)
  }

  // if we reach this point, that means either user was not on some unsafe screen
  // or we waited till safe action was raised, either way
  // we can now go ahead and start downloading SMS invitation

  // I lied a bit in above statement that we can start downloading SMS now
  // there is one more scenario that we need to consider before we can start
  // downloading sms, this saga can also be triggered if user already has an app
  // and user switched environments while setting up the app first time
  // so now we need to maintain switched environment for the lifetime of app
  // so we store those environment details in phone storage and
  // hydrate them when app is killed and started again
  // now, when user starts the app second time, user's updated config
  // might still not be fetched or app is not fully hydrated yet,
  // so, we wait for app to be hydrated if not already hydrated
  const isAppHydrated: boolean = yield select(getHydrationState)
  if (!isAppHydrated) {
    yield take(HYDRATED)
  }

  // now we are sure that user can't change the environment for first time app
  // and also we are sure that if user did update the environment first time
  // then we have got the updated config
  // and now, we can go ahead and start downloading SMS pending invitation

  const agencyUrl: string = yield select(getAgencyUrl)
  const { smsToken } = action

  try {
    // get invitation link
    // TODO:KS Handle error for this API, all business logic and API related
    const invitationLink: { url: string } = yield call(getInvitationLink, {
      agencyUrl,
      smsToken,
    })

    // get pending invitation
    // TODO:KS Handle error for this API, all business logic and API related
    const pendingInvitationPayload = yield call(invitationDetailsRequest, {
      url: invitationLink.url,
    })

    yield put(
      invitationReceived({
        payload: convertSmsPayloadToInvitation(pendingInvitationPayload),
      })
    )
    yield put(smsPendingInvitationReceived(smsToken, pendingInvitationPayload))
  } catch (e) {
    let error: CustomError = {
      code: ERROR_PENDING_INVITATION_RESPONSE_PARSE_CODE,
      message: ERROR_PENDING_INVITATION_RESPONSE_PARSE,
    }

    try {
      error = JSON.parse(e.message)
    } catch (e) {}

    yield put(smsPendingInvitationFail(smsToken, error))
  }
}

function* watchSmsPendingInvitationRequest(): any {
  yield takeEvery(
    SMS_PENDING_INVITATION_REQUEST,
    callSmsPendingInvitationRequest
  )
}

export function* watchSmsPendingInvitationSaga(): any {
  yield all([watchSmsPendingInvitationRequest()])
}

export default function smsPendingInvitationReducer(
  state: SMSPendingInvitationStore = initialState,
  action: SMSPendingInvitationAction
) {
  switch (action.type) {
    case SMS_PENDING_INVITATION_REQUEST:
      if (state[action.smsToken] !== undefined) {
        return state
      } else {
        return {
          ...state,
          [action.smsToken]: {
            payload: null,
            isFetching: true,
            status: SMSPendingInvitationStatus.NONE,
            error: null,
          },
        }
      }

    case SMS_PENDING_INVITATION_RECEIVED:
      return {
        ...state,
        [action.smsToken]: {
          ...state[action.smsToken],
          isFetching: false,
          payload: action.data,
          status: SMSPendingInvitationStatus.RECEIVED,
        },
      }

    case SMS_PENDING_INVITATION_FAIL:
      return {
        ...state,
        [action.smsToken]: {
          ...state[action.smsToken],
          payload: null,
          isFetching: false,
          error: action.error,
          status: SMSPendingInvitationStatus.FETCH_FAILED,
        },
      }

    case SMS_PENDING_INVITATION_SEEN:
      if (action.smsToken) {
        return {
          ...state,
          [action.smsToken]: {
            ...state[action.smsToken],
            status: SMSPendingInvitationStatus.SEEN,
          },
        }
      } else {
        return state
      }

    case RESET:
      return initialState

    default:
      return state
  }
}
