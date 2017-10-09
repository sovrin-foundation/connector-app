// @flow
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import FCM from 'react-native-fcm'
import { Container, TouchId } from '../../components'
import { TOUCH_ID_MESSAGE, TOUCH_ID_NOT_AVAILABLE } from '../../common'
import RequestDetail from './request-detail'
import RequestActions from './request-actions'
import type { RequestProps, RequestState, ResponseTypes } from './type-request'
import { captureError } from '../../services'

export default class Request extends PureComponent<
  void,
  RequestProps,
  RequestState
> {
  state = {
    tapCount: 0,
  }

  onTitlePress = () => {
    this.setState({
      tapCount: this.state.tapCount + 1,
    })
  }

  onAccept = () => {
    // Move these values to enum, we are not doing it now because of TODO in type file
    return this.onAction('accepted')
  }

  onDecline = () => {
    // Move these values to enum, we are not doing it now because of TODO in type file
    return this.onAction('rejected')
  }

  onAction = (response: ResponseTypes) => {
    return FCM.requestPermissions()
      .then(() => {
        // TODO: need to remove this once the PIN code story is done
        if (this.state.tapCount > 3) {
          // reset once any action is done by user
          this.setState({ tapCount: 0 })
          this.props.onAction(response)
        } else {
          return TouchId.authenticate(TOUCH_ID_MESSAGE)
            .then(() => {
              this.props.onAction(response)
            })
            .catch(error => {
              // TouchId not supported or not available
              captureError(error, this.props.showErrorAlerts)
            })
        }
      })
      .catch(error => {
        // TODO: we did not get push token
        // now what should we do?
        captureError(error)
      })
  }

  render() {
    return (
      <Container>
        <Container fifth>
          <RequestDetail
            title={this.props.title}
            message={this.props.message}
            onTitlePress={this.onTitlePress}
            senderLogoUrl={this.props.senderLogoUrl}
          />
        </Container>
        <View>
          <RequestActions
            onAccept={this.onAccept}
            onDecline={this.onDecline}
            senderLogoUrl={this.props.senderLogoUrl}
          />
        </View>
      </Container>
    )
  }
}
