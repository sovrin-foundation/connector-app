// @flow
import React, { PureComponent } from 'react'
import { Container, CustomText, CustomView } from '../../components'
import RequestDetailText from './request-detail-text'
import RequestDetailAvatars from './request-detail-avatars'
import type { RequestDetailProps } from './type-request'

export default class RequestDetail
  extends PureComponent<void, RequestDetailProps, void> {
  render() {
    return (
      <Container useNativeDriver testID={'invitation-text-container'}>
        <Container bottom testID={'invitation-text-message-container'}>
          <RequestDetailText
            title={this.props.title}
            message={this.props.message}
            onTitlePress={this.props.onTitlePress}
          />
        </Container>
        <Container testID={'invitation-text-container-avatars'}>
          <RequestDetailAvatars senderLogoUrl={this.props.senderLogoUrl} />
        </Container>
      </Container>
    )
  }
}
