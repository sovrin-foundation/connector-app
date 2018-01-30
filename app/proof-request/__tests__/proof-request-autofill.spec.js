// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { ProofRequest } from '../proof-request'
import { PROOF_REQUEST_STATUS, PROOF_STATUS } from '../type-proof-request'
import {
  getStore,
  originalProofRequestData,
  proofRequest,
  senderDid1,
  senderName1,
  senderLogoUrl1,
  uid,
} from '../../../__mocks__/static-data'

describe('<ProofRequest />', () => {
  const store = getStore()
  let wrapper
  let proofRequestShown
  let acceptProofRequest
  let rejectProofRequest
  let ignoreProofRequest
  let getProof
  let tree
  let navigation
  let componentInstance
  const isValid = true
  let proofStatus = PROOF_STATUS.NONE

  beforeEach(() => {
    proofRequestShown = jest.fn()
    acceptProofRequest = jest.fn()
    rejectProofRequest = jest.fn()
    ignoreProofRequest = jest.fn()
    getProof = jest.fn()
    navigation = {
      goBack: jest.fn(),
      state: {
        params: {
          uid,
        },
      },
    }
    wrapper = renderer.create(
      <Provider store={store}>
        <ProofRequest
          data={proofRequest.payload.data}
          proofStatus={proofStatus}
          originalProofRequestData={originalProofRequestData}
          remotePairwiseDID={senderDid1}
          name={senderName1}
          proofRequestShown={proofRequestShown}
          acceptProofRequest={acceptProofRequest}
          ignoreProofRequest={ignoreProofRequest}
          rejectProofRequest={rejectProofRequest}
          getProof={getProof}
          navigation={navigation}
          uid={navigation.state.params.uid}
          isValid={isValid}
          logoUrl={senderLogoUrl1}
        />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.getInstance()._reactInternalInstance.child
      .stateNode
  })

  it('should call proofRequestShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(proofRequestShown).toHaveBeenCalledWith(uid)
  })
})
