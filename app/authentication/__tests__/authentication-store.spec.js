// @flow
import authentication, {
  sendUserAuthenticationResponseSuccess,
  sendUserAuthenticationResponseFailure,
  authenticationRequestReceived,
  resetAuthenticationStatus,
  sendUserAuthenticationResponse,
  AUTHENTICATION_TYPE,
  AUTHENTICATION_STATUS,
} from '../authentication-store'
import type {
  AuthenticationStatus,
  AuthenticationType,
  AuthenticationStore,
  AuthenticationPayload,
  NewConnection,
  AuthenticationError,
  ResetAuthenticationStatus,
  AuthenticationAction,
  SendUserAuthenticationResponse,
  AuthenticationSuccessData,
  SendUserAuthenticationResponseSuccess,
  SendUserAuthenticationResponseFailure,
  AuthenticationRequestReceived,
} from '../type-authentication'
import { PUSH_NOTIFICATION_SENT_CODE } from '../../api/api-constants'

describe('Authentication request tests', () => {
  const initialAction: AuthenticationAction = {
    type: 'INITIAL_TEST_ACTION',
  }

  let initialState
  beforeEach(() => {
    initialState = authentication(undefined, initialAction)
  })

  it('should correctly match initial state', () => {
    expect(initialState).toMatchSnapshot()
  })

  it('send user authentication response success action should update store', () => {
    const successData = {
      newStatus: AUTHENTICATION_STATUS.ACCEPTED,
      dataBody: { challenge: 'challenge', signature: 'signature' },
      identifier: 'identifier',
      remoteConnectionId: 'remoteConnectionId',
    }
    const successAction: SendUserAuthenticationResponseSuccess = sendUserAuthenticationResponseSuccess(
      successData
    )
    expect(authentication(initialState, successAction)).toMatchSnapshot()
  })

  it('send user authentication response failure action should update store', () => {
    const error = {
      message: '',
      authenticationType: AUTHENTICATION_TYPE.AUTHENTICATION_REQUEST,
    }
    const errorAction: SendUserAuthenticationResponseFailure = sendUserAuthenticationResponseFailure(
      error
    )
    expect(authentication(initialState, errorAction)).toMatchSnapshot()
  })

  it('authentication status reset action should update store', () => {
    const resetAction: ResetAuthenticationStatus = resetAuthenticationStatus()
    expect(authentication(initialState, resetAction)).toMatchSnapshot()
  })

  it('send user authentication response received action should update store', () => {
    const receivedData = {
      offerMsgTitle: 'Hi There',
      offerMsgText: 'Suncoast Credit Union (sandbox) wants to connect with you',
      statusCode: PUSH_NOTIFICATION_SENT_CODE,
      logoUrl: null,
      remoteConnectionId: 'B4Y9fhpeHdGHBKKtSgAYrB',
    }
    const receivedAction: AuthenticationRequestReceived = authenticationRequestReceived(
      receivedData
    )
    expect(authentication(initialState, receivedAction)).toMatchSnapshot()
  })

  it('send user authentication response', () => {
    const newStatus = 'some status'
    const challenge = 'some challenge'
    const signature = 'some signature'
    const identifier = 'some identifier'

    const responseAction: SendUserAuthenticationResponse = sendUserAuthenticationResponse(
      {
        newStatus,
        identifier,
        remoteConnectionId: 'remoteConnectionId',
        dataBody: {
          challenge,
          signature,
        },
      },
      {
        agencyUrl: 'some agency url',
        callCenterUrl: 'some call center url',
        agencyDID: 'some DID',
        agencyVerificationKey: 'some VerificationKey',
        isAlreadyInstalled: true,
        isHydrated: true,
        showErrorAlerts: false,
        showDevMode: false,
        poolConfig: 'some text',
      },
      AUTHENTICATION_TYPE.AUTHENTICATION_REQUEST
    )
    expect(authentication(initialState, responseAction)).toMatchSnapshot()
  })
})
