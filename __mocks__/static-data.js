// @flow
import type { NavigationParams } from '../app/common/type-common'
import type { Store } from '../app/store/type-store'
import { CHECK_PIN_IDLE } from '../app/lock/type-lock'
import {
  PROOF_REQUEST_RECEIVED,
  PROOF_REQUEST_AUTO_FILL,
} from '../app/proof-request/type-proof-request'
import { INVITATION_RECEIVED } from '../app/invitation/type-invitation'
import {
  NEW_CONNECTION_SUCCESS,
  saveNewConnection,
} from '../app/store/connections-store'
import { CLAIM_OFFER_ACCEPTED } from '../app/claim-offer/type-claim-offer'
import { invitationReceived } from '../app/invitation/invitation-store'
import { claimOfferReceived } from '../app/claim-offer/claim-offer-store'
import { saveNewConnectionSuccess } from '../app/store/connections-store'
import {
  proofRequestReceived,
  proofRequestAutoFill,
} from '../app/proof-request/proof-request-store'
import { color } from '../app/common/styles/constant'
import { homeRoute, claimOfferRoute } from '../app/common'

export const senderDid1 = 'senderDID1'

export function* getTestInvitationPayload(): Generator<*, *, *> {
  yield {
    payload: {
      senderEndpoint: 'endpoint',
      requestId: 'requestId1',
      senderAgentKeyDelegationProof: 'proof',
      senderName: 'sender1',
      senderDID: senderDid1,
      senderLogoUrl: 'lu',
      senderVerificationKey: 'sVk',
      targetName: 'target name',
    },
  }

  yield {
    payload: {
      senderEndpoint: 'endpoint',
      requestId: 'requestId2',
      senderAgentKeyDelegationProof: 'proof',
      senderName: 'sender2',
      senderDID: 'senderDID2',
      senderLogoUrl: 'lu',
      senderVerificationKey: 'sVk 2',
      targetName: 'target name',
    },
  }
}

const gen = getTestInvitationPayload()
const firstInvitationPayload = gen.next().value

export const pairwiseConnection = {
  identifier: 'pairwiseIdentifier1',
  verificationKey: 'pairwiseVerificationKey1',
}

export const successConnectionData = {
  newConnection: {
    identifier: pairwiseConnection.identifier,
    logoUrl: firstInvitationPayload
      ? firstInvitationPayload.payload.senderLogoUrl
      : '',
    ...(firstInvitationPayload ? firstInvitationPayload.payload : {}),
  },
}

export const claimOfferId = 'usd123'
const claimDefinitionSchemaSequenceNumber = 36
const issuerDid = 'issuerDid'
const senderLogoUrl = 'http://testissuer.com/logoUrl.png'

const requestedAttributes = [
  {
    label: 'address1',
    data: 'address1',
  },
  {
    label: 'address2',
    data: 'address2',
  },
]

const originalProofRequestData = {
  nonce: '123432421212',
  name: 'proof_req_1',
  version: '0.1',
  requested_attrs: {
    attr1_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'address1',
    },
    attr2_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'address2',
    },
  },
  requested_predicates: {},
}
export const claimOffer = {
  payload: {
    data: {
      name: 'Home Address',
      version: '1.0.0',
      revealedAttributes: [
        {
          label: 'Address 1',
          data: 'Address Address Address',
        },
        {
          label: 'Address 2',
          data: 'Address 2 Address 2 Address 2',
        },
      ],
      claimDefinitionSchemaSequenceNumber,
    },
    issuer: {
      name: 'Test Issuer',
      did: issuerDid,
    },
    statusMsg: 'pending',
  },
  payloadInfo: {
    uid: claimOfferId,
    senderLogoUrl: 'http://testissuer.com/logoUrl.png',
    remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
  },
}

export const claimRequest = {
  blinded_ms: {
    prover_did: pairwiseConnection.identifier,
    u: 'u',
    ur: 'ur',
  },
  schema_seq_no: claimDefinitionSchemaSequenceNumber,
  issuer_did: issuerDid,
}

export const claim = {
  messageId: '1',
  claim: {
    name: ['test', 'anon cred test'],
    date_of_birth: ['20-2-1800', 'anon cred date'],
  },
  schema_seq_no: claimDefinitionSchemaSequenceNumber,
  issuer_did: issuerDid,
  signature: {
    primary_claim: {
      m2: 'm2',
      a: 'a',
      e: 'e',
      v: 'v',
    },
  },
  remoteDid: 'remoteDid',
  uid: claimOfferId,
}

export const proofRequestId = 'pid123'

export const proofRequest = {
  payload: {
    data: {
      name: 'Home Address',
      version: '1.0.0',
      requestedAttributes: [
        {
          label: 'Address 1',
        },
        {
          label: 'Address 2',
        },
      ],
    },
    requester: {
      name: 'Test Issuer',
    },
    originalProofRequestData,
    statusMsg: 'pending',
  },
  payloadInfo: {
    uid: proofRequestId,
    senderLogoUrl: 'http://testissuer.com/logoUrl.png',
    remotePairwiseDID: senderDid1,
  },
}

export const fulfilledRequestedAttributes = [
  { label: 'address1', data: 'Address 1' },
  { label: 'address2', data: 'Address 2' },
]

export const proof = {
  proofs: {
    'claim::f760213b-e719-47fb-9669-b72c5c410e8c': {
      proof: {
        primary_proof: {
          eq_proof: {
            revealed_attrs: {
              name: '11',
              sex: '59',
            },
            a_prime: '13',
            e: '51',
            v: '13',
            m: {},
            m1: '67',
            m2: '60',
          },
          ge_proofs: [],
        },
        non_revoc_proof: null,
      },
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
    },
  },
  aggregated_proof: {
    c_hash: '31',
    c_list: [[claimDefinitionSchemaSequenceNumber]],
  },
  requested_proof: {
    revealed_attrs: {
      attr2_uuid: ['claim::f760213b-e719-47fb-9669-b72c5c410e8c', 'male', '59'],
      attr1_uuid: ['claim::f760213b-e719-47fb-9669-b72c5c410e8c', 'Alex', '11'],
    },
    unrevealed_attrs: {},
    self_attested_attrs: {},
    predicates: {},
  },
}

export const pendingRedirection = [
  { routeName: homeRoute, params: {} },
  { routeName: claimOfferRoute, params: { uid: 'asd123' } },
]

export const proofWithTwoClaims = {
  proofs: {
    'claim::0f165ac3-97a7-40c0-a06a-c0330cc78e3c': {
      proof: {
        primary_proof: {
          eq_proof: {
            revealed_attrs: {
              height: '59',
            },
            a_prime: '59',
            e: '11',
            v: '12',
            m: {},
            m1: '12',
            m2: '89',
          },
          ge_proofs: [],
        },
        non_revoc_proof: null,
      },
      schema_seq_no: 286,
      issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
    },
    'claim::52889a2f-5820-4d7e-b3bf-fecaad92a149': {
      proof: {
        primary_proof: {
          eq_proof: {
            revealed_attrs: {
              name: '11',
              sex: '59',
            },
            a_prime: '70',
            e: '15',
            v: '93',
            m: {},
            m1: '12',
            m2: '37',
          },
          ge_proofs: [],
        },
        non_revoc_proof: null,
      },
      schema_seq_no: 285,
      issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
    },
  },
  aggregated_proof: {
    c_hash: '84',
    c_list: [[2], [47]],
  },
  requested_proof: {
    revealed_attrs: {
      attr2_uuid: ['claim::52889a2f-5820-4d7e-b3bf-fecaad92a149', 'male', '59'],
      attr1_uuid: ['claim::52889a2f-5820-4d7e-b3bf-fecaad92a149', 'Alex', '11'],
      attr3_uuid: ['claim::0f165ac3-97a7-40c0-a06a-c0330cc78e3c', '150', '59'],
    },
    unrevealed_attrs: {},
    self_attested_attrs: {},
    predicates: {},
  },
}

export const preparedProofWithMissingAttribute = {
  attrs: {
    attr1_uuid: [
      {
        claim_uuid: 'claim::ea03d8ca-eeb4-4944-b7d6-5abcf4503d73',
        attrs: { name: 'Alex', sex: 'male' },
        schema_seq_no: 295,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
    ],
    attr3_uuid: [
      {
        claim_uuid: 'claim::6a0f42b4-1210-4bdb-ad53-10ed765276b5',
        attrs: { height: '150' },
        schema_seq_no: 296,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
    ],
    attr2_uuid: [],
  },
  predicates: {},
}

export function getNavigation(params?: NavigationParams) {
  return {
    navigate: jest.fn(),
    state: {
      params: params || {},
    },
    goBack: jest.fn(),
  }
}

export function getStore(store?: Store) {
  return {
    getState() {
      return {
        config: {},
        lock: {
          checkPinStatus: CHECK_PIN_IDLE,
        },
        connections: {
          connectionThemes: {
            default: {
              primary: `rgba(${color.actions.button.primary.rgba})`,
              secondary: `rgba(${color.actions.button.secondary.rgba})`,
            },
          },
        },
        ...(store || {}),
      }
    },
    dispatch() {
      return jest.fn()
    },
    subscribe() {
      return jest.fn()
    },
  }
}

export const invitationReceivedEvent = invitationReceived({
  ...firstInvitationPayload,
})

export const newConnectionSuccessEvent = saveNewConnectionSuccess(
  successConnectionData ? successConnectionData.newConnection : {}
)

export const claimOfferReceivedEvent = claimOfferReceived(
  claimOffer.payload,
  claimOffer.payloadInfo
)

export const proofRequestReceivedEvent = proofRequestReceived(
  proofRequest.payload,
  proofRequest.payloadInfo
)

export const proofRequestAutofillEvent = proofRequestAutoFill(
  proofRequestId,
  requestedAttributes
)

export const proofRequestAutofill = {
  status: 'proofRequestStatus',
  proofStatus: 'NONE',
  uid: proofRequestId,
  senderLogoUrl,
  remotePairwiseDID: 'remotePairWiseDID',
  data: {
    name: 'name',
    version: 'version',
    requestedAttributes,
  },
  requester: {
    name: 'reqeusterName',
  },
  originalProofRequestData,
  statusMsg: 'statusMsg',
}
