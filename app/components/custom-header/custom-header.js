// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, StatusBar } from 'react-native'
import type { CustomHeaderProps } from './type-custom-header'
import { SafeAreaView } from 'react-navigation'
import { withNavigationFocus } from 'react-navigation'

import style from '../layout/layout-style'
import { Header } from 'react-native-elements'
import Color from 'color'

class CustomHeader extends PureComponent<CustomHeaderProps, void> {
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
    } = this.props

    const ContainerStyles = StyleSheet.flatten([
      flatHeader ? style.zeroWidthBottomBorder : null,
    ])
    let barStyle
    if (Color(backgroundColor).isLight) {
      barStyle = 'dark-content'
    } else {
      barStyle = 'light-content'
    }

    const ToggleLargeHeader = largeHeader ? { top: 'always' } : { top: 'never' }

    const animated = true

    return (
      <SafeAreaView style={{ backgroundColor }} forceInset={ToggleLargeHeader}>
        {this.props.isFocused ? (
          <StatusBar
            backgroundColor={backgroundColor}
            barStyle={barStyle}
            animated={true}
          />
        ) : null}
        <Header
          backgroundColor={backgroundColor}
          outerContainerStyles={[outerContainerStyles, ContainerStyles]}
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
