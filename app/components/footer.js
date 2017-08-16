import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Tabs from './tabs'

class Footer extends PureComponent {
  _onClick = route => {
    this.props.navigation.navigate(route)
  }

  render() {
    return (
      <Tabs type={this.props.route.currentScreen} onTabClick={this._onClick} />
    )
  }
}

const mapStateToProps = state => ({
  route: state.route,
})

export default connect(mapStateToProps)(Footer)
