// @flow
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import {
  CustomView,
  Container,
  CustomButton,
  ImageColorPicker,
  ConnectionTheme,
} from '../../components'
import { DENY, CONNECT } from '../../common'
import type { RequestActionsProps } from './type-request'

export default class RequestActions extends PureComponent<
  void,
  RequestActionsProps,
  void
> {
  render() {
    return (
      <View>
        <CustomView row>
          <Container>
            <ConnectionTheme logoUrl={this.props.senderLogoUrl} secondary>
              <CustomButton
                secondary
                raised
                medium
                title={DENY}
                onPress={this.props.onDecline}
              />
            </ConnectionTheme>
          </Container>
          <Container>
            <ConnectionTheme logoUrl={this.props.senderLogoUrl}>
              <CustomButton
                primary
                raised
                medium
                title={CONNECT}
                onPress={this.props.onAccept}
              />
            </ConnectionTheme>
          </Container>
        </CustomView>
        <ImageColorPicker imageUrl={this.props.senderLogoUrl} />
      </View>
    )
  }
}
