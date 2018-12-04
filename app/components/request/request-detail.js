// @flow
import React, { PureComponent } from 'react'
import { Container, CustomText, CustomView } from '../../components'
import RequestDetailText from './request-detail-text'
import RequestDetailAvatars from './request-detail-avatars'
import type { RequestDetailProps } from './type-request'

export default class RequestDetail extends PureComponent<
  RequestDetailProps,
  void
> {
  render() {
    const { testID } = this.props
    return (
      <Container useNativeDriver hCenter testID={`${testID}-text-container`}>
        <Container bottom testID={`${testID}-text-message-container`}>
          <RequestDetailText
            title={this.props.title}
            message={this.props.message}
            testID={testID}
          />
        </Container>
        <Container testID={`${testID}-text-container-avatars`}>
          <RequestDetailAvatars senderLogoUrl={this.props.senderLogoUrl} />
        </Container>
      </Container>
    )
  }
}
