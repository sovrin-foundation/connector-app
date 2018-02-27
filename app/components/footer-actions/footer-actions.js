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
import { noop } from '../../common'

export default class FooterActions extends PureComponent<
  FooterActionsProps,
  void
> {
  render() {
    const {
      denyTitle = DENY,
      acceptTitle = CONNECT,
      logoUrl = '',
      onDecline = noop,
      onAccept = noop,
      testID,
      disableAccept = false,
      hidePrimary = false,
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
          {!hidePrimary && (
            <Container>
              <ConnectionTheme logoUrl={logoUrl} disabled={disableAccept}>
                <CustomButton
                  disabled={disableAccept}
                  primary
                  raised
                  medium
                  title={acceptTitle}
                  onPress={onAccept}
                  testID={`${testID}-accept`}
                />
              </ConnectionTheme>
            </Container>
          )}
        </CustomView>
        <ImageColorPicker imageUrl={logoUrl} />
      </View>
    )
  }
}
