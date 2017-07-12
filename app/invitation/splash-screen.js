import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SplashScreen from 'react-native-splash-screen'
import {
  invitationRoute,
  homeRoute,
  splashScreenRoute,
} from '../common/route-constants'
import {
  getInvitationDetailsRequest,
  authenticationRequestReceived,
  pushNotificationReceived,
} from '../store'
import { handlePushNotification } from '../services'

class SplashScreenView extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    // check if deepLink is changed, then that means we either got token
    // or we got error or nothing happened with deep link
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

    if (
      nextProps.pushNotification.notification !=
      this.props.pushNotification.notification
    ) {
      const { notification } = nextProps.pushNotification
      if (notification && notification.type === 'auth-req') {
        handlePushNotification(this.props, splashScreenRoute)
      } else {
        return
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
        // for invitation data
        // dont redirect manually let it resolve by default
        if (
          nextProps.invitation.data.status &&
          nextProps.invitation.data.status === 'push-notification-sent'
        ) {
          return
        }

        // todo: separate connection-request store from invitation store
        // handle redirection when coming from deep-link
        if (
          this.props.invitation.data &&
          nextProps.invitation.data.status === 'offer-sent' &&
          this.props.invitation.data.status === nextProps.invitation.data.status
        ) {
          return
        }

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

const mapStateToProps = ({
  invitation,
  config,
  deepLink,
  pushNotification,
  route,
}) => ({
  invitation,
  config,
  deepLink,
  pushNotification,
  route,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getInvitationDetailsRequest,
      authenticationRequestReceived,
      pushNotificationReceived,
    },
    dispatch
  )

export default (mapStateDispatchConnection = connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreenView))
