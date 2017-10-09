// @flow
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { captureError } from '../services'
import type { Store } from '../store/type-store'
import { Request, Container } from '../components'
import type { ResponseTypes } from '../components/request/type-request'
import type {
  SMSConnectionRequestProps,
  SMSConnectionRequestState,
  SMSConnectionPayload,
} from './type-sms-connection-request'
import { homeRoute } from '../common'
import { ResponseType } from '../components/request/type-request'
import { sendSMSConnectionResponse } from './sms-connection-request-store'
import ConnectionSuccessModal from '../authentication/connection-success-modal'

export class SMSConnectionRequest extends PureComponent<
  void,
  SMSConnectionRequestProps,
  SMSConnectionRequestState
> {
  state = {
    isSuccessModalVisible: false,
  }

  _showModal = () => this.setState({ isSuccessModalVisible: true })

  _hideModal = () => this.setState({ isSuccessModalVisible: false })

  onSuccessModalContinue = () => {
    this._hideModal()
    this.props.navigation.navigate(homeRoute)
  }

  onAction = (response: ResponseTypes) => {
    this.props.sendSMSConnectionResponse({ response })
  }

  componentWillReceiveProps(nextProps: SMSConnectionRequestProps) {
    if (nextProps.request.payload !== this.props.request.payload) {
      // a new SMS connection request was received
      this._hideModal()
    } else {
      if (nextProps.request.isFetching === false) {
        if (nextProps.request.error) {
          // TODO:KS we got error from API response, what to do now
          if (nextProps.request.error != this.props.request.error)
            captureError(nextProps.request.error, this.props.showErrorAlerts)
        } else {
          // api response was successful, but now we have to check
          // if user accepted or declined the request
          if (nextProps.request.status === ResponseType.accepted) {
            this._showModal()
          } else {
            // user declined the request and that response was successfully sent to agent
            this.props.navigation.navigate(homeRoute)
          }
        }
      } else {
        // TODO:KS show loading indicator, API request was sent
      }
    }
  }

  render() {
    const payload = this.props.request.payload
    const { title, message, senderLogoUrl } = payload

    let connectionName
    if (payload) {
      connectionName = payload.connectionName
    }

    return (
      <Container>
        <Request
          title={title}
          message={message}
          senderLogoUrl={senderLogoUrl}
          onAction={this.onAction}
          showErrorAlerts={this.props.showErrorAlerts}
        />
        <ConnectionSuccessModal
          isModalVisible={this.state.isSuccessModalVisible}
          showConnectionSuccessModal={this.onSuccessModalContinue}
          name={connectionName}
          logoUrl={senderLogoUrl}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  request: state.smsConnection,
  showErrorAlerts: state.config.showErrorAlerts,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ sendSMSConnectionResponse }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(
  SMSConnectionRequest
)
