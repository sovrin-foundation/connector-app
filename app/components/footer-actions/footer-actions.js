// @flow
import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import type { Store } from '../../store/type-store'
import {
  CustomView,
  Container,
  CustomButton,
  ImageColorPicker,
  ConnectionTheme,
  CustomSafeAreaView,
} from '../../components'
import { DENY, CONNECT } from '../../common'
import type { FooterActionsProps } from './type-footer-actions'
import { noop } from '../../common'
import { white } from '../../common/styles/constant'
import { getConnectionTheme } from '../../store/store-selector'

const styles = StyleSheet.create({
  buttonStyle: {
    borderLeftColor: white,
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
})

export class FooterActions extends PureComponent<FooterActionsProps, void> {
  render() {
    const {
      denyTitle = DENY,
      acceptTitle = CONNECT,
      logoUrl = '',
      onDecline = noop,
      onAccept = noop,
      testID,
      disableAccept = false,
      disableDeny = false,
      hidePrimary = false,
      useColorPicker = false,
    } = this.props

    return (
      <CustomSafeAreaView
        style={[{ backgroundColor: this.props.activeConnectionThemePrimary }]}
      >
        <CustomView fifth>
          <ConnectionTheme logoUrl={logoUrl}>
            <CustomView row>
              <Container>
                <ConnectionTheme logoUrl={logoUrl} disabled={disableDeny}>
                  <CustomButton
                    primary
                    medium
                    disabled={disableDeny}
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
                      primary
                      medium
                      disabled={disableAccept}
                      title={acceptTitle}
                      onPress={onAccept}
                      testID={`${testID}-accept`}
                      style={[styles.buttonStyle]}
                      fontWeight="bold"
                    />
                  </ConnectionTheme>
                </Container>
              )}
            </CustomView>
          </ConnectionTheme>
          {useColorPicker && <ImageColorPicker imageUrl={logoUrl} />}
        </CustomView>
      </CustomSafeAreaView>
    )
  }
}

const mapStateToProps = (state: Store, props: FooterActionsProps) => {
  const activeConnectionThemePrimary = getConnectionTheme(
    state,
    props.logoUrl || ''
  ).primary

  return {
    activeConnectionThemePrimary,
  }
}

export default connect(mapStateToProps)(FooterActions)
