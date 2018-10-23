// @flow
import React, { PureComponent } from 'react'
import { View, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { captureError } from '../services/error/error-handler'
import {
  Request,
  Container,
  CustomModal,
  Loader,
  CustomText,
  CustomView,
} from '../components'
import { homeRoute } from '../common'
import { OFFSET_1X } from '../common/styles'
import { ResponseType } from '../components/request/type-request'
import { sendInvitationResponse, invitationRejected } from './invitation-store'
import type { Store } from '../store/type-store'
import type { ResponseTypes } from '../components/request/type-request'
import type { InvitationProps, InvitationState } from './type-invitation'
import type { ReactNavigation } from '../common/type-common'
import { smsPendingInvitationSeen } from '../sms-pending-invitation/sms-pending-invitation-store'
import { SMSPendingInvitationStatus } from '../sms-pending-invitation/type-sms-pending-invitation'
import { NavigationActions } from 'react-navigation'
import { barStyleDark, color } from '../common/styles/constant'

export class Invitation extends PureComponent<
  InvitationProps,
  InvitationState
> {
  state = {
    loading: false,
  }

  isLoading = (state: boolean) => this.setState({ loading: state })

  navigate = () => {
    this.props.navigation.navigate(homeRoute)
  }

  onSuccess = () => {
    setTimeout(() => {
      this.navigate()
    }, 500)
  }

  onAction = (response: ResponseTypes) => {
    const { invitation } = this.props
    if (invitation) {
      const { payload } = invitation
      if (payload) {
        if (response === ResponseType.accepted) {
          this.props.sendInvitationResponse({
            response,
            senderDID: payload.senderDID,
          })
        } else if (response === ResponseType.rejected) {
          this.props.invitationRejected(payload.senderDID)
          this.navigate()
        }
      } else {
        this.onSuccess()
      }
    }
  }

  componentWillReceiveProps(nextProps: InvitationProps) {
    // If invitation itself not generated then don't check payload
    if (nextProps.invitation && this.props.invitation) {
      if (
        this.props.invitation !== undefined &&
        nextProps.invitation.payload !== this.props.invitation.payload
      ) {
        // a new invitation was received
        this.isLoading(false)
      } else {
        if (nextProps.invitation.isFetching === false) {
          if (nextProps.invitation.error) {
            // TODO:KS we got error from API response, what to do now
            if (nextProps.invitation.error != this.props.invitation.error) {
              // TODO: captureError should only accept Error object or only json
              // as of now it would fail for JSON objects, as we are using
              // captureException of Sentry which is supposed to take only Error object
              // captureError(nextProps.invitation.error, this.props.showErrorAlerts)
              this.isLoading(false)
            }
          } else {
            // api response was successful, but now we have to check
            // if user accepted or declined the request
            if (nextProps.invitation.status === ResponseType.accepted) {
              this.isLoading(false)
              this.onSuccess()
            }
          }
        } else {
          // TODO:KS show loading indicator, API request was sent
          this.isLoading(true)
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.isSmsInvitationNotSeen) {
      this.props.smsPendingInvitationSeen(this.props.smsToken)
    }
  }

  render() {
    const { invitation, showErrorAlerts, navigation } = this.props

    if (invitation) {
      let { payload } = invitation
      let senderName = ''
      let title = 'Hi'
      let message = 'You have received a connection request'
      let senderLogoUrl = undefined
      if (payload) {
        senderName = payload.senderName
        title = `Hi ${payload.targetName}`
        message = `${senderName} wants to connect with you.`
        senderLogoUrl = payload.senderLogoUrl
        return (
          <Container>
            <StatusBar
              barStyle={barStyleDark}
              animated={true}
              backgroundColor={color.bg.fifth.color}
            />
            <Request
              title={title}
              message={message}
              senderLogoUrl={senderLogoUrl}
              onAction={this.onAction}
              testID={'invitation'}
              navigation={navigation}
              showErrorAlerts={showErrorAlerts}
              invitationError={invitation.error}
              senderName={senderName}
            />
            {this.state.loading && (
              <CustomModal
                testID={'invitation'}
                isVisible={this.state.loading}
                fullScreen
              >
                <CustomView center style={[{ height: '90%' }]}>
                  <CustomText
                    h5
                    center
                    tertiary
                    bg="tertiary"
                    transparentBg
                    style={[{ marginBottom: OFFSET_1X / 2 }]}
                    bold
                  >
                    Connecting...
                  </CustomText>
                  <Loader />
                </CustomView>
              </CustomModal>
            )}
          </Container>
        )
      }
    }
    return <Container />
  }
}

const mapStateToProps = (state: Store, { navigation }: ReactNavigation) => {
  const senderDID = navigation.state ? navigation.state.params.senderDID : ''
  const smsToken = navigation.state ? navigation.state.params.token : null
  const isSmsInvitationNotSeen =
    smsToken &&
    state.smsPendingInvitation[smsToken] &&
    state.smsPendingInvitation[smsToken].status !==
      SMSPendingInvitationStatus.SEEN
  return {
    invitation: state.invitation[senderDID],
    showErrorAlerts: state.config.showErrorAlerts,
    smsToken,
    isSmsInvitationNotSeen,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { sendInvitationResponse, invitationRejected, smsPendingInvitationSeen },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Invitation)
