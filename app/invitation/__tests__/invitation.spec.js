// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import ConnectedInvitation, { Invitation } from '../invitation'
import { color } from '../../common/styles'
import { ResponseType } from '../../components/request/type-request'
import { homeRoute } from '../../common'
import { getNavigation, smsToken } from '../../../__mocks__/static-data'

describe('<Invitation />', () => {
  let store
  let dispatch
  let subscribe
  let navigation
  let sendInvitationResponse
  let smsPendingInvitationSeen
  let invitationRejected
  let instance
  let component
  let invitation
  let isSmsInvitationNotSeen

  const firstInvitation = {
    requestId: 'requestId1',
    senderAgentKeyDelegationProof: {
      agentDID: 'EHNMj5FNjA3xBo8HUKQTZv',
      agentDelegatedKey: '8Esrno7vguYbwVJDa31aMCdWJTu2tC7tke8u2iKUUvgB',
      signature:
        'OXtzqX9LJJsBY/Mrhjff6b9L79Pdg8U4B7dI/3RR65BJr5jktAGMwpMLe1aQRQT0FlplZfNy8QtUd4KNPd+ZAg==',
    },
    senderDID: 'senderDID1',
    senderEndpoint: 'endpoint',
    senderLogoUrl: 'lu',
    senderName: 'sender1',
    senderVerificationKey: 'sVk',
    targetName: 'target name',
    senderDetail: {
      name: 'default',
      agentKeyDlgProof: {
        agentDID: 'EHNMj5FNjA3xBo8HUKQTZv',
        agentDelegatedKey: '8Esrno7vguYbwVJDa31aMCdWJTu2tC7tke8u2iKUUvgB',
        signature:
          'OXtzqX9LJJsBY/Mrhjff6b9L79Pdg8U4B7dI/3RR65BJr5jktAGMwpMLe1aQRQT0FlplZfNy8QtUd4KNPd+ZAg==',
      },
      DID: '3Bb6zCYMoGnMTho97HGDrn',
      logoUrl: 'http://www.evernym.com',
      verKey: '2BzhMgbLXbECPPYiLtSEd36Boxt1oquuGJeS1ofhPoEr',
    },
    senderAgencyDetail: {
      DID: 'BDSmVkzxRYGE4HKyMKxd1H',
      verKey: '6yUatReYWNSUfEtC2ABgRXmmLaxCyQqsjLwv2BomxsxD',
      endpoint: '52.38.32.107:80/agency/msg',
    },
  }

  const getState = () => ({
    invitation: {
      senderDID1: {
        error: null,
        isFetching: false,
        payload: firstInvitation,
        status: ResponseType.none,
      },
    },
    config: {
      showErrorAlerts: true,
    },
    connections: {
      connectionThemes: {
        default: {
          primary: `rgba(${color.actions.button.primary.rgba})`,
          secondary: `rgba(${color.actions.button.secondary.rgba})`,
        },
      },
    },
  })

  beforeEach(() => {
    dispatch = jest.fn()
    subscribe = jest.fn()
    store = {
      getState,
      dispatch() {
        return dispatch
      },
      subscribe() {
        return subscribe
      },
    }
    navigation = {
      ...getNavigation({
        senderDID: firstInvitation.senderDID,
        smsToken,
      }),
    }
    const props = getState()
    invitation = props.invitation.senderDID1
    const showErrorAlerts = props.config.showErrorAlerts
    sendInvitationResponse = jest.fn()
    smsPendingInvitationSeen = jest.fn()
    invitationRejected = jest.fn()
    isSmsInvitationNotSeen = false
    component = renderer.create(
      <Provider store={store}>
        <Invitation
          invitation={invitation}
          showErrorAlerts={showErrorAlerts}
          navigation={navigation}
          sendInvitationResponse={sendInvitationResponse}
          smsPendingInvitationSeen={smsPendingInvitationSeen}
          invitationRejected={invitationRejected}
          smsToken={smsToken}
          isSmsInvitationNotSeen={false}
        />
      </Provider>
    )
    instance = component.getInstance()._reactInternalInstance.child.stateNode
  })

  it('should match snapshot', () => {
    const tree = renderer
      .create(
        <Provider store={store}>
          <ConnectedInvitation navigation={navigation} />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should dispatch correct action for accepting invitation', () => {
    const response = ResponseType.accepted
    instance.onAction(response)

    expect(sendInvitationResponse).toHaveBeenCalledWith({
      response,
      senderDID: firstInvitation.senderDID,
    })
  })

  it('should reject invitation and redirect user to Home on Deny', () => {
    instance.onAction(ResponseType.rejected)
    expect(invitationRejected).toHaveBeenCalledWith(firstInvitation.senderDID)
    expect(navigation.navigate).toHaveBeenCalledWith(homeRoute)
  })

  it('should show success modal once acceptance is sent to agent', () => {
    const invitationAfterAccept = {
      ...invitation,
      status: ResponseType.accepted,
    }
    component.update(
      <Provider store={store}>
        <Invitation
          invitation={invitationAfterAccept}
          showErrorAlerts
          navigation={navigation}
          sendInvitationResponse={sendInvitationResponse}
          invitationRejected={invitationRejected}
          smsPendingInvitationSeen={smsPendingInvitationSeen}
          smsToken={smsToken}
          isSmsInvitationNotSeen={false}
        />
      </Provider>
    )

    expect(instance.state.isSuccessModalVisible).toBe(true)
  })

  it('should call smsPendingInvitationSeen action if isSmsInvitationNotSeen is true', () => {
    const invitationAfterAccept = {
      ...invitation,
      status: ResponseType.accepted,
    }
    component.update(
      <Provider store={store}>
        <Invitation
          invitation={invitationAfterAccept}
          showErrorAlerts
          navigation={navigation}
          sendInvitationResponse={sendInvitationResponse}
          invitationRejected={invitationRejected}
          smsPendingInvitationSeen={smsPendingInvitationSeen}
          smsToken={smsToken}
          isSmsInvitationNotSeen={true}
        />
      </Provider>
    )
    expect(smsPendingInvitationSeen).toHaveBeenCalledWith(smsToken)
  })
  it('should not call smsPendingInvitationSeen action if isSmsInvitationNotSeen is false', () => {
    const invitationAfterAccept = {
      ...invitation,
      status: ResponseType.accepted,
    }
    component.update(
      <Provider store={store}>
        <Invitation
          invitation={invitationAfterAccept}
          showErrorAlerts
          navigation={navigation}
          sendInvitationResponse={sendInvitationResponse}
          invitationRejected={invitationRejected}
          smsPendingInvitationSeen={smsPendingInvitationSeen}
          smsToken={smsToken}
          isSmsInvitationNotSeen={false}
        />
      </Provider>
    )
    expect(smsPendingInvitationSeen).not.toHaveBeenCalledWith(smsToken)
  })

  it('should close modal and redirect to Home on Continue', () => {
    instance.onSuccessModalContinue()

    expect(instance.state.isSuccessModalVisible).toBe(false)
    expect(navigation.navigate).toHaveBeenCalledWith(homeRoute)
  })
})
