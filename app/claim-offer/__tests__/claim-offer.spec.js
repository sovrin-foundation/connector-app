// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ClaimOffer } from '../claim-offer'
import { CLAIM_OFFER_STATUS, CLAIM_REQUEST_STATUS } from '../type-claim-offer'
import { color } from '../../common/styles'

describe('<ClaimOffer />', () => {
  let store = {}
  beforeAll(() => {
    store = {
      getState() {
        return {
          connections: {
            connectionThemes: {
              default: {
                primary: `rgba(${color.actions.button.primary.rgba})`,
                secondary: `rgba(${color.actions.button.secondary.rgba})`,
              },
            },
          },
        }
      },
      subscribe() {
        return jest.fn()
      },
      dispatch() {
        return jest.fn()
      },
    }
  })

  let wrapper
  let claimOfferShown
  let acceptClaimOffer
  let claimOfferRejected
  let claimOfferIgnored
  let tree
  let navigation
  let componentInstance
  const claimOffer = {
    status: CLAIM_OFFER_STATUS.RECEIVED,
    payload: {
      claimOffer: {
        name: 'Home Address',
        version: '1.0.0',
        revealedAttributes: [
          {
            label: 'Address 1',
            data: 'An Address',
          },
          {
            label: 'Address 2',
            data: 'An Address 2',
          },
        ],
      },
      issuer: {
        name: 'Test Issuer',
        logoUrl: 'http://testissuer.com/logoUrl.png',
        pairwiseDID: 'ha66899sadfjZJGINKN0770',
      },
    },
    claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
  }
  beforeEach(() => {
    claimOfferShown = jest.fn()
    acceptClaimOffer = jest.fn()
    claimOfferRejected = jest.fn()
    claimOfferIgnored = jest.fn()
    navigation = {
      goBack: jest.fn(),
    }
    wrapper = renderer.create(
      <Provider store={store}>
        <ClaimOffer
          claimOffer={claimOffer}
          claimOfferShown={claimOfferShown}
          acceptClaimOffer={acceptClaimOffer}
          claimOfferIgnored={claimOfferIgnored}
          claimOfferRejected={claimOfferRejected}
          navigation={navigation}
        />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.getInstance()._reactInternalInstance.child
      .stateNode
  })

  it('should call claimOfferShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(claimOfferShown).toHaveBeenCalled()
  })

  it('should call acceptClaimOffer if offer is accepted', () => {
    componentInstance.onAccept()
    expect(acceptClaimOffer).toHaveBeenCalled()
  })

  it('should call claimOfferIgnored if close button is pressed', () => {
    componentInstance.onIgnore()
    expect(claimOfferIgnored).toHaveBeenCalled()
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('should call claimOfferRejected if ignore button is pressed', () => {
    componentInstance.onReject()
    expect(claimOfferRejected).toHaveBeenCalled()
    expect(navigation.goBack).toHaveBeenCalled()
  })
})
