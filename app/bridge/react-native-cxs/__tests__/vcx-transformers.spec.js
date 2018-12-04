// @flow

import {
  convertAgencyConfigToVcxProvision,
  convertVcxProvisionResultToUserOneTimeInfo,
  convertCxsInitToVcxInit,
  convertInvitationToVcxConnectionCreate,
  convertVcxCredentialOfferToCxsClaimOffer,
  convertVcxLedgerFeesToLedgerFees,
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

  it('convertVcxLedgerFeesToLedgerFees, return correct fees', () => {
    const correctLedgerFees = {
      '10001': '100',
    }
    expect(
      convertVcxLedgerFeesToLedgerFees(JSON.stringify(correctLedgerFees))
    ).toEqual({
      transfer: '0.000001',
    })
  })

  it('convertVcxLedgerFeesToLedgerFees, 0 fees for incorrect ledger fees', () => {
    const incorrectLedgerFees = {
      '10001': '0',
    }
    expect(
      convertVcxLedgerFeesToLedgerFees(JSON.stringify(incorrectLedgerFees))
    ).toEqual({
      transfer: '0',
    })
    const noLedgerFeesForTransfer = {
      '1001': '0',
    }
    expect(
      convertVcxLedgerFeesToLedgerFees(JSON.stringify(noLedgerFeesForTransfer))
    ).toEqual({
      transfer: '0',
    })
    const noLedgerFeesAsNumberForTransfer = {
      '1001': '1a',
    }
    expect(
      convertVcxLedgerFeesToLedgerFees(
        JSON.stringify(noLedgerFeesAsNumberForTransfer)
      )
    ).toEqual({
      transfer: '0',
    })
  })
})
