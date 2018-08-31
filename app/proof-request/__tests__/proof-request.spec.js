// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import {
  ProofRequest,
  enablePrimaryAction,
  getPrimaryActionText,
} from '../proof-request'
import {
  PROOF_REQUEST_STATUS,
  PROOF_STATUS,
  PRIMARY_ACTION_SEND,
  PRIMARY_ACTION_GENERATE_PROOF,
} from '../type-proof-request'
import { color } from '../../common/styles'
import {
  getStore,
  claimMap,
  originalProofRequestData,
  proofRequestData,
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
    getProof = jest.fn()
    updateAttributeClaim = jest.fn()
    navigation = getNavigation({ uid })
    proofRequestShowStart = jest.fn()

    wrapper = renderer.create(
      <Provider store={store}>
        <ProofRequest
          data={proofRequestData}
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
          claimMap={claimMap}
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

  it('should call getProof if offer is accepted after generate proof is done', () => {
    // generate proof
    componentInstance.onSend()
    // accept
    componentInstance.onSend()
    expect(getProof).toHaveBeenCalledWith(uid)
  })

  it('should call proofRequestIgnored if close button is pressed', () => {
    componentInstance.onIgnore()
    expect(ignoreProofRequest).toHaveBeenCalledWith(uid)
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('should call proofRequestRejected if ignore button is pressed', () => {
    componentInstance.onReject()
    expect(rejectProofRequest).toHaveBeenCalledWith(uid)
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it('should go back on close action', () => {
    componentInstance.close()
    expect(navigation.goBack).toHaveBeenCalled()
  })
})

describe('fn: enablePrimaryAction & getPrimaryActionText', () => {
  describe('No Missing Attributes', () => {
    const missingAttributes = {}
    const generateProofClicked = false
    const allMissingAttributesFilled = false

    it('all requested attributes filled, no error', () => {
      const requestedAttributes = [{ label: 'Address 1', data: 'data' }]
      const error = null
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(true)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_SEND)
    })

    it('all requested attributes filled, error', () => {
      const requestedAttributes = [{ label: 'Address 1', data: 'data' }]
      const generateProofClicked = true
      const error = {
        code: 'TEST',
        message: 'message',
      }
      const allMissingAttributesFilled = false
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(false)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_SEND)
    })

    it('some requested attributes are filled, no error', () => {
      const requestedAttributes = [
        { label: 'Address 1' },
        { label: 'Address 2', data: 'address' },
      ]
      const error = null
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(false)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_SEND)
    })

    it('some requested attributes are filled, error', () => {
      const requestedAttributes = [
        { label: 'Address 1' },
        { label: 'Address 2', data: 'address' },
      ]
      const error = {
        code: 'TEST',
        message: 'message',
      }
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(false)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_SEND)
    })
  })

  describe('Missing Attributes', () => {
    const missingAttributes = {
      'address 1': { name: 'Address 1', data: '', key: 'attr1' },
      'address 2': { name: 'Address 2', data: '', key: 'attr2' },
    }

    it('not all missing attributes filled, generate not clicked, no requested attributes filled', () => {
      const requestedAttributes = [
        { label: 'address 1' },
        { label: 'address 2' },
      ]
      const generateProofClicked = false
      const error = null
      const allMissingAttributesFilled = false
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(false)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_GENERATE_PROOF)
    })

    it('all missing attributes filled, generate not clicked, no requested attributes', () => {
      const requestedAttributes = [
        { label: 'address 1' },
        { label: 'address 2' },
      ]
      const generateProofClicked = false
      const error = null
      const allMissingAttributesFilled = true
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(true)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_GENERATE_PROOF)
    })

    it('all missing attributes filled, generate clicked, no requested attributes filled', () => {
      const requestedAttributes = [
        { label: 'address 1' },
        { label: 'address 2' },
      ]
      const generateProofClicked = true
      const error = null
      const allMissingAttributesFilled = true
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(false)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_SEND)
    })

    it('all missing attributes filled, generate clicked, some requested attributes filled', () => {
      const requestedAttributes = [
        { label: 'address 1', data: 'address value' },
        { label: 'address 2' },
      ]
      const generateProofClicked = true
      const error = null
      const allMissingAttributesFilled = true
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(false)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_SEND)
    })

    it('all missing attributes filled, generate clicked, all requested attributes filled', () => {
      const requestedAttributes = [
        { label: 'address 1', data: 'address value' },
        { label: 'address 2', data: 'address 2 value' },
      ]
      const generateProofClicked = true
      const error = null
      const allMissingAttributesFilled = true
      expect(
        enablePrimaryAction(
          missingAttributes,
          generateProofClicked,
          allMissingAttributesFilled,
          error,
          requestedAttributes
        )
      ).toBe(true)
      expect(
        getPrimaryActionText(missingAttributes, generateProofClicked)
      ).toBe(PRIMARY_ACTION_SEND)
    })
  })
})
