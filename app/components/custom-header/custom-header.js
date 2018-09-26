// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, StatusBar, Platform } from 'react-native'
import type { CustomHeaderProps } from './type-custom-header'
import { SafeAreaView } from 'react-navigation'
import { withNavigationFocus } from 'react-navigation'

import style from '../layout/layout-style'
import { Header } from 'react-native-elements'
import Color from 'color'
import { barStyleDark, barStyleLight } from '../../common/styles/constant'
import type { StatusBarStyle } from '../../common/type-common'

export function getStatusBarStyle(backgroundColor: string): StatusBarStyle {
  if (Color(backgroundColor).isLight()) {
    return barStyleDark
  } else {
    return barStyleLight
  }
}

class CustomHeader extends PureComponent<CustomHeaderProps, void> {
  updateStatusBar() {
    if (this.props.isFocused) {
      const { backgroundColor } = this.props
      StatusBar.setBarStyle(getStatusBarStyle(this.props.backgroundColor), true)
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(this.props.backgroundColor)
      }
    }
  }

  componentDidMount() {
    this.updateStatusBar()
  }

  componentDidUpdate() {
    this.updateStatusBar()
  }

  render() {
    const {
      backgroundColor,
      children,
      centerComponent,
      outerContainerStyles,
      leftComponent,
      flatHeader,
      rightComponent,
      largeHeader,
      zeroBottomBorder,
      isFocused,
    } = this.props

    const ContainerStyles = StyleSheet.flatten([
      flatHeader ? style.zeroWidthBottomBorder : null,
    ])
    const borderStyles = StyleSheet.flatten([
      zeroBottomBorder ? style.zeroWidthBottomBorder : null,
    ])
    const barStyle = getStatusBarStyle(backgroundColor)
    const ToggleLargeHeader = largeHeader ? { top: 'always' } : { top: 'never' }

    const animated = true

    return (
      <SafeAreaView style={{ backgroundColor }} forceInset={ToggleLargeHeader}>
        <Header
          statusBarProps={
            isFocused ? { animated: true, barStyle, backgroundColor } : {}
          }
          backgroundColor={backgroundColor}
          outerContainerStyles={[
            outerContainerStyles,
            ContainerStyles,
            borderStyles,
          ]}
          centerComponent={centerComponent}
          leftComponent={leftComponent}
          rightComponent={rightComponent}
        >
          {children}
        </Header>
      </SafeAreaView>
    )
  }
}

export default withNavigationFocus(CustomHeader)
