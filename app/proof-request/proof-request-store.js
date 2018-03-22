// @flow
import { put, takeLatest, call, select, all } from 'redux-saga/effects'
import type { CustomError } from '../common/type-common'
import type {
  ProofRequestStore,
  ProofRequestAction,
  ProofRequestShownAction,
  SendProofSuccessAction,
  SendProofFailAction,
  SendProofAction,
  ProofRequestIgnoredAction,
  ProofRequestRejectedAction,
  ProofRequestAcceptedAction,
  ProofRequestPayload,
  AdditionalProofDataPayload,
  MissingAttribute,
  SelfAttestedAttributes,
  MissingAttributes,
} from './type-proof-request'

import {
  getUserPairwiseDid,
  getAgencyUrl,
  getProof,
  getProofRequestPairwiseDid,
  getUserOneTimeInfo,
  getAgencyVerificationKey,
  getRemotePairwiseDidAndName,
  getPoolConfig,
} from '../store/store-selector'
import {
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_STATUS,
  PROOF_STATUS,
  PROOF_REQUEST_SHOWN,
  PROOF_REQUEST_IGNORED,
  PROOF_REQUEST_ACCEPTED,
  PROOF_REQUEST_REJECTED,
  PROOF_REQUEST_AUTO_FILL,
  SEND_PROOF,
  SEND_PROOF_SUCCESS,
  SEND_PROOF_FAIL,
  MISSING_ATTRIBUTES_FOUND,
} from './type-proof-request'
import type {
  NotificationPayloadInfo,
  Attribute,
} from '../push-notification/type-push-notification'
import { sendMessage } from '../bridge/react-native-cxs/RNCxs'
import type { Connection } from '../store/type-connection-store'
import type { UserOneTimeInfo } from '../store/user/type-user-store'
import { MESSAGE_TYPE } from '../api/api-constants'
import { RESET } from '../common/type-common'

const proofRequestInitialState = {}

export const ignoreProofRequest = (uid: string): ProofRequestIgnoredAction => ({
  type: PROOF_REQUEST_IGNORED,
  uid,
})
export const rejectProofRequest = (
  uid: string
): ProofRequestRejectedAction => ({
  type: PROOF_REQUEST_REJECTED,
  uid,
})
export const acceptProofRequest = (
  uid: string
): ProofRequestAcceptedAction => ({
  type: PROOF_REQUEST_ACCEPTED,
  uid,
})
export const proofRequestShown = (uid: string): ProofRequestShownAction => ({
  type: PROOF_REQUEST_SHOWN,
  uid,
})
export const sendProof = (uid: string): SendProofAction => ({
  type: SEND_PROOF,
  uid,
})
export const sendProofSuccess = (uid: string): SendProofSuccessAction => ({
  type: SEND_PROOF_SUCCESS,
  uid,
})

export const sendProofFail = (
  uid: string,
  error: CustomError
): SendProofFailAction => ({
  type: SEND_PROOF_FAIL,
  error,
  uid,
})

export function convertMissingAttributeListToObject(
  missingAttributes: Array<MissingAttribute>
): MissingAttributes {
  return missingAttributes.reduce(
    (selfAttestedAttributes, missingAttribute: MissingAttribute) => ({
      ...selfAttestedAttributes,
      [missingAttribute.name.toLocaleLowerCase()]: {
        name: missingAttribute.name,
        data: '',
        key: missingAttribute.key,
      },
    }),
    {}
  )
}

export const missingAttributesFound = (
  missingAttributeList: MissingAttribute[],
  uid: string
) => ({
  type: MISSING_ATTRIBUTES_FOUND,
  missingAttributes: convertMissingAttributeListToObject(missingAttributeList),
  uid,
})

export function* watchProofRequestAccepted(): Generator<*, *, *> {
  yield takeLatest(PROOF_REQUEST_ACCEPTED, proofAccepted)
}

export function* proofAccepted(
  action: ProofRequestAcceptedAction
): Generator<*, *, *> {
  const remoteDid: string = yield select(getProofRequestPairwiseDid, action.uid)
  const userPairwiseDid: string | null = yield select(
    getUserPairwiseDid,
    remoteDid
  )

  if (userPairwiseDid) {
    // set status that we are generating and sending proof
    yield put(sendProof(action.uid))
    try {
      const agencyUrl: string = yield select(getAgencyUrl)
      const poolConfig: string = yield select(getPoolConfig)
      const messageId: string = action.uid
      const payload = yield select(getProof, messageId)
      const proof = {
        ...payload,
        remoteDid,
        userPairwiseDid,
      }
      const agencyVerificationKey: string = yield select(
        getAgencyVerificationKey
      )
      const connection: Connection = yield select(
        getRemotePairwiseDidAndName,
        userPairwiseDid
      )
      const userOneTimeInfo: UserOneTimeInfo = yield select(getUserOneTimeInfo)

      const url = `${agencyUrl}/agency/msg`
      try {
        const sendProofStatus = yield call(sendMessage, {
          url,
          messageType: MESSAGE_TYPE.PROOF,
          messageReplyId: messageId,
          message: JSON.stringify(proof),
          myPairwiseDid: connection.myPairwiseDid,
          myPairwiseVerKey: connection.myPairwiseVerKey,
          myPairwiseAgentDid: connection.myPairwiseAgentDid,
          myPairwiseAgentVerKey: connection.myPairwiseAgentVerKey,
          myOneTimeAgentDid: userOneTimeInfo.myOneTimeAgentDid,
          myOneTimeAgentVerKey: userOneTimeInfo.myOneTimeAgentVerificationKey,
          myOneTimeDid: userOneTimeInfo.myOneTimeDid,
          myOneTimeVerKey: userOneTimeInfo.myOneTimeVerificationKey,
          myAgencyVerKey: agencyVerificationKey,
          myPairwisePeerVerKey: connection.myPairwisePeerVerKey,
          poolConfig,
        })
        yield put(sendProofSuccess(action.uid))
      } catch (e) {
        yield put(sendProofFail(action.uid, e))
      }
    } catch (e) {
      yield put(sendProofFail(action.uid, e))
    }
  } else {
    yield put(
      sendProofFail(action.uid, {
        code: 'OCS-002',
        message: 'No pairwise connection found',
      })
    )
  }
}

export const proofRequestAutoFill = (
  uid: string,
  requestedAttributes: Array<Attribute>
) => ({
  type: PROOF_REQUEST_AUTO_FILL,
  uid,
  requestedAttributes,
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

    case PROOF_REQUEST_AUTO_FILL:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          data: {
            ...state[action.uid].data,
            requestedAttributes: [...action.requestedAttributes],
          },
        },
      }

    case SEND_PROOF:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          proofStatus: PROOF_STATUS.SENDING_PROOF,
        },
      }

    case SEND_PROOF_SUCCESS:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          proofStatus: PROOF_STATUS.SEND_PROOF_SUCCESS,
        },
      }

    case SEND_PROOF_FAIL:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          proofStatus: PROOF_STATUS.SEND_PROOF_FAIL,
        },
      }

    case MISSING_ATTRIBUTES_FOUND:
      return {
        ...state,
        [action.uid]: {
          ...state[action.uid],
          missingAttributes: action.missingAttributes,
        },
      }
    case RESET:
      return proofRequestInitialState
    default:
      return state
  }
}
