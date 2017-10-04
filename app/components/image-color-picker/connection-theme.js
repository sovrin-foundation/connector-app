// @flow
import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import empty from '../../common/empty'
import type { ConnectionThemeProps } from './type-color-picker'

export class ConnectionTheme extends Component<
  void,
  ConnectionThemeProps,
  any
> {
  render() {
    const { shade, activeConnectionColor, children, style } = this.props

    const styles = style || empty
    const colorShade = shade || '1.0'
    const connectionThemeColor =
      Object.values(activeConnectionColor).join(',') + ',' + colorShade

    let childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {
        customColor: {
          backgroundColor: `rgba(${connectionThemeColor})`,
        },
      })
    )

    return (
      <View
        style={[styles, { backgroundColor: `rgba(${connectionThemeColor})` }]}
      >
        {childrenWithProps}
      </View>
    )
  }
}

const mapStateToProps = ({ connections }) => ({
  activeConnectionColor: connections.activeConnectionColor,
})

export default connect(mapStateToProps, null)(ConnectionTheme)
