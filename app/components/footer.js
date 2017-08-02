import React, { PureComponent } from 'react'
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native'
import { connect } from 'react-redux'

import { settingsRoute, homeRoute } from '../common/route-constants'
import Tabs from './tabs'

class Footer extends PureComponent {
  constructor(props) {
    super(props)
  }
  _onClick = route => {
    this.props.navigation.navigate(route)
  }

  render() {
    if (this.props.route.currentScreen == settingsRoute) {
      return <Tabs type={settingsRoute} rightIconClick={this._onClick} />
    } else {
      return <Tabs type={homeRoute} leftIconClick={this._onClick} />
    }
  }
}

const mapStateToProps = state => ({
  route: state.route,
})

export default connect(mapStateToProps)(Footer)
