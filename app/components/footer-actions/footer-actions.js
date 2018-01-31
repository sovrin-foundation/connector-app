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
import type { FooterActionsProps } from './type-footer-actions'

export default class FooterActions extends PureComponent<
  void,
  FooterActionsProps,
  void
> {
  render() {
    const {
      denyTitle = DENY,
      acceptTitle = CONNECT,
      logoUrl,
      onDecline,
      onAccept,
      testID,
    } = this.props
    return (
      <View>
        <CustomView row>
          <Container>
            <ConnectionTheme logoUrl={logoUrl} secondary>
              <CustomButton
                secondary
                raised
                medium
                title={denyTitle}
                onPress={onDecline}
                testID={`${testID}-deny`}
              />
            </ConnectionTheme>
          </Container>
          <Container>
            <ConnectionTheme logoUrl={logoUrl}>
              <CustomButton
                disabled={this.props.disableAccept}
                primary
                raised
                medium
                title={acceptTitle}
                onPress={onAccept}
                testID={`${testID}-accept`}
              />
            </ConnectionTheme>
          </Container>
        </CustomView>
        <ImageColorPicker imageUrl={logoUrl} />
      </View>
    )
  }
}
