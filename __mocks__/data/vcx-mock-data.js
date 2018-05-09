// @flow

import {
  agencyUrl,
  agencyDID,
  agencyVerificationKey,
} from './config-store-mock-data'
import { userOneTimeInfo } from './user-store-mock-data'

// I believe now is the time when we should start splitting static-data.js
// we are starting to see that we shy away from utilizing existing data,
// which was the intention of creating one file, so that same object
// would be used all throughout app and we would know breakage of contract
// among screens/components as soon as we change some data at one place.
// `flow` solves most of those issues, but still there are some issues
// that flow can't solve, and for those we need test to identify
// and for tests we need some mocked data which will be used throughout tests

export const vcxProvisionResult = {
  wallet_name: 'walletName',
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
