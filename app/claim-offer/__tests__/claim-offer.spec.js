// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ClaimOffer } from '../claim-offer'
import { CLAIM_OFFER_STATUS, CLAIM_REQUEST_STATUS } from '../type-claim-offer'
import { color } from '../../common/styles'
import {
  getStore,
  paidClaimOffer,
  claimOffer,
  senderLogoUrl1,
} from '../../../__mocks__/static-data'

describe('Paid <ClaimOffer />', () => {
  const store = getStore()

  let wrapper
  let claimOfferShown
  let acceptClaimOffer
  let claimOfferRejected
  let claimOfferIgnored
  let tree
  let navigation
  let componentInstance
  let claimOfferShowStart
  let resetClaimRequestStatus
  const logoUrl = senderLogoUrl1

  const paidClaimOfferData = {
    data: {
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
      claimDefinitionSchemaSequenceNumber: 36,
    },
    issuer: {
      name: 'Test Issuer',
      did: 'issuerDid',
    },
    uid: 'asd123',
    remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
    payTokenValue: '8000.0675854',
    status: CLAIM_OFFER_STATUS.RECEIVED,
    claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
    error: null,
  }

  const isValid = true
  const claimThemePrimary = color.bg.secondary.color
  const claimThemeSecondary = color.bg.secondary.color
  const updateStatusBarTheme = jest.fn()

  beforeEach(() => {
    claimOfferShown = jest.fn()
    acceptClaimOffer = jest.fn()
    claimOfferRejected = jest.fn()
    claimOfferIgnored = jest.fn()
    claimOfferShowStart = jest.fn()
    resetClaimRequestStatus = jest.fn()
    navigation = {
      goBack: jest.fn(),
      state: {
        params: {
          uid: 'asd123',
        },
      },
    }
    wrapper = renderer.create(
      <Provider store={store}>
        <ClaimOffer
          claimOfferData={paidClaimOfferData}
          claimOfferShown={claimOfferShown}
          acceptClaimOffer={acceptClaimOffer}
          claimOfferIgnored={claimOfferIgnored}
          claimOfferRejected={claimOfferRejected}
          navigation={navigation}
          uid={navigation.state.params.uid}
          isValid={isValid}
          logoUrl={logoUrl}
          claimThemeSecondary={claimThemeSecondary}
          claimThemePrimary={claimThemePrimary}
          updateStatusBarTheme={updateStatusBarTheme}
          claimOfferShowStart={claimOfferShowStart}
          resetClaimRequestStatus={resetClaimRequestStatus}
        />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.root.findByType(ClaimOffer).instance
  })

  // Todo: write test to check if token balance is displayed.
  // However not clear how to write and assertion of token balance text
  it('should call claimOfferShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(claimOfferShown).toHaveBeenCalled()
  })
})

describe('<ClaimOffer />', () => {
  const store = getStore()

  let wrapper
  let claimOfferShown
  let acceptClaimOffer
  let claimOfferRejected
  let claimOfferIgnored
  let tree
  let navigation
  let componentInstance
  let claimOfferShowStart
  let resetClaimRequestStatus
  const logoUrl = senderLogoUrl1
  const claimOfferData = {
    data: {
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
      claimDefinitionSchemaSequenceNumber: 36,
    },
    issuer: {
      name: 'Test Issuer',
      did: 'issuerDid',
    },
    uid: 'asd123',
    remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
    status: CLAIM_OFFER_STATUS.RECEIVED,
    claimRequestStatus: CLAIM_REQUEST_STATUS.NONE,
    error: null,
  }
  const isValid = true
  const claimThemePrimary = color.bg.secondary.color
  const claimThemeSecondary = color.bg.secondary.color
  const updateStatusBarTheme = jest.fn()

  beforeEach(() => {
    claimOfferShown = jest.fn()
    acceptClaimOffer = jest.fn()
    claimOfferRejected = jest.fn()
    claimOfferIgnored = jest.fn()
    claimOfferShowStart = jest.fn()
    resetClaimRequestStatus = jest.fn()
    navigation = {
      goBack: jest.fn(),
      state: {
        params: {
          uid: 'asd123',
        },
      },
    }
    wrapper = renderer.create(
      <Provider store={store}>
        <ClaimOffer
          claimOfferData={claimOfferData}
          claimOfferShown={claimOfferShown}
          acceptClaimOffer={acceptClaimOffer}
          claimOfferIgnored={claimOfferIgnored}
          claimOfferRejected={claimOfferRejected}
          navigation={navigation}
          uid={navigation.state.params.uid}
          isValid={isValid}
          logoUrl={logoUrl}
          claimThemeSecondary={claimThemeSecondary}
          claimThemePrimary={claimThemePrimary}
          updateStatusBarTheme={updateStatusBarTheme}
          claimOfferShowStart={claimOfferShowStart}
          resetClaimRequestStatus={resetClaimRequestStatus}
        />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.root.findByType(ClaimOffer).instance
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
