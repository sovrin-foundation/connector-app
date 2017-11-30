// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ProofRequest } from '../proof-request'
import { PROOF_REQUEST_STATUS, PROOF_STATUS } from '../type-proof-request'
import { color } from '../../common/styles'

describe('<ProofRequest />', () => {
  let store = {
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
        proofRequest: {
          ['usd123']: {
            payload: {
              data: {
                name: 'Home Address',
                version: '1.0.0',
                requestedAttributes: [
                  {
                    label: 'Address 1',
                  },
                  {
                    label: 'Address 2',
                  },
                ],
              },
              requester: {
                name: 'Test Requester',
              },
              statusMsg: 'pending',
            },
            payloadInfo: {
              uid: 'usd123',
              senderLogoUrl: 'http://testissuer.com/logoUrl.png',
              remotePairwiseDID: 'ha66899sadfjZJGINKN0770',
            },
            error: null,
            status: PROOF_REQUEST_STATUS.RECEIVED,
            proofStatus: PROOF_STATUS.NONE,
            senderLogoUrl: 'http://testissuer.com/logoUrl.png',
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

  let wrapper
  let proofRequestShown
  let acceptProofRequest
  let rejectProofRequest
  let ignoreProofRequest
  let tree
  let navigation
  let componentInstance
  const isValid = true
  const logoUrl = 'http://testissuer.com/logoUrl.png'
  const data = {
    name: 'Home Address',
    version: '1.0.0',
    requestedAttributes: [
      {
        label: 'Address 1',
      },
      {
        label: 'Address 2',
      },
    ],
  }

  const name = 'Test Issuer'
  const uid = 'usd123'
  let proofStatus = PROOF_STATUS.NONE

  beforeEach(() => {
    proofRequestShown = jest.fn()
    acceptProofRequest = jest.fn()
    rejectProofRequest = jest.fn()
    ignoreProofRequest = jest.fn()
    navigation = {
      goBack: jest.fn(),
      state: {
        params: {
          uid: 'usd123',
        },
      },
    }
    wrapper = renderer.create(
      <Provider store={store}>
        <ProofRequest
          data={data}
          proofStatus={proofStatus}
          logoUrl={logoUrl}
          name={name}
          proofRequestShown={proofRequestShown}
          acceptProofRequest={acceptProofRequest}
          ignoreProofRequest={ignoreProofRequest}
          rejectProofRequest={rejectProofRequest}
          navigation={navigation}
          uid={navigation.state.params.uid}
          isValid={isValid}
        />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.getInstance()._reactInternalInstance.child
      .stateNode
  })

  it('should call proofRequestShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(proofRequestShown).toHaveBeenCalledWith('usd123')
  })

  it('should call acceptproofRequest if offer is accepted', () => {
    componentInstance.onSend()
    expect(acceptProofRequest).toHaveBeenCalledWith('usd123')
  })

  it('should call proofRequestIgnored if close button is pressed', () => {
    componentInstance.onIgnore()
    expect(ignoreProofRequest).toHaveBeenCalledWith('usd123')
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('should call proofRequestRejected if ignore button is pressed', () => {
    componentInstance.onReject()
    expect(rejectProofRequest).toHaveBeenCalledWith('usd123')
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('should go back on close action', () => {
    componentInstance.close()
    expect(navigation.goBack).toHaveBeenCalled()
  })
})
