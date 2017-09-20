// @flow
import claimOfferStore, {
  claimOfferReceived,
  claimOfferShown,
} from '../claim-offer-store'

describe('claim offer store', () => {
  const initialAction = { type: 'INITIAL_TEST_ACTION' }
  it('should correctly calculate initial state', () => {
    expect(claimOfferStore(undefined, initialAction)).toMatchSnapshot()
  })

  it('should correctly calculate state after claim offer is received', () => {
    const initialState = claimOfferStore(undefined, initialAction)
    expect(
      claimOfferStore(initialState, claimOfferReceived())
    ).toMatchSnapshot()
  })

  it('should correctly calculate state after claim offer is shown', () => {
    const initialState = claimOfferStore(undefined, initialAction)
    expect(claimOfferStore(initialState, claimOfferShown())).toMatchSnapshot()
  })
})
