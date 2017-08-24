// @flow
import React, { PureComponent } from 'react'
import { CustomView, Container, CustomButton } from '../../components'
import { DENY, ALLOW } from '../../common'
import type { RequestActionsProps } from './type-request'

export default class RequestActions
  extends PureComponent<void, RequestActionsProps, void> {
  render() {
    return (
      <CustomView row>
        <Container>
          <CustomButton
            secondary
            raised
            title={DENY}
            onPress={this.props.onDecline}
          />
        </Container>
        <Container>
          <CustomButton
            primary
            raised
            title={ALLOW}
            onPress={this.props.onAccept}
          />
        </Container>
      </CustomView>
    )
  }
}
