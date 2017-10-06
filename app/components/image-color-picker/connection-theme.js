// @flow
import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import empty from '../../common/empty'
import type { ConnectionThemeProps } from './type-color-picker'
import { getConnectionTheme } from '../../store/store-selector'

export class ConnectionTheme extends Component<
  void,
  ConnectionThemeProps,
  any
> {
  render() {
    const { logoUrl, secondary, connectionTheme, children, style } = this.props
    let styles = style || empty

    const themeType = secondary
      ? connectionTheme.secondary
      : connectionTheme.primary

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
