// @flow
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FCM from 'react-native-fcm'
import { bindActionCreators } from 'redux'
import { Container, TouchId } from '../../components'
import { connect } from 'react-redux'
import { TOUCH_ID_MESSAGE, TOUCH_ID_NOT_AVAILABLE } from '../../common'
import RequestDetail from './request-detail'
import FooterActions from '../footer-actions/footer-actions'
import type { RequestProps, RequestState, ResponseTypes } from './type-request'
import { captureError } from '../../services/error/error-handler'
import { lockAuthorizationRoute } from '../../common/route-constants'
import type { Store } from '../../store/type-store'
import { pushNotificationPermissionAction } from '../../push-notification/push-notification-store'

export class Request extends PureComponent<RequestProps, RequestState> {
  state = {
    disableAccept: false,
  }

  onAccept = () => {
    this.setState({ disableAccept: true })
    // Move these values to enum, we are not doing it now because of TODO in type file
    return this.onAction('accepted')
  }

  onDecline = () => {
    // Move these values to enum, we are not doing it now because of TODO in type file
    return this.onAction('rejected')
  }

  onSuccessfulAuthorization = (response: ResponseTypes) => {
    this.props.onAction(response)
  }

  onAvoidAuthorization = () => {
    /**
     * User can choose to avoid entering pass code either by canceling
     * or by pressing back button and choose to ignore pass code
     * then once user comes back, we need to re-enable button
     * so that user can press accept or decline button again
     */
    this.setState({ disableAccept: false })
  }

  onTouchIdFailed = (response: ResponseTypes) =>
    this.props.navigation.navigate(lockAuthorizationRoute, {
      onSuccess: () => this.onSuccessfulAuthorization(response),
      onAvoid: () => this.onAvoidAuthorization(),
    })

  authenticate = (response: ResponseTypes) => {
    return TouchId.isSupported()
      .then(result => TouchId.authenticate(TOUCH_ID_MESSAGE))
      .then(() => this.onSuccessfulAuthorization(response))
      .catch(() => this.onTouchIdFailed(response))
  }

  checkIfTouchIdEnabled(response: ResponseTypes) {
    if (this.props.isTouchIdEnabled) {
      return this.authenticate(response)
    } else {
      this.onTouchIdFailed(response)
    }
  }

  onAction = (response: ResponseTypes) => {
    return FCM.requestPermissions()
      .then(() => {
        this.props.pushNotificationPermissionAction(true)
        this.checkIfTouchIdEnabled(response)
      })
      .catch(error => {
        // astute readers will notice that we are calling authenticate
        // in success and fail both, so we can move it outside of promise
        // but we need to authenticate after user take allow/deny action
        // for push notification, after user allows/denies push notification
        // we need to authenticate user either with TouchId or pass code
        // unfortunately React-Native's (ES6's as well) Promise implementation
        // does not have finally block
        this.checkIfTouchIdEnabled(response)
        // TODO: we did not get push token
        // now what should we do?
        captureError(error, this.props.showErrorAlerts)
      })
  }

  componentDidUpdate(prevProps: RequestProps) {
    if (
      this.props.invitationError !== prevProps.invitationError &&
      this.props.invitationError
    ) {
      this.setState({
        disableAccept: false,
      })
    }
  }

  render() {
    const { title, message, senderLogoUrl, testID }: RequestProps = this.props

    return (
      <Container>
        <Container fifth>
          <RequestDetail
            title={title}
            message={message}
            senderLogoUrl={senderLogoUrl}
            testID={testID}
          />
        </Container>
        <FooterActions
          disableAccept={this.state.disableAccept}
          disableDeny={this.state.disableAccept}
          onAccept={this.onAccept}
          onDecline={this.onDecline}
          logoUrl={senderLogoUrl}
          testID={testID}
          useColorPicker={true}
        />
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushNotificationPermissionAction,
    },
    dispatch
  )

const mapStateToProps = ({ lock }: Store) => {
  return {
    isTouchIdEnabled: lock.isTouchIdEnabled,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Request)
