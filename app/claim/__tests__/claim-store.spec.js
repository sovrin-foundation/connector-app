// @flow
import renderer from 'react-test-renderer'
import { put, call } from 'redux-saga/effects'
import { initialTestAction } from '../../common/type-common'
import claimReducer, {
  claimReceived,
  claimStorageFail,
  claimStorageSuccess,
  claimReceivedSaga,
} from '../claim-store'
import { CLAIM_STORAGE_ERROR } from '../../services/error/error-code'
import { addClaim } from '../../bridge/react-native-cxs/RNCxs'
import { claim } from '../../../__mocks__/static-data'

describe('Claim Store', () => {
  let initialState
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

    expect(gen.next().value).toEqual(call(addClaim, JSON.stringify(claim)))
    expect(gen.next().value).toEqual(put(claimStorageSuccess(claim.messageId)))

    expect(gen.next().done).toBe(true)
  })

  it('claim storage workflow works fine if storage fails', () => {
    const gen = claimReceivedSaga(claimReceived(claim))

    expect(gen.next().value).toEqual(call(addClaim, JSON.stringify(claim)))

    const error = new Error('claim storage Indy failure')
    expect(gen.throw(error).value).toEqual(
      put(claimStorageFail(claim.messageId, CLAIM_STORAGE_ERROR(error)))
    )

    expect(gen.next().done).toBe(true)
  })
})
