// @flow

import {
  agencyUrl,
  agencyDID,
  agencyVerificationKey,
} from './config-store-mock-data'
import { userOneTimeInfo } from './user-store-mock-data'
import { WALLET_FILE_NAME } from '../../app/backup/type-backup'

// I believe now is the time when we should start splitting static-data.js
// we are starting to see that we shy away from utilizing existing data,
// which was the intention of creating one file, so that same object
// would be used all throughout app and we would know breakage of contract
// among screens/components as soon as we change some data at one place.
// `flow` solves most of those issues, but still there are some issues
// that flow can't solve, and for those we need test to identify
// and for tests we need some mocked data which will be used throughout tests

export const vcxProvisionResult = {
  wallet_name: WALLET_FILE_NAME,
  wallet_key: 'walletKey',
  agency_endpoint: agencyUrl,
  agency_did: agencyDID,
  agency_verkey: agencyVerificationKey,
  sdk_to_remote_did: userOneTimeInfo.myOneTimeDid,
  sdk_to_remote_verkey: userOneTimeInfo.myOneTimeVerificationKey,
  institution_did: userOneTimeInfo.oneTimeAgencyDid,
  institution_verkey: userOneTimeInfo.oneTimeAgencyVerificationKey,
  remote_to_sdk_did: userOneTimeInfo.myOneTimeAgentDid,
  remote_to_sdk_verkey: userOneTimeInfo.myOneTimeAgentVerificationKey,
}

export const vcxConnectionSerialized = JSON.stringify({})

export const serializedClaimOffer = '{}'

export const serializedClaimOffers = JSON.stringify({
  pairwiseIdentifier1: {
    uid: serializedClaimOffer,
  },
})

export const vcxClaimOffer = {
  msg_type: 'CLAIM_OFFER',
  version: '1.0.0',
  to_did: '8XFh8yBzrpJQmNyZzgoTqB',
  from_did: 'ha66899sadfjZJGINKN0770',
  libindy_offer: '',
  cred_def_id: 'cred_def_id',
  credential_attrs: {
    ['Address 1']: ['Address Address Address'],
    ['Address 2']: ['Address 2 Address 2 Address 2'],
  },
  claim_name: 'Home Address',
  schema_seq_no: 36,
  claim_id: 'jhkad:97:kkda:jhh',
}
