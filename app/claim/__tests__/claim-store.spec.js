// @flow
import renderer from 'react-test-renderer'
import { put, call, select } from 'redux-saga/effects'
import { initialTestAction } from '../../common/type-common'
import claimReducer, {
  claimReceived,
  claimStorageFail,
  claimStorageSuccess,
  claimReceivedSaga,
  mapClaimToSender,
} from '../claim-store'
import { CLAIM_STORAGE_ERROR } from '../../services/error/error-code'
import { addClaim, getClaim } from '../../bridge/react-native-cxs/RNCxs'
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
import { getItem, setItem } from '../../services/secure-storage'
import type { ClaimWithUuid } from '../../claim/type-claim'

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

  it('claim storage workflow should work fine if storage is success', () => {
    const gen = claimReceivedSaga(claimReceived(claim))

    expect(gen.next().value).toEqual(select(getPoolConfig))

    expect(gen.next(poolConfig).value).toEqual(
      call(addClaim, JSON.stringify(claim), poolConfig)
    )

    const claimFilterJSON = JSON.stringify({
      issuer_DID: claim.issuer_did,
      schema_seq_no: claimDefinitionSchemaSequenceNumber,
    })

    expect(gen.next(claimFilterJSON).value).toEqual(
      call(getClaim, claimFilterJSON, poolConfig)
    )

    expect(gen.next(claimWithUuid).value).toEqual(select(getClaimMap))

    for (let c: ClaimWithUuid of claimWithUuid) {
      if (!claimMap[c.claim_uuid]) {
        expect(gen.next(JSON.stringify(claimMap)).value).toEqual(
          select(getConnectionLogoUrl, c.from_did)
        )
        expect(gen.next(senderLogoUrl1).value).toEqual(
          put(
            mapClaimToSender(c.claim_uuid, c.from_did, c.forDID, senderLogoUrl1)
          )
        )
        expect(gen.next().value).toEqual(put(claimStorageSuccess(c.messageId)))
        break
      }
    }

    // TODO: Fix this
    gen.next()

    expect(gen.next().done).toBe(true)
  })

  it('claim storage workflow works fine if storage fails', () => {
    const gen = claimReceivedSaga(claimReceived(claim))

    expect(gen.next().value).toEqual(select(getPoolConfig))

    expect(gen.next(poolConfig).value).toEqual(
      call(addClaim, JSON.stringify(claim), poolConfig)
    )

    const error = new Error('claim storage Indy failure')
    expect(gen.throw(error).value).toEqual(
      put(claimStorageFail(claim.messageId, CLAIM_STORAGE_ERROR(error)))
    )

    expect(gen.next().done).toBe(true)
  })

  it('should reset claim store, if RESET action is raised', () => {
    expect(
      claimReducer(afterClaimReceived, { type: 'RESET' })
    ).toMatchSnapshot()
  })
})
