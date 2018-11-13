// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ClaimOffer } from '../claim-offer'
import {
  CLAIM_OFFER_STATUS,
  CLAIM_REQUEST_STATUS,
  CREDENTIAL_OFFER_MODAL_STATUS,
} from '../type-claim-offer'
import { color } from '../../common/styles'
import {
  getStore,
  paidClaimOffer,
  claimOffer,
  senderLogoUrl1,
} from '../../../__mocks__/static-data'

let navigation = {
  goBack: jest.fn(),
  state: {
    params: {
      uid: 'asd123',
    },
  },
}
const props = {
  claimOfferShown: jest.fn(),
  acceptClaimOffer: jest.fn(),
  claimOfferIgnored: jest.fn(),
  claimOfferRejected: jest.fn(),
  navigation: navigation,
  uid: navigation.state.params.uid,
  isValid: true,
  logoUrl: senderLogoUrl1,
  claimThemeSecondary: color.bg.secondary.color,
  claimThemePrimary: color.bg.secondary.color,
  updateStatusBarTheme: jest.fn(),
  claimOfferShowStart: jest.fn(),
  resetClaimRequestStatus: jest.fn(),
}

describe('Paid <ClaimOffer />', () => {
  const store = getStore()

  let wrapper
  let tree

  let componentInstance
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

  beforeEach(() => {
    wrapper = renderer.create(
      <Provider store={store}>
        <ClaimOffer {...props} claimOfferData={paidClaimOfferData} />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.root.findByType(ClaimOffer).instance
  })

  // Todo: write test to check if token balance is displayed.
  // However not clear how to write and assertion of token balance text
  it('should call claimOfferShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(props.claimOfferShown).toHaveBeenCalled()
  })

  it('should show Insufficient Balance Modal', () => {
    jest.useFakeTimers()
    wrapper.update(
      <Provider store={store}>
        <ClaimOffer
          {...props}
          claimOfferData={{
            ...paidClaimOfferData,
            claimRequestStatus: CLAIM_REQUEST_STATUS.INSUFFICIENT_BALANCE,
          }}
          payTokenValue={paidClaimOfferData.payTokenValue}
        />
      </Provider>
    )
    componentInstance.onCredentialOfferModalHide()
    jest.runOnlyPendingTimers()
    expect(componentInstance.state.credentialOfferModalStatus).toBe(
      CREDENTIAL_OFFER_MODAL_STATUS.INSUFFICIENT_BALANCE
    )
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should show Ledger Fees Modal', () => {
    jest.useFakeTimers()
    wrapper.update(
      <Provider store={store}>
        <ClaimOffer
          {...props}
          claimOfferData={{
            ...paidClaimOfferData,
          }}
          payTokenValue={paidClaimOfferData.payTokenValue}
        />
      </Provider>
    )
    componentInstance.setState({
      credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.LEDGER_FEES,
    })
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})

describe('<ClaimOffer />', () => {
  const store = getStore()

  let wrapper
  let tree
  let navigation
  let componentInstance
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
    wrapper = renderer.create(
      <Provider store={store}>
        <ClaimOffer claimOfferData={claimOfferData} {...props} />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.root.findByType(ClaimOffer).instance
  })

  it('should call claimOfferShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(props.claimOfferShown).toHaveBeenCalled()
  })
  it('should call acceptClaimOffer if offer is accepted', () => {
    componentInstance.onAccept()
    expect(props.acceptClaimOffer).toHaveBeenCalled()
  })

  it('should call claimOfferIgnored if ignored', () => {
    componentInstance.onIgnore()
    expect(props.claimOfferIgnored).toHaveBeenCalled()
  })

  it('should show Send Paid Credential Request Fail Modal', () => {
    jest.useFakeTimers()
    wrapper.update(
      <Provider store={store}>
        <ClaimOffer
          claimOfferData={{
            ...claimOfferData,
            claimRequestStatus:
              CLAIM_REQUEST_STATUS.PAID_CREDENTIAL_REQUEST_FAIL,
          }}
          {...props}
        />
      </Provider>
    )
    componentInstance.onCredentialOfferModalHide()
    jest.runOnlyPendingTimers()
    expect(componentInstance.state.credentialOfferModalStatus).toBe(
      CREDENTIAL_OFFER_MODAL_STATUS.SEND_PAID_CREDENTIAL_REQUEST_FAIL
    )
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should enable accept button if claim offer error occurs', () => {
    jest.useFakeTimers()
    wrapper.update(
      <Provider store={store}>
        <ClaimOffer
          claimOfferData={{
            ...claimOfferData,
            claimRequestStatus: CLAIM_REQUEST_STATUS.SEND_CLAIM_REQUEST_FAIL,
          }}
          {...props}
        />
      </Provider>
    )
    jest.runOnlyPendingTimers()
    expect(componentInstance.state.disableAcceptButton).toBe(false)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should call claimOfferRejected if rejected', () => {
    componentInstance.onReject()
    expect(props.claimOfferRejected).toHaveBeenCalled()
  })

  it('should call close if closed', () => {
    componentInstance.close()
    expect(componentInstance.state.credentialOfferModalStatus).toBe(
      CREDENTIAL_OFFER_MODAL_STATUS.NONE
    )
    expect(props.navigation.goBack).toHaveBeenCalled()
  })
})
