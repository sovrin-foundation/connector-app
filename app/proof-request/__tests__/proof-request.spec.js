// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import {
  ProofRequest,
  enablePrimaryAction,
  getPrimaryActionText,
  isInvalidValues,
  getMissingAttributeNames,
} from '../proof-request'
import {
  PROOF_REQUEST_STATUS,
  PROOF_STATUS,
  PRIMARY_ACTION_SEND,
  PRIMARY_ACTION_GENERATE_PROOF,
  MESSAGE_MISSING_ATTRIBUTES_TITLE,
  MESSAGE_ERROR_PROOF_GENERATION_TITLE,
  MESSAGE_ERROR_PROOF_GENERATION_DESCRIPTION,
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
import { Alert } from 'react-native'

describe('<ProofRequest />', () => {
  const store = getStore()
  let wrapper
  let tree
  let navigation
  let componentInstance
  let proofStatus = PROOF_STATUS.NONE
  let props

  navigation = getNavigation({ uid })
  let getProps = () => ({
    data: proofRequestData,
    proofStatus: proofStatus,
    originalProofRequestData: originalProofRequestData,
    remotePairwiseDID: senderDid1,
    name: senderName1,
    proofRequestShown: jest.fn(),
    acceptProofRequest: jest.fn(),
    ignoreProofRequest: jest.fn(),
    rejectProofRequest: jest.fn(),
    getProof: jest.fn(),
    updateAttributeClaim: jest.fn(),
    navigation: navigation,
    uid:
      (navigation &&
        navigation.state &&
        navigation.state.params &&
        navigation.state.params.uid) ||
      '',
    isValid: true,
    logoUrl: senderLogoUrl1,
    claimMap: claimMap,
    missingAttributes: {},
    userSelfAttestedAttributes: jest.fn(),
    userAvatarSource: undefined,
    proofRequestShowStart: jest.fn(),
  })
  beforeEach(() => {
    props = getProps()
    wrapper = renderer.create(
      <Provider store={store}>
        <ProofRequest {...props} />
      </Provider>
    )
    tree = wrapper.toJSON()
    componentInstance = wrapper.root.findByType(ProofRequest).instance
  })

  it('should call proofRequestShown on componentDidMount', () => {
    expect(tree).toMatchSnapshot()
    expect(props.proofRequestShown).toHaveBeenCalledWith(uid)
  })

  it('should call userSelfAttestedAttributes if there are missing attributes', () => {
    wrapper.update(
      <Provider store={store}>
        <ProofRequest {...props} missingAttributes={{ name: {} }} />
      </Provider>
    )
    componentInstance.onSend()
    expect(componentInstance.state.generateProofClicked).toBe(true)
    expect(componentInstance.state.disableUserInputs).toBe(true)
    expect(componentInstance.state.disableSendButton).toBe(false)

    expect(props.userSelfAttestedAttributes).toHaveBeenCalledWith(
      expect.anything(),
      uid
    )
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
  it('should call getProof if offer is accepted after generate proof is done', () => {
    // generate proof
    componentInstance.onSend()
    // accept
    componentInstance.onSend()
    expect(tree).toMatchSnapshot()
    expect(props.getProof).toHaveBeenCalledWith(uid)
  })

  it('should call proofRequestIgnored if close button is pressed', () => {
    componentInstance.onIgnore()
    expect(tree).toMatchSnapshot()
    expect(props.ignoreProofRequest).toHaveBeenCalledWith(uid)
    expect(props.navigation.goBack).toHaveBeenCalled()
  })
  it('should match state if canEnablePrimaryAction called', () => {
    componentInstance.canEnablePrimaryAction(true, { age: '28' })
    expect(componentInstance.state.allMissingAttributesFilled).toBe(true)
    expect(componentInstance.state.selfAttestedAttributes.age).toBe('28')
  })
  it('should show missing attributes alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert')
    wrapper.update(
      <Provider store={store}>
        <ProofRequest {...props} missingAttributes={{ name: {} }} />
      </Provider>
    )
    expect(alertSpy).toHaveBeenCalledWith(
      MESSAGE_MISSING_ATTRIBUTES_TITLE,
      expect.anything()
    )
    expect(alertSpy).toMatchSnapshot()
    alertSpy.mockReset()
    alertSpy.mockRestore()
  })

  it('should show Error generating proof alert if generate proof error occurs', async () => {
    jest.useFakeTimers()
    const alertSpy = jest.spyOn(Alert, 'alert')
    wrapper.update(
      <Provider store={store}>
        <ProofRequest
          {...props}
          proofGenerationError={{
            code: 'OCS-002',
            message: 'No pairwise connection found',
          }}
          proofStatus={PROOF_STATUS.SEND_PROOF_FAIL}
        />
      </Provider>
    )
    jest.runOnlyPendingTimers()
    expect(alertSpy).toHaveBeenCalledWith(
      MESSAGE_ERROR_PROOF_GENERATION_TITLE,
      MESSAGE_ERROR_PROOF_GENERATION_DESCRIPTION,
      expect.anything(),
      { cancelable: false }
    )
    expect(alertSpy).toMatchSnapshot()
    alertSpy.mockReset()
    alertSpy.mockRestore()
  })
  it('should show Error generating proof alert if there is Proof Send Data error', async () => {
    jest.useFakeTimers()
    const alertSpy = jest.spyOn(Alert, 'alert')
    wrapper.update(
      <Provider store={store}>
        <ProofRequest
          {...props}
          errorProofSendData={{
            code: 'OCS-002',
            message: 'No pairwise connection found',
          }}
        />
      </Provider>
    )
    jest.runOnlyPendingTimers()
    expect(alertSpy).toHaveBeenCalledWith(
      MESSAGE_ERROR_PROOF_GENERATION_TITLE,
      MESSAGE_ERROR_PROOF_GENERATION_DESCRIPTION,
      expect.anything(),
      { cancelable: false }
    )
    expect(alertSpy).toMatchSnapshot()
    alertSpy.mockReset()
    alertSpy.mockRestore()
  })
  it('should set selected claims', async () => {
    const requestedAttributes = [
      [
        {
          label: 'address1',
          data: 'address3',
          key: 'a',
          cred_info: {
            cred_info: {
              referent: 'string',
              attrs: { address1: 'string' },
              schema_id: 'string',
              cred_def_id: 'string',
            },
          },
          claimUuid: '3',
        },
      ],
      [
        {
          label: 'address2',
          data: 'address4',
          key: 'b',
          claimUuid: '4',
          cred_info: {
            cred_info: {
              referent: 'string',
              attrs: { address2: 'string' },
              schema_id: 'string',
              cred_def_id: 'string',
            },
          },
        },
      ],
    ]
    wrapper.update(
      <Provider store={store}>
        <ProofRequest
          {...props}
          data={{
            ...props.data,
            // $FlowFixMe tried : type requestedAttributes= Array<Attribute |Array<Attribute>> but still getting error dont know why
            requestedAttributes,
          }}
        />
      </Provider>
    )

    expect(componentInstance.state.selectedClaims).toMatchSnapshot()
  })
  it('should update SelectedClaims', () => {
    componentInstance.setState({
      selectedClaims: {
        a: [
          '3',
          true,
          {
            cred_info: {
              attrs: {
                address1: 'string',
              },
              cred_def_id: 'string',
              referent: 'string',
              schema_id: 'string',
            },
          },
        ],
        b: [
          '4',
          true,
          {
            cred_info: {
              attrs: {
                address2: 'string',
              },
              cred_def_id: 'string',
              referent: 'string',
              schema_id: 'string',
            },
          },
        ],
      },
    })
    componentInstance.updateSelectedClaims({
      label: 'address1',
      data: 'address3',
      key: 'a',
      cred_info: {
        cred_info: {
          referent: 'updatedString',
          attrs: { address1: 'updatedString' },
          schema_id: 'updatedString',
          cred_def_id: 'updatedString',
        },
      },
      claimUuid: '9',
    })
    expect(componentInstance.state.selectedClaims['a'][0]).toBe('9')
    expect(componentInstance.state).toMatchSnapshot()
  })

  it('should call proofRequestRejected if ignore button is pressed', () => {
    componentInstance.onReject()
    expect(props.rejectProofRequest).toHaveBeenCalledWith(uid)
    expect(navigation.goBack).toHaveBeenCalled()
    expect(tree).toMatchSnapshot()
  })

  it('should go back on close action', () => {
    componentInstance.close()
    expect(navigation.goBack).toHaveBeenCalled()
    expect(tree).toMatchSnapshot()
  })
  it('should show Invalid proof request message if there is no proof Request Data', () => {
    wrapper.update(
      <Provider store={store}>
        <ProofRequest {...getProps()} isValid={false} />
      </Provider>
    )
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
  describe('fn:isInvalidValues', () => {
    it('should return true if there is at least one user filled values is missed ', () => {
      expect(isInvalidValues({ name: {}, age: {} }, { name: 'name' })).toBe(
        true
      )
    })
    it('should return true if there are no user filled values', () => {
      expect(isInvalidValues({ name: {}, age: {} }, {})).toBe(true)
    })
    it('should return true if there  no userfilledvalues', () => {
      expect(isInvalidValues({ name: {}, age: {} }, { name: 'name' })).toBe(
        true
      )
    })
    it('should return false if user filled all missing attributes', () => {
      expect(
        isInvalidValues({ name: {}, age: {} }, { name: 'name', age: 'age' })
      ).toBe(false)
    })
    it('should return true if user filled at least one of missing attributes with only spaces', () => {
      expect(
        isInvalidValues({ name: {}, age: {} }, { name: 'name', age: '  ' })
      ).toBe(true)
    })
  })
  describe('fn:getMissingAttributeNames', () => {
    it("should return string with ',' supperated", () => {
      expect(
        getMissingAttributeNames({ age: {}, name: {} }).search(', ')
      ).toBeGreaterThanOrEqual(0)
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
})
