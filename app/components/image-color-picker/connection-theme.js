// @flow
import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import empty from '../../common/empty'
import type { ConnectionThemeProps } from './type-color-picker'
import { getConnectionTheme } from '../../store/store-selector'

export class ConnectionTheme extends Component<ConnectionThemeProps, void> {
  render() {
    const {
      logoUrl,
      secondary,
      connectionTheme,
      children,
      style,
      disabled = false,
    } = this.props
    let styles = style || empty

    let themeType = secondary
      ? connectionTheme.secondary
      : connectionTheme.primary

    if (disabled) {
      const colorsWithoutOpacity = themeType.split(',', 3)
      // change opacity to 0.4 if child is disabled
      // do not remove `)` from end of 0.4, that's how we generate
      // rgba(hex, hex, hex, opacity) this is last parenthesis
      colorsWithoutOpacity.push('0.4)')
      themeType = colorsWithoutOpacity.join(',')
    }

    let childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {
        customColor: {
          backgroundColor: themeType,
        },
      })
    )

    if (styles && styles != empty)
      styles = [styles, { backgroundColor: themeType }]

    return <View style={styles}>{childrenWithProps}</View>
  }
}

const mapStateToProps = (store, { logoUrl }) => ({
  connectionTheme: getConnectionTheme(store, logoUrl),
})

export default connect(mapStateToProps, null)(ConnectionTheme)
