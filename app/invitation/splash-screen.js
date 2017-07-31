import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SplashScreen from 'react-native-splash-screen'
import {
  invitationRoute,
  homeRoute,
  splashScreenRoute,
  expiredTokenRoute,
} from '../common/route-constants'
import {
  TOKEN_EXPIRED_CODE,
  PENDING_CONNECTION_REQUEST_CODE,
  PUSH_NOTIFICATION_SENT_CODE,
} from '../common/api-constants'
import {
  getInvitationDetailsRequest,
  authenticationRequestReceived,
  pushNotificationReceived,
} from '../store'
import { handlePushNotification } from '../services'

class SplashScreenView extends PureComponent {
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
        //TODO: pass nextProps in place of this.props
        handlePushNotification(this.props, notification, splashScreenRoute)
      } else {
        return
      }
    }

    // check if invitation are the only props that are changed
    if (nextProps.invitation != this.props.invitation) {
      if (nextProps.invitation.error) {
        SplashScreen.hide()

        if (
          nextProps.invitation.error.statusCode &&
          nextProps.invitation.error.statusCode === TOKEN_EXPIRED_CODE
        ) {
          this.props.navigation.navigate(expiredTokenRoute)
        } else {
          // if we got error, then also redirect user to home page
          this.props.navigation.navigate(homeRoute)
        }
      }

      if (nextProps.invitation.data) {
        // for invitation data
        // dont redirect manually let it resolve by default
        if (
          nextProps.invitation.data.statusCode &&
          nextProps.invitation.data.statusCode === PUSH_NOTIFICATION_SENT_CODE
        ) {
          return
        }

        // todo: separate connection-request store from invitation store
        // handle redirection when coming from deep-link
        // TODO: move offer-sent to a constant
        if (
          this.props.invitation.data &&
          nextProps.invitation.data.statusCode ===
            PENDING_CONNECTION_REQUEST_CODE &&
          this.props.invitation.data.statusCode ===
            nextProps.invitation.data.statusCode
        ) {
          return
        }

        // if we got the data, then check for status of connection request
        if (nextProps.invitation.data.statusCode) {
          SplashScreen.hide()
          if (
            nextProps.invitation.data.statusCode ===
            PENDING_CONNECTION_REQUEST_CODE
          ) {
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
