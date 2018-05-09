// @flow
import React from 'react'
import { View } from 'react-native'

class MockView extends React.Component<any, void> {
  render() {
    return <View>{this.props.children}</View>
  }
}

export default MockView
