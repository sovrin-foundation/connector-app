// @flow
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FCM from 'react-native-fcm'
import { Container, TouchId } from '../../components'
import { TOUCH_ID_MESSAGE, TOUCH_ID_NOT_AVAILABLE } from '../../common'
import RequestDetail from './request-detail'
import FooterActions from '../footer-actions/footer-actions'
import type { RequestProps, RequestState, ResponseTypes } from './type-request'
import { captureError } from '../../services/error/error-handler'
import { lockAuthorizationRoute } from '../../common/route-constants'

export default class Request extends PureComponent<
  void,
  RequestProps,
  RequestState
> {
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

  authenticate = (response: ResponseTypes) => {
    return TouchId.authenticate(TOUCH_ID_MESSAGE)
      .then(() => this.onSuccessfulAuthorization(response))
      .catch(() => {
        this.props.navigation.navigate(lockAuthorizationRoute, {
          onSuccess: () => this.onSuccessfulAuthorization(response),
        })
      })
  }

  onAction = (response: ResponseTypes) => {
    return FCM.requestPermissions()
      .then(() => this.authenticate(response))
      .catch(error => {
        // astute readers will notice that we are calling authenticate
        // in success and fail both, so we can move it outside of promise
        // but we need to authenticate after user take allow/deny action
        // for push notification, after user allows/denies push notification
        // we need to authenticate user either with TouchId or pass code
        // unfortunately React-Native's (ES6's as well) Promise implementation
        // does not have finally block
        this.authenticate(response)
        // TODO: we did not get push token
        // now what should we do?
        captureError(error, this.props.showErrorAlerts)
      })
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
          onAccept={this.onAccept}
          onDecline={this.onDecline}
          logoUrl={senderLogoUrl}
          testID={testID}
        />
      </Container>
    )
  }
}
