// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import ProofModal from '../proof-modal'
import { PROOF_STATUS } from '../type-proof-request'
import { getStore } from '../../../__mocks__/static-data'

describe('<ProofModal />', () => {
  const title = 'Home Address'
  const name = 'Test Issuer'
  const logoUrl = 'http://testissuer.com/logoUrl.png'
  const store = getStore()
  let onContinue

  beforeEach(() => {
    onContinue = jest.fn()
  })

  it('should match snapshot when sending proof', () => {
    const proofStatus = PROOF_STATUS.SENDING_PROOF

    const wrapper = renderer
      .create(
        <Provider store={store}>
          <ProofModal
            proofStatus={proofStatus}
            title={title}
            name={name}
            onContinue={onContinue}
            logoUrl={logoUrl}
          />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot when proof sent success', () => {
    const proofStatus = PROOF_STATUS.SEND_PROOF_SUCCESS
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <ProofModal
            proofStatus={proofStatus}
            title={title}
            name={name}
            onContinue={onContinue}
            logoUrl={logoUrl}
          />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })

  it('should match snapshot when proof sent fail', () => {
    const proofStatus = PROOF_STATUS.SEND_PROOF_FAIL
    const wrapper = renderer
      .create(
        <Provider store={store}>
          <ProofModal
            proofStatus={proofStatus}
            title={title}
            name={name}
            onContinue={onContinue}
            logoUrl={logoUrl}
          />
        </Provider>
      )
      .toJSON()
    expect(wrapper).toMatchSnapshot()
  })
})
