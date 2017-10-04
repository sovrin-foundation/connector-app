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
import { DENY, ALLOW } from '../../common'
import type { RequestActionsProps } from './type-request'

export default class RequestActions
  extends PureComponent<void, RequestActionsProps, void> {
  render() {
    return (
      <View>
        <CustomView row>
          <Container>
            <ConnectionTheme shade="0.5">
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
            <ConnectionTheme>
              <CustomButton
                primary
                raised
                medium
                title={ALLOW}
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
