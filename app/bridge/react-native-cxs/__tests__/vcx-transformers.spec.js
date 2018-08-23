// @flow

import {
  convertAgencyConfigToVcxProvision,
  convertVcxProvisionResultToUserOneTimeInfo,
  convertCxsInitToVcxInit,
  convertInvitationToVcxConnectionCreate,
  convertVcxCredentialOfferToCxsClaimOffer,
} from '../vcx-transformers'
import {
  vcxProvisionResult,
  agencyUrl,
  agencyDID,
  agencyVerificationKey,
  poolConfig,
  userOneTimeInfo,
  getTestInvitationPayload,
  vcxClaimOffer,
} from '../../../../__mocks__/static-data'
import type { InvitationPayload } from '../../../invitation/type-invitation'

const agencyPoolConfig = {
  agencyUrl,
  agencyDID,
  agencyVerificationKey,
  poolConfig,
}
const initWithGenesisPathConfig = {
  ...userOneTimeInfo,
  ...agencyPoolConfig,
  genesis_path: 'genesis_path',
}
const walletPoolName = {
  walletName: 'walletName',
  poolName: 'poolName',
}

describe('transformer:VCX', () => {
  it('convertAgencyConfigToVcxProvision', async () => {
    const vcxProvisionConfig = await convertAgencyConfigToVcxProvision(
      agencyPoolConfig,
      walletPoolName
    )
    expect(vcxProvisionConfig).toMatchSnapshot()
  })

  it('convertVcxProvisionResultToUserOneTimeInfo', () => {
    expect(
      convertVcxProvisionResultToUserOneTimeInfo(vcxProvisionResult)
    ).toMatchSnapshot()
  })

  it('convertCxsInitToVcxInit', async () => {
    const vcxInitConfig = await convertCxsInitToVcxInit(
      initWithGenesisPathConfig,
      walletPoolName
    )
    expect(vcxInitConfig).toMatchSnapshot()
  })

  it('convertInvitationToVcxConnectionCreate', () => {
    const gen = getTestInvitationPayload()
    const invitation = gen.next().value
    if (invitation) {
      expect(
        convertInvitationToVcxConnectionCreate(invitation.payload)
      ).toMatchSnapshot()
    }
  })

  it('convertVcxCredentialOfferToCxsClaimOffer', () => {
    expect(
      convertVcxCredentialOfferToCxsClaimOffer(vcxClaimOffer)
    ).toMatchSnapshot()
  })
})
