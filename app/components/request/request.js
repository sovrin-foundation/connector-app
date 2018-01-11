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
          // TODO using the real TouchId here, need to use the common TouchId
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
            onTitlePress={this.onTitlePress}
            senderLogoUrl={senderLogoUrl}
            testID={testID}
          />
        </Container>
        <FooterActions
          onAccept={this.onAccept}
          onDecline={this.onDecline}
          logoUrl={senderLogoUrl}
          testID={testID}
        />
      </Container>
    )
  }
}
