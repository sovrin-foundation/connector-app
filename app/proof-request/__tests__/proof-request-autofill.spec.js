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
  getNavigation,
} from '../../../__mocks__/static-data'

describe('<ProofRequest />', () => {
  const store = getStore()
  let wrapper
  let proofRequestShown
  let acceptProofRequest
  let rejectProofRequest
  let ignoreProofRequest
  let getProof
  let updateAttributeClaim
  let tree
  let navigation
  let componentInstance
  let userSelfAttestedAttributes
  let proofRequestShowStart
  const isValid = true
  let proofStatus = PROOF_STATUS.NONE

  beforeEach(() => {
    proofRequestShown = jest.fn()
    acceptProofRequest = jest.fn()
    rejectProofRequest = jest.fn()
    ignoreProofRequest = jest.fn()
    userSelfAttestedAttributes = jest.fn()
    proofRequestShowStart = jest.fn()

    getProof = jest.fn()
    updateAttributeClaim = jest.fn()
    navigation = getNavigation({ uid })
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
          updateAttributeClaim={updateAttributeClaim}
          navigation={navigation}
          uid={navigation.state.params.uid || ''}
          isValid={isValid}
          logoUrl={senderLogoUrl1}
          missingAttributes={{}}
          userSelfAttestedAttributes={userSelfAttestedAttributes}
          userAvatarSource={undefined}
          proofRequestShowStart={proofRequestShowStart}
        />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.root.findByType(ProofRequest).instance
  })

  it('should call proofRequestShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(proofRequestShown).toHaveBeenCalledWith(uid)
  })
})
