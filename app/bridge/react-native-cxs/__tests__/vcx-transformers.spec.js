// @flow

import {
  convertAgencyConfigToVcxProvision,
  convertVcxProvisionResultToUserOneTimeInfo,
  convertCxsInitToVcxInit,
  convertInvitationToVcxConnectionCreate,
} from '../vcx-transformers'
import {
  vcxProvisionResult,
  agencyUrl,
  agencyDID,
  agencyVerificationKey,
  poolConfig,
  userOneTimeInfo,
  getTestInvitationPayload,
} from '../../../../__mocks__/static-data'
import type { InvitationPayload } from '../../../invitation/type-invitation'

const agencyPoolConfig = {
  agencyUrl,
  agencyDID,
  agencyVerificationKey,
  poolConfig,
}

describe('transformer:VCX', () => {
  it('convertAgencyConfigToVcxProvision', () => {
    expect(
      convertAgencyConfigToVcxProvision(agencyPoolConfig)
    ).toMatchSnapshot()
  })

  it('convertVcxProvisionResultToUserOneTimeInfo', () => {
    expect(
      convertVcxProvisionResultToUserOneTimeInfo(vcxProvisionResult)
    ).toMatchSnapshot()
  })

  it('convertCxsInitToVcxInit', () => {
    expect(
      convertCxsInitToVcxInit({ ...userOneTimeInfo, ...agencyPoolConfig })
    ).toMatchSnapshot()
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
})
