// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ClaimRequestStatusModal } from '../claim-request-modal'
import { CLAIM_REQUEST_STATUS } from '../type-claim-offer'
import type { ClaimRequestStatusModalProps } from '../type-claim-offer'
import {
  claimOfferPayload,
  senderLogoUrl,
  getStore,
} from '../../../__mocks__/static-data'

describe('<ClaimRequestStatusModal />', () => {
  const store = getStore()

  function getProps(props) {
    return {
      onContinue: jest.fn(),
      payload: claimOfferPayload,
      senderLogoUrl,
      claimRequestStatus: CLAIM_REQUEST_STATUS.SEND_CLAIM_REQUEST_SUCCESS,
      ...props,
    }
  }

  function getWrapper(props) {
    return renderer.create(
      <Provider store={store}>
        <ClaimRequestStatusModal {...props} />
      </Provider>
    )
  }

  function setup(extraProps) {
    const props = getProps(extraProps)
    const wrapper = getWrapper(props)
    const instance = wrapper.root.findByType(ClaimRequestStatusModal).instance

    return { props, wrapper, instance }
  }

  function getPaidClaimProps() {
    return {
      payTokenValue: '1000',
      message1: 'You paid',
      message3: '',
      message6: 'They will issue it to you shortly.',
    }
  }

  it('should show check mark, you accepted text, if claim request is sent', () => {
    const message = {
      message1: 'You accepted',
      message3: 'from',
      message5: '!',
    }
    const { wrapper } = setup(message)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should match snapshot when pending popOver', () => {
    const extraProps = {
      message1: 'As soon as ',
      message3: ' signs and issues ',
      message5: ' to you it will appear here',
      isPending: true,
    }
    const { wrapper } = setup(extraProps)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should show arrow right and only Paying text if paid credential request is being sent', () => {
    const paidClaimProps = getPaidClaimProps()
    const extraProps = {
      claimRequestStatus: CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST,
      isPending: true,
      ...paidClaimProps,
    }
    const { wrapper } = setup(extraProps)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should show check mark, token amount, if paid credential request is sent', () => {
    const paidClaimProps = getPaidClaimProps()
    const extraProps = {
      claimRequestStatus: CLAIM_REQUEST_STATUS.PAID_CREDENTIAL_REQUEST_SUCCESS,
      ...paidClaimProps,
    }
    const { wrapper } = setup(extraProps)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should show arrow right and accepting text, if claim request is being sent', () => {
    const extraProps = {
      message1: 'You accepted',
      message3: 'from',
      message6: '',
      claimRequestStatus: CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST,
    }
    const { wrapper } = setup(extraProps)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should hideModal if continue is clicked', () => {
    const extraProps = {
      message1: 'You accepted ',
      message3: 'from',
      message5: '!',
    }
    const { wrapper, instance } = setup(extraProps)
    instance.onContinue()
    expect(instance.state.isVisible).toBe(false)
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('should match paid credential success, if sending state changes to success', () => {
    const paidClaimProps = getPaidClaimProps()
    const extraProps = {
      claimRequestStatus: CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST,
      isPending: true,
      ...paidClaimProps,
    }
    const { wrapper, props } = setup(extraProps)
    // update component so that state changes from sending paid credential
    // to paid credential success
    wrapper.update(
      <Provider store={store}>
        <ClaimRequestStatusModal
          {...{
            ...props,
            isPending: false,
            claimRequestStatus:
              CLAIM_REQUEST_STATUS.PAID_CREDENTIAL_REQUEST_SUCCESS,
          }}
        />
      </Provider>
    )
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
