// @flow
import { INITIAL_TEST_ACTION } from '../common/type-common'
import type {
  CustomError,
  GenericObject,
  MessageAnnotation,
  TopicAnnotation,
} from '../common/type-common'
import type {
  ClaimProofNavigation,
  NotificationPayload,
  Attribute,
  NotificationPayloadInfo,
} from '../push-notification/type-push-notification'
import type { Proof } from '../proof/type-proof'
import type { ClaimMap } from '../claim/type-claim'

export type RequestedAttribute = {
  schema_seq_no?: number,
  issuer_did?: string,
  name: string,
}

export type RequestedPredicates = {
  attr_name: string,
  p_type: string,
  value: number,
  schema_seq_no?: number,
  issuer_did?: string,
}

export type ProofRequestData = {
  nonce: string,
  name: string,
  version: string,
  requested_attrs: {
    +[string]: RequestedAttribute,
  },
  requested_predicates?: ?{
    +[string]: RequestedPredicates,
  },
}

export type ProofRequestPushPayload = {
  '@type': MessageAnnotation,
  '@topic': TopicAnnotation,
  intended_use?: string,
  proof_request_data: ProofRequestData,
  remoteName: string,
}

export type ProofApiData = {
  requested: {
    +[string]: Array<string>,
  },
  remoteDid: string,
  userPairwiseDid?: string,
  claim_proofs: {
    +[string]: Array<string>,
  },
  aggregated_proof: string,
}

export type AdditionalProofData = {
  name: string,
  version: string,
  requestedAttributes: Array<Attribute>,
}

export type AdditionalProofDataPayload = {
  data: AdditionalProofData,
  requester: {
    name: string,
  },
  originalProofRequestData: ProofRequestData,
  statusMsg?: string,
}

export type ProofRequestAttributeListProp = {
  list: Array<Attribute>,
  claimMap?: ?ClaimMap,
}

export type ProofModalState = {
  isVisible: boolean,
}

export type ProofModalProps = {
  proofStatus: ProofStatus,
  name: string,
  title: string,
  logoUrl: string,
  onContinue: () => void,
}

export type ProofRequestPayload = AdditionalProofDataPayload & {
  status: ProofRequestStatus,
  proofStatus: ProofStatus,
  uid: string,
  senderLogoUrl?: ?string,
  remotePairwiseDID: string,
}

export type ProofRequestProps = {
  isValid: boolean,
  data: AdditionalProofData,
  logoUrl: string,
  proofStatus: ProofStatus,
  originalProofRequestData: ProofRequestData,
  remotePairwiseDID: string,
  name: string,
  ignoreProofRequest: (uid: string) => void,
  rejectProofRequest: (uid: string) => void,
  acceptProofRequest: (uid: string) => void,
  proofRequestShown: (uid: string) => void,
  getProof: (
    // originalProofRequestData: ProofRequestData,
    // remoteDid: string,
    uid: string
  ) => void,
  uid: string,
  navigation: ClaimProofNavigation,
  proofGenerationError?: ?CustomError,
  claimMap?: ?ClaimMap,
}

export const PROOF_REQUEST_RECEIVED = 'PROOF_REQUEST_RECEIVED'
export type ProofRequestReceivedAction = {
  type: typeof PROOF_REQUEST_RECEIVED,
  payload: AdditionalProofDataPayload,
  payloadInfo: NotificationPayloadInfo,
}

export const PROOF_REQUEST_STATUS = {
  IDLE: 'IDLE',
  RECEIVED: 'RECEIVED',
  SHOWN: 'SHOWN',
  ACCEPTED: 'ACCEPTED',
  IGNORED: 'IGNORED',
  REJECTED: 'REJECTED',
}

export const PROOF_STATUS = {
  NONE: 'NONE',
  SENDING_PROOF: 'SENDING_PROOF',
  SEND_PROOF_FAIL: 'SEND_PROOF_FAIL',
  SEND_PROOF_SUCCESS: 'SEND_PROOF_SUCCESS',
}

export type ProofRequestStatus = $Keys<typeof PROOF_REQUEST_STATUS>
export type ProofStatus = $Keys<typeof PROOF_STATUS>

export const PROOF_REQUEST_SHOWN = 'PROOF_REQUEST_SHOWN'
export type ProofRequestShownAction = {
  type: typeof PROOF_REQUEST_SHOWN,
  uid: string,
}

export const SEND_PROOF_SUCCESS = 'SEND_PROOF_SUCCESS'
export type SendProofSuccessAction = {
  type: typeof SEND_PROOF_SUCCESS,
  uid: string,
}

export const SEND_PROOF_FAIL = 'SEND_PROOF_FAIL'
export type SendProofFailAction = {
  type: typeof SEND_PROOF_FAIL,
  uid: string,
  error: CustomError,
}

export const SEND_PROOF = 'SEND_PROOF'
export type SendProofAction = {
  type: typeof SEND_PROOF,
  uid: string,
}

export const PROOF_REQUEST_IGNORED = 'PROOF_REQUEST_IGNORED'
export type ProofRequestIgnoredAction = {
  type: typeof PROOF_REQUEST_IGNORED,
  uid: string,
}

export const PROOF_REQUEST_REJECTED = 'PROOF_REQUEST_REJECTED'
export type ProofRequestRejectedAction = {
  type: typeof PROOF_REQUEST_REJECTED,
  uid: string,
}

export const PROOF_REQUEST_ACCEPTED = 'PROOF_REQUEST_ACCEPTED'
export type ProofRequestAcceptedAction = {
  type: typeof PROOF_REQUEST_ACCEPTED,
  uid: string,
}

export const PROOF_REQUEST_AUTO_FILL = 'PROOF_REQUEST_AUTO_FILL'
export type ProofRequestAutoFillAction = {
  type: typeof PROOF_REQUEST_AUTO_FILL,
  uid: string,
  requestedAttributes: Array<Attribute>,
}

export type ProofRequestInitialAction = {
  type: typeof INITIAL_TEST_ACTION,
}

export type ProofRequestAction =
  | ProofRequestReceivedAction
  | SendProofSuccessAction
  | SendProofFailAction
  | SendProofAction
  | ProofRequestIgnoredAction
  | ProofRequestAcceptedAction
  | ProofRequestShownAction
  | ProofRequestInitialAction
  | ProofRequestRejectedAction
  | ProofRequestAutoFillAction

export type ProofRequestStore = {
  +[string]: ProofRequestPayload,
}
