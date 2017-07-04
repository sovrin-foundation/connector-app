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

  componentWillReceiveProps(nextProps) {
    // check if deepLink is changed, then that means we either got token
    // or we got error or nothing happend with deep link
    if (nextProps.deepLink.isLoading != this.props.deepLink.isLoading) {
      if (nextProps.deepLink.isLoading === false) {
        // loading deep link data is done
        if (nextProps.deepLink.token) {
          this.props.getInvitationDetailsRequest(
            nextProps.deepLink.token,
            this.props.config
          )
        } else {
          // we did not get any token and deepLink data loading is done
          SplashScreen.hide()
          this.props.navigation.navigate(homeRoute)
        }
      }
    }

    // check if invitation are the only props that are changed
    if (nextProps.invitation != this.props.invitation) {
      if (nextProps.invitation.error) {
        // if we got error, then also redirect user to home page
        SplashScreen.hide()
        this.props.navigation.navigate(homeRoute)
      }

      if (nextProps.invitation.data) {
        // if we got the data, then check for status of connection request
        if (nextProps.invitation.data.status) {
          SplashScreen.hide()
          if (nextProps.invitation.data.status === 'offer-sent') {
            this.props.navigation.navigate(invitationRoute)
          } else {
            this.props.navigation.navigate(homeRoute)
          }
        } else {
          SplashScreen.hide()
          this.props.navigation.navigate(homeRoute)
        }
      }
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  invitation: state.invitation,
  config: state.config,
  deepLink: state.deepLink,
})

const mapDispatchToProps = dispatch => ({
  getInvitationDetailsRequest: (token, config) =>
    dispatch(getInvitationDetailsRequest(token, config)),
})

export default (mapStateDispatchConnection = connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreenView))
