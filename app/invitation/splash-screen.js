import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { invitation } from '../store'
import SplashScreen from 'react-native-splash-screen'
import { invitationRoute, homeRoute } from '../common/route-constants'
import { getInvitationDetailsRequest } from './invitation-store'
import { NavigationActions } from 'react-navigation'

class SplashScreenView extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.getInvitationDetailsRequest('7SyQz6Lp4KknxH9QvJcbEF')
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.invitation.data && nextProps.invitation.data.status) {
      SplashScreen.hide()
      if (nextProps.invitation.data.status === 'offer-sent') {
        this.props.navigation.navigate(invitationRoute)
      } else {
        this.props.navigation.navigate(homeRoute)
      }
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  invitation: state.invitation,
})

const mapDispatchToProps = dispatch => ({
  getInvitationDetailsRequest: () => dispatch(getInvitationDetailsRequest()),
})

export default (mapStateDispatchConnection = connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreenView))
