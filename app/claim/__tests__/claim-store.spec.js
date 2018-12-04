// @flow
import renderer from 'react-test-renderer'
import { put, call, select } from 'redux-saga/effects'
import { initialTestAction } from '../../common/type-common'
import claimReducer, {
  claimReceived,
  claimStorageFail,
  claimStorageSuccess,
  mapClaimToSender,
} from '../claim-store'
import { CLAIM_STORAGE_ERROR } from '../../services/error/error-code'
import {
  getConnectionLogoUrl,
  getPoolConfig,
  getClaimMap,
} from '../../store/store-selector'
import {
  claim,
  claimWithUuid,
  senderDid1,
  claimDefinitionSchemaSequenceNumber,
  getClaimFormat,
  senderLogoUrl1,
  myPairWiseConnectionDetails,
  poolConfig,
  claimMap,
} from '../../../__mocks__/static-data'
import type { ClaimWithUuid } from '../../claim/type-claim'
import { promptBackupBanner } from '../../backup/backup-store'

describe('Claim Store', () => {
  let initialState = { claimMap: {} }
  let afterClaimReceived

  beforeEach(() => {
    initialState = claimReducer(undefined, initialTestAction())
    afterClaimReceived = claimReducer(initialState, claimReceived(claim))
  })

  it('should match snapshot for claim received action', () => {
    expect(afterClaimReceived).toMatchSnapshot()
  })

  it('should match snapshot when claim storage fails', () => {
    const nextState = claimReducer(
      afterClaimReceived,
      claimStorageFail(claim.messageId, CLAIM_STORAGE_ERROR())
    )
    expect(nextState).toMatchSnapshot()
  })

  it('should match snapshot when claim storage is success', () => {
    const nextState = claimReducer(
      afterClaimReceived,
      claimStorageSuccess(claim.messageId)
    )
    expect(nextState).toMatchSnapshot()
  })

  it('should reset claim store, if RESET action is raised', () => {
    expect(
      claimReducer(afterClaimReceived, { type: 'RESET' })
    ).toMatchSnapshot()
  })
})
