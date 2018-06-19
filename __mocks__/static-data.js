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
import {
  claimOfferReceived,
  sendClaimRequest,
} from '../app/claim-offer/claim-offer-store'
import { claimReceived, claimStorageSuccess } from '../app/claim/claim-store'
import { saveNewConnectionSuccess } from '../app/store/connections-store'
import {
  proofRequestReceived,
  proofRequestAutoFill,
  sendProofSuccess,
} from '../app/proof-request/proof-request-store'
import { color } from '../app/common/styles/constant'
import {
  qrCodeScannerTabRoute,
  homeRoute,
  claimOfferRoute,
} from '../app/common/route-constants'
import {
  agencyUrl,
  agencyDID,
  agencyVerificationKey,
  poolConfig,
  vcxInitializationState,
  vcxInitializationError,
  configStoreNotHydratedInstalledVcxInit,
} from './data/config-store-mock-data'
import { userOneTimeInfo } from './data/user-store-mock-data'
import { STORE_STATUS } from '../app/wallet/type-wallet'

// sadly, we can't export all variables in one line and use them in file as well
// to use them in this file, we have to import them first
// and then export variables, we can't use default export
// and has to export each variables by name
// because es6 modules are statically resolved
// hopefully it will not be so bad once we move all of mocked data
// into it's own file and use those files to import data wherever we need it
// instead of going through one file
// or may be in this file we can do default export and then this file
// will be used for access to all other files
export {
  agencyUrl,
  agencyDID,
  agencyVerificationKey,
  poolConfig,
  configStoreNotHydratedInstalledVcxInit,
} from './data/config-store-mock-data'

export const senderDid1 = 'senderDID1'
export const senderName1 = 'sender1'
export const senderLogoUrl1 = 'http://testissuer.com/logoUrl.png'
export const senderVerKey1 = 'senderVerificationKey1'
export const senderAgentDID1 = 'senderAgentDID1'
export const endpoint = 'endpoint'
export const uid = 'uid'
export const smsToken = 'gm76ku'

export const senderAgentKeyDelegationProof = {
  agentDID: senderAgentDID1,
  agentDelegatedKey: 'agentDelegatedKey',
  signature: 'signature',
}

export const senderDetail = {
  name: senderName1,
  agentKeyDlgProof: senderAgentKeyDelegationProof,
  DID: senderDid1,
  logoUrl: senderLogoUrl1,
  verKey: senderVerKey1,
}

export const senderAgencyDetail = {
  DID: senderDid1,
  verKey: senderVerKey1,
  endpoint: endpoint,
}

const targetName = 'target name'
const connectionRequestId1 = 'requestId1'
const connectionRequestId2 = 'requestId2'

export const smsDownloadedPayload = {
  senderDetail,
  senderAgencyDetail,
  targetName,
  connReqId: connectionRequestId1,
  statusCode: 'MS-102',
  statusMsg: 'message sent',
}

export function* getTestInvitationPayload(): Generator<*, *, *> {
  yield {
    payload: {
      senderEndpoint: 'endpoint',
      requestId: connectionRequestId1,
      senderAgentKeyDelegationProof,
      senderName: 'sender1',
      senderDID: senderDid1,
      senderLogoUrl: 'lu',
      senderVerificationKey: 'sVk',
      targetName,
      senderDetail,
      senderAgencyDetail,
    },
  }

  yield {
    payload: {
      senderEndpoint: 'endpoint',
      requestId: connectionRequestId2,
      senderAgentKeyDelegationProof,
      senderName: 'sender2',
      senderDID: 'senderDID2',
      senderLogoUrl: 'lu',
      senderVerificationKey: 'sVk 2',
      targetName: 'target name',
      senderDetail,
      senderAgencyDetail,
    },
  }
}

const gen = getTestInvitationPayload()
const firstInvitationPayload = gen.next().value

export const pairwiseConnection = {
  identifier: 'pairwiseIdentifier1',
  verificationKey: 'pairwiseVerificationKey1',
}

export const myPairWiseConnectionDetails = {
  myPairwiseAgentDid: 'myPairwiseAgentDID',
  myPairwiseAgentVerKey: 'myPairwiseAgentVerKey',
  myPairwiseDid: 'pairwiseIdentifier1',
  myPairwisePeerVerKey: 'senderVerificationKey1',
  myPairwiseVerKey: 'pairwiseVerificationKey1',
}

export const vcxSerializedConnection = '{someVcxSerializedFormat}'

export const successConnectionData = {
  newConnection: {
    identifier: pairwiseConnection.identifier,
    logoUrl: firstInvitationPayload
      ? firstInvitationPayload.payload.senderLogoUrl
      : '',
    ...(firstInvitationPayload ? firstInvitationPayload.payload : {}),
    ...myPairWiseConnectionDetails,
    // TODO Add vcxSerializedConnection key once vcx is integrated
    // vcxSerializedConnection
  },
}

export const claimOfferId = 'usd123'
export const claimDefinitionSchemaSequenceNumber = 36
const issuerDid = 'issuerDid'
export const senderLogoUrl = 'http://testissuer.com/logoUrl.png'

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

export const originalProofRequestData = {
  nonce: '123432421212',
  name: 'proof_req_1',
  version: '0.1',
  requested_attrs: {
    attr1_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 1',
    },
    attr2_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 2',
    },
  },
  requested_predicates: {},
}

export const originalProofRequestData10Attributes = {
  nonce: '123432421212',
  name: 'proof_req_2',
  version: '0.1',
  requested_attrs: {
    attr1_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 1',
    },
    attr2_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 2',
    },
    attr3_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 3',
    },
    attr4_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 4',
    },
    attr5_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 5',
    },
    attr6_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 6',
    },
    attr7_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 7',
    },
    attr8_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 8',
    },
    attr9_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 9',
    },
    attr10_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'Address 10',
    },
  },
  requested_predicates: {},
}

export const originalProofRequestDataMissingAttribute = {
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
    attr3_uuid: {
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
      issuer_did: issuerDid,
      name: 'address3',
    },
  },
  requested_predicates: {},
}

export const proofRequestData = {
  name: 'Home Address',
  version: '1.0.0',
  requestedAttributes,
}

export const claimOfferPushAdditionalData = {
  msg_type: 'CLAIM_OFFER',
  version: '1.0.0',
  to_did: '8XFh8yBzrpJQmNyZzgoTqB',
  from_did: 'ha66899sadfjZJGINKN0770',
  claim: {
    ['Address 1']: ['Address Address Address'],
    ['Address 2']: ['Address 2 Address 2 Address 2'],
  },
  claim_name: 'Home Address',
  schema_seq_no: claimDefinitionSchemaSequenceNumber,
  remoteName: 'Test Issuer',
}

export const claimOfferPayload = {
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
  uid: claimOfferId,
  senderLogoUrl: 'http://testissuer.com/logoUrl.png',
  remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
  status: 'RECEIVED',
  claimRequestStatus: 'CLAIM_REQUEST_SUCCESS',
}

export const pendingClaimHistory = {
  action: 'PENDING',
  data: [
    {
      label: 'Address 1',
      data: 'Address Address Address',
    },
    {
      label: 'Address 2',
      data: 'Address 2 Address 2 Address 2',
    },
  ],
  id: 'id',
  name: 'Home Address',
  status: 'PENDING',
  timestamp: 'timestamp',
  type: 'CLAIM',
  remoteDid: 'ha66899sadfjZJGINKN0770',
  originalPayload: {
    type: 'CLAIM_RECEIVED',
    messageId: claimOfferId,
  },
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
    status: 'RECEIVED',
    claimRequestStatus: 'CLAIM_REQUEST_SUCCESS',
  },
  payloadInfo: {
    uid: claimOfferId,
    senderLogoUrl: 'http://testissuer.com/logoUrl.png',
    remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
  },
}

export const paidClaimOffer = {
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
    status: 'RECEIVED',
    claimRequestStatus: 'CLAIM_REQUEST_SUCCESS',
    payTokenValue: '8000.0675854',
    issuerWalletAddress:
      'sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030',
    claimOfferInvoiceNumber: 'hkgnqrs98ydf98fg7gks8fjhkss8f030',
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
  from_did: 'from_did',
  forDID: 'forDID',
}

export const claimWithUuid = [
  {
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
    from_did: 'from_did',
    forDID: 'forDID',
    claim_uuid: 'claim_uuid',
  },
]

export const proofRequestId = 'pid123'

export const proofRequestId10Attributes = 'pid10'

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
    senderLogoUrl: 'http://cr0ybot.github.io/ingress-logos/ingress.png',
    remotePairwiseDID: senderDid1,
  },
}

export const proofRequest10Attributes = {
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
        {
          label: 'Address 3',
        },
        {
          label: 'Address 4',
        },
        {
          label: 'Address 5',
        },
        {
          label: 'Address 6',
        },
        {
          label: 'Address 7',
        },
        {
          label: 'Address 8',
        },
        {
          label: 'Address 9',
        },
        {
          label: 'Address 10',
        },
      ],
    },
    requester: {
      name: 'Test Issuer',
    },
    originalProofRequestData: originalProofRequestData10Attributes,
    statusMsg: 'pending',
  },
  payloadInfo: {
    uid: proofRequestId10Attributes,
    senderLogoUrl: 'https://image.flaticon.com/icons/png/128/174/174851.png',
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

export const proofWithMissingAttributes = {
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
      attr3_uuid: ['claim::f760213b-e719-47fb-9669-b72c5c410e8c', 'male', '59'],
      attr1_uuid: ['claim::f760213b-e719-47fb-9669-b72c5c410e8c', 'Alex', '11'],
    },
    unrevealed_attrs: {},
    self_attested_attrs: { attr2_uuid: 'male' },
    predicates: {},
  },
}

export const proofWith10Attributes = {
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
    self_attested_attrs: {
      attr3_uuid: 'attr 3 value',
      attr4_uuid: 'attr 4 value',
      attr5_uuid: 'attr 5 value',
      attr6_uuid: 'attr 6 value',
      attr7_uuid: 'attr 7 value',
      attr8_uuid: 'attr 8 value',
      attr9_uuid: 'attr 9 value',
      attr10_uuid: 'attr 10 value',
    },
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

export const missingAttributes = [{ key: 'attr2_uuid', name: 'sex' }]
export const missingAttributes1 = [
  { key: 'attr2_uuid', name: 'sex' },
  { key: 'attr3_uuid', name: 'height' },
]

export const selfAttestedAttributes = {
  attr2_uuid: {
    name: 'sex',
    data: 'male',
    key: 'attr2_uuid',
  },
}

export const selfAttestedAttributes1 = {
  attr2_uuid: {
    name: 'sex',
    data: 'male',
    key: 'attr2_uuid',
  },
  attr3_uuid: {
    name: 'height',
    data: '190',
    key: 'attr3_uuid',
  },
}

export const preparedProof = {
  attrs: {
    attr1_uuid: [
      {
        claim_uuid: 'claim::ea03d8ca-eeb4-4944-b7d6-5abcf4503d73',
        attrs: { name: 'Alex', sex: 'male' },
        schema_seq_no: 295,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
    ],
    attr2_uuid: [
      {
        claim_uuid: 'claim::6a0f42b4-1210-4bdb-ad53-10ed765276b5',
        attrs: { height: '150' },
        schema_seq_no: 296,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
    ],
  },
  predicates: {},
}

export const homeAddressPreparedProof = {
  attrs: {
    attr1_uuid: [
      {
        claim_uuid: 'claim::ea03d8ca-eeb4-4944-b7d6-5abcf4503d73',
        attrs: { ['Address 1']: 'Address 1' },
        schema_seq_no: 295,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
    ],
    attr2_uuid: [
      {
        claim_uuid: 'claim::6a0f42b4-1210-4bdb-ad53-10ed765276b5',
        attrs: { ['Address 2']: 'Address 2' },
        schema_seq_no: 296,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
    ],
  },
  predicates: {},
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
    [missingAttributes[0].key]: [null],
  },
  predicates: {},
}

export const homeAddressPreparedProofWithMissingAttribute = {
  attrs: {
    attr1_uuid: [
      {
        claim_uuid: 'claim::ea03d8ca-eeb4-4944-b7d6-5abcf4503d73',
        attrs: { ['Address 1']: 'Evernym Ltd, Hyd.' },
        schema_seq_no: 295,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
      {
        claim_uuid: 'claim::ea03d8ca-eeb4-4944-b7d6-5abcf4503d73',
        attrs: { ['Address 1']: 'Sovrin Ltd, Utah.' },
        schema_seq_no: 295,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
    ],
    attr3_uuid: [
      {
        claim_uuid: 'claim::6a0f42b4-1210-4bdb-ad53-10ed765276b5',
        attrs: { ['Address 2']: 'Address 2' },
        schema_seq_no: 296,
        issuer_did: 'V4SGRU86Z58d6TV7PBUe6f',
      },
    ],
    [missingAttributes[0].key]: [null],
  },
  predicates: {},
}

export function getNavigation(params?: NavigationParams) {
  return {
    // $FlowFixMe Don't know why this is failing, may be we upgrade to flow 0.63
    navigate: jest.fn(),
    state: {
      params: params || {},
    },
    // $FlowFixMe Don't know why this is failing, may be we upgrade to flow 0.63
    goBack: jest.fn(),
    // $FlowFixMe
    dispatch: jest.fn(),
    // $FlowFixMe Don't know why this is failing, may be we upgrade to flow 0.63
    setParams: jest.fn(),
  }
}

// TODO:  we should be just able to pass an object and
// TODO: it should deep extend default store state.if we dont deep extend We have to make many calls for getStore and getState
// TODO: for any property that we want to override
export function getStore(store?: Store) {
  return {
    getState() {
      return {
        config: configStoreNotHydratedInstalledVcxInit,
        deepLink: {
          error: undefined,
          isLoading: true,
          tokens: {},
        },
        lock: {
          checkPinStatus: CHECK_PIN_IDLE,
          pendingRedirection: undefined,
          isAppLocked: false,
          isLockEnabled: true,
          isTouchIdEnabled: true,
          showDevMode: false,
        },
        connections: {
          connectionThemes: {
            default: {
              primary: `rgba(${color.actions.button.primary.rgba})`,
              secondary: `rgba(${color.actions.button.secondary.rgba})`,
            },
          },
          data: undefined,
        },
        route: {
          currentScreen: qrCodeScannerTabRoute,
        },
        smsPendingInvitation: {},
        ...(store || {}),
        claim: {
          [uid]: {
            claim,
          },
          claimMap: claimMap,
        },
        user: {
          isFetching: false,
          error: null,
          userOneTimeInfo,
          avatarName: userAvatarImageName,
        },
        wallet: {
          walletBalance,
          walletAddresses,
          walletHistory,
          backup,
          payment,
        },
      }
    },
    dispatch() {
      // $FlowFixMe Don't why this is failing, may be we upgrade to flow 0.63
      return jest.fn()
    },
    subscribe() {
      // $FlowFixMe Don't why this is failing, may be we upgrade to flow 0.63
      return jest.fn()
    },
  }
}

export const invitationReceivedEvent = {
  type: INVITATION_RECEIVED,
  data: { ...firstInvitationPayload },
}

export const newConnectionSuccessEvent = saveNewConnectionSuccess(
  successConnectionData ? successConnectionData.newConnection : {}
)

export const claimOfferReceivedEvent = claimOfferReceived(
  claimOffer.payload,
  claimOffer.payloadInfo
)

export const claimReceivedEvent = claimReceived(claim)

export const sendClaimRequestEvent = sendClaimRequest(uid, claimOfferPayload)

export const claimReceivedSuccessEvent = claimStorageSuccess(uid)

export const proofRequestReceivedEvent = proofRequestReceived(
  proofRequest.payload,
  proofRequest.payloadInfo
)

export const proofRequestAutofillEvent = proofRequestAutoFill(
  proofRequestId,
  requestedAttributes
)

export const proofSharedEvent = sendProofSuccess(proofRequestId)

export const proofRequestAutofill = {
  status: 'proofRequestStatus',
  proofStatus: 'NONE',
  uid: proofRequestId,
  senderLogoUrl,
  remotePairwiseDID: 'remotePairWiseDID',
  data: {
    name: 'proof_req_auto_filled',
    version: 'version',
    requestedAttributes,
  },
  requester: {
    name: 'reqeusterName',
  },
  originalProofRequestData,
  statusMsg: 'statusMsg',
}

export { userOneTimeInfo } from './data/user-store-mock-data'

export const backup = {
  status: STORE_STATUS.IDLE,
  error: null,
  latest: '2017-09-06T00:00:00+05:30',
  backupPath: 'hibob',
  encryptionKey: 'walletEncryptionKey',
}

export const qrData = {
  id: 'yta2odh',
  s: {
    n: 'ent-name',
    dp: {
      d: 'N2Uyi6SVsHZq1VWXuA3EMg',
      k: 'CTfF2sZ5q4oPcBvTP75pgx3WGzYiLSTwHGg9zUsJJegi',
      s:
        '/FxHMzX8JaH461k1SI5PfyxF5KwBAe6VlaYBNLI2aSZU3APsiWBfvSC+mxBYJ/zAhX9IUeTEX67fj+FCXZZ2Cg==',
    },
    d: 'F2axeahCaZfbUYUcKefc3j',
    l: 'ent-logo-url',
    v: '74xeXSEac5QTWzQmh84JqzjuXc8yvXLzWKeiqyUnYokx',
  },
  sa: {
    d: 'BDSmVkzxRYGE4HKyMKxd1H',
    v: '6yUatReYWNSUfEtC2ABgRXmmLaxCyQqsjLwv2BomxsxD',
    e: '52.38.32.107:80/agency/msg',
  },
  t: 'there',
}
export const parsedClaimRequest = {
  blinded_ms: {
    prover_did: 'prover_did',
    u: 'u',
  },
  issuer_did: 'issuer_did',
  schema_seq_no: 36,
}

export const validQrCodeEnvironmentSwitchUrl =
  'https://s3-us-west-2.amazonaws.com/vcx-env/dev'

export const environmentSwitchQrCodeData = {
  name: 'dev',
  url: validQrCodeEnvironmentSwitchUrl,
}

export const connectionHistory = {
  'September 2017': [
    {
      id: '1',
      type: 'INVITATION',
      icon: require('../app/images/linked.png'),
      action: 'CONNECTED',
      timestamp: '2017-09-06T00:00:00+05:30',
      data: [
        {
          label: 'Evernym',
          data: '2017-09-06T00:00:00+05:30',
        },
      ],
      name: 'Enterprise name',
      status: 'INVITATION_RECEIVED',
      remoteDid: 'remoteDid',
      originalPayload: {},
    },
  ],
}

export const activeConnectionThemePrimary = `rgba(${
  color.actions.button.primary.rgba
})`

export const activeConnectionThemeSecondary = `rgba(${
  color.actions.button.secondary.rgba
})`

export const connections = {
  ['4ej819kkjywdppuje79']: {
    ...successConnectionData.newConnection,
    vcxSerializedConnection: '',
    identifier: '4ej819kkjywdppuje79',
    name: 'Test Connection1',
    senderName: 'senderName',
    senderDID: 'senderDID',
    remoteConnectionId: '70075yyojywdppuje79',
    size: 100,
    logoUrl: 'https://logourl.com/logo.png',
  },
  ['3nj819kkjywdppuje86']: {
    ...successConnectionData.newConnection,
    vcxSerializedConnection: '',
    identifier: '3nj819kkjywdppuje86',
    name: 'Test Connection2',
    senderName: 'senderName',
    senderDID: 'senderDID',
    remoteConnectionId: '70075yyojywdppuje79',
    size: 100,
    logoUrl: 'https://logourl.com/logo.png',
  },
  ['7fj819kkjywdppuje34']: {
    ...successConnectionData.newConnection,
    vcxSerializedConnection: '',
    identifier: '7fj819kkjywdppuje34',
    name: 'Test Connection3',
    senderName: 'senderName',
    senderDID: 'senderDID',
    remoteConnectionId: '70075yyojywdppuje79',
    size: 100,
    logoUrl: 'https://logourl.com/logo.png',
  },
}

export const connection = {
  identifier: '90ij8167kkjywdppujer60',
  name: 'Test Connection4',
  senderName: 'senderName',
  senderDID: 'senderDID',
  remoteConnectionId: '70075yyojywdppuje79',
  size: 100,
  logoUrl: 'https://logourl.com/logo.png',
}

export const getClaimFormat = {
  issuer_did: senderDid1,
  schema_seq_no: claimDefinitionSchemaSequenceNumber,
  attrs: {
    address1: 'address1',
    address2: 'address2',
    state: 'state',
    city: 'city',
    zip: 'zip',
  },
  claim_uuid: 'claim_uuid',
}

export const claimMap = {
  claimUuid1: {
    logoUrl: senderLogoUrl,
    myPairwiseDID: myPairWiseConnectionDetails.myPairwiseDid,
    senderDID: senderDid1,
  },
}

export const claimOfferPushNotification = {
  additionalData: {
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
    },
    issuer: {
      name: 'Test Issuer',
      did: 'issuerDid',
    },
    statusMsg: 'pending',
  },
  type: 'claimOffer',
  uid: 'usd123',
  senderLogoUrl: 'http://testissuer.com/logoUrl.png',
  remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
  forDID: 'forDID',
}

export const getSmsPendingInvitationOfToken = (token: string) => ({
  [token]: {
    error: null,
    isFetching: false,
    status: 'RECEIVED',
    payload: smsDownloadedPayload,
  },
})

export const connectionHistoryDetail = {
  type: 'claim',
  action: 'RECEIVED',
  claimMap: claimMap,
  data: [{ label: 'label', name: 'name' }],
  id: 'dsfd',
  image: senderLogoUrl,
  name: 'name',
  originalPayload: {
    messageId: 'messageId',
    type: 'CLAIM_STORAGE_SUCCESS',
  },
  remoteDid: 'remoteDid',
  senderDID: 'senderDID',
  senderName: 'DEV',
  status: 'RECEIVED',
  theme: activeConnectionThemePrimary,
  timestamp: '2018-04-05T20:57:07+05:30',
}

export const defaultUUID = 'a4f35623-b50c-40ea-a2b0-f7cd06e03142'

export const userAvatarImageName = `user-avatar.jpeg`

export const userAvatarImagePath = `/var/application/DocumentDir/${userAvatarImageName}`

export const walletBalance = {
  data: 1000,
  status: STORE_STATUS.SUCCESS,
  error: null,
}

export const payment = {
  tokenAmount: 5656,
  status: STORE_STATUS.SUCCESS,
  error: null,
}

export const walletAddresses = {
  data: ['sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030'],
  status: STORE_STATUS.SUCCESS,
  error: null,
}

export const walletHistory = {
  transactions: [
    {
      id: 'asd',
      senderAddress: 'sov:senderAddress',
      action: 'Withdraw',
      tokenAmount: 5656,
      timeStamp: 'Tue, 04 Aug 2015 12:38:41 GMT',
    },
    {
      id: 'kld',
      senderName: 'senderName',
      senderAddress: 'sov:senderAddress',
      action: 'Purchase',
      tokenAmount: 10000,
      timeStamp: 'Tue, 04 Aug 2015 14:38:41 GMT',
    },
  ],
  status: STORE_STATUS.SUCCESS,
  error: null,
}

export {
  vcxProvisionResult,
  serializedClaimOffers,
  serializedClaimOffer,
  vcxClaimOffer,
} from './data/vcx-mock-data'
export { connectionThemes } from './data/connections-mock-data'
