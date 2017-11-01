import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SplashScreen from 'react-native-splash-screen'
import {
  homeRoute,
  splashScreenRoute,
  expiredTokenRoute,
  lockSelectionRoute,
  lockEnterPinRoute,
  invitationRoute,
} from '../common/route-constants'
import {
  TOKEN_EXPIRED_CODE,
  PENDING_CONNECTION_REQUEST_CODE,
  PUSH_NOTIFICATION_SENT_CODE,
} from '../services/api'
import {
  authenticationRequestReceived,
  pushNotificationReceived,
  addPendingRedirection,
} from '../store'
import handlePushNotification from '../services/router'
import { getSmsPendingInvitation } from '../sms-pending-invitation/sms-pending-invitation-store'

class SplashScreenView extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.config.isHydrated !== this.props.config.isHydrated) {
      // hydrated is changed, and if it is changed to true,
      // that means this is the only time we would get inside this if condition
      if (nextProps.config.isHydrated) {
        SplashScreen.hide()
        // now we can safely check value of isAlreadyInstalled
        if (nextProps.lock.isLockEnabled === false) {
          // user is opening the app for first time after installing
          this.props.navigation.navigate(lockSelectionRoute)
        } else {
          // not the first time user is opening app
          this.props.navigation.navigate(lockEnterPinRoute)
        }
      }
    }

    // check if deepLink is changed, then that means we either got token
    // or we got error or nothing happened with deep link
    if (nextProps.deepLink.isLoading !== this.props.deepLink.isLoading) {
      if (nextProps.deepLink.isLoading === false) {
        // loading deep link data is done
        if (nextProps.deepLink.token) {
          this.props.getSmsPendingInvitation(nextProps.deepLink.token)
        } else {
          if (nextProps.lock.isAppLocked === false) {
            // we did not get any token and deepLink data loading is done
            SplashScreen.hide()
            this.props.navigation.navigate(homeRoute)
          } else {
            this.props.addPendingRedirection(homeRoute)
          }
        }
      }
    }

    // TODO:PS: Refactor this with custom navigator
    // Currently we have handPushNotification in all screen
    // We need to refactor this and move to single place
    // For that we need to create our own custom navigator
    if (
      nextProps.pushNotification.notification &&
      nextProps.pushNotification.notification !==
        this.props.pushNotification.notification
    ) {
      const { notification } = nextProps.pushNotification
      handlePushNotification(
        nextProps,
        notification,
        lockEnterPinRoute,
        nextProps.lock.isAppLocked,
        this.props.addPendingRedirection
      )
    }

    // check if authentication are the only props that are changed
    if (nextProps.authentication !== this.props.authentication) {
      if (nextProps.authentication.error) {
        SplashScreen.hide()

        if (
          nextProps.authentication.error.code &&
          nextProps.authentication.error.code === TOKEN_EXPIRED_CODE
        ) {
          if (nextProps.lock.isAppLocked === false) {
            this.props.navigation.navigate(expiredTokenRoute)
          } else {
            this.props.addPendingRedirection(expiredTokenRoute)
          }
        } else {
          if (nextProps.lock.isAppLocked === false) {
            // if we got error, then also redirect user to home page
            this.props.navigation.navigate(homeRoute)
          } else {
            this.props.addPendingRedirection(homeRoute)
          }
        }
      }

      if (nextProps.authentication.data) {
        // for authentication data
        // dont redirect manually let it resolve by default
        if (
          nextProps.authentication.data.statusCode &&
          nextProps.authentication.data.statusCode ===
            PUSH_NOTIFICATION_SENT_CODE
        ) {
          return
        }

        // todo: separate connection-request store from authentication store
        // handle redirection when coming from deep-link
        if (
          this.props.authentication.data &&
          nextProps.authentication.data.statusCode ===
            PENDING_CONNECTION_REQUEST_CODE &&
          this.props.authentication.data.statusCode ===
            nextProps.authentication.data.statusCode
        ) {
          return
        }
      }
    }

    if (nextProps.smsPendingInvitation !== this.props.smsPendingInvitation) {
      if (nextProps.smsPendingInvitation.error) {
        if (
          nextProps.smsPendingInvitation.error.code &&
          nextProps.smsPendingInvitation.error.code === TOKEN_EXPIRED_CODE
        ) {
          if (nextProps.lock.isAppLocked === false) {
            this.props.navigation.navigate(expiredTokenRoute)
          } else {
            this.props.addPendingRedirection(expiredTokenRoute)
          }
        } else {
          if (nextProps.lock.isAppLocked === false) {
            this.props.navigation.navigate(homeRoute)
          } else {
            this.props.addPendingRedirection(homeRoute)
          }
        }
      }

      // check if smsPendingInvitation payload are the only props that are changed
      if (
        nextProps.smsPendingInvitation.payload !==
        this.props.smsPendingInvitation.payload
      ) {
        const { senderDID } = nextProps.smsPendingInvitation.payload
        if (senderDID) {
          if (nextProps.lock.isAppLocked === false) {
            this.props.navigation.navigate(invitationRoute, { senderDID })
          } else {
            this.props.addPendingRedirection(invitationRoute, { senderDID })
          }
        } else {
          if (nextProps.lock.isAppLocked === false) {
            this.props.navigation.navigate(homeRoute)
          } else {
            this.props.addPendingRedirection(homeRoute)
          }
        }
      }
    }
  }

  componentDidMount() {
    // It might be the case the hydration finishes
    // even before component is mounted,
    // so we need to check for pin code here as well
    if (this.props.config.isHydrated) {
      SplashScreen.hide()
      // now we can safely check value of isAlreadyInstalled
      if (this.props.lock.isLockEnabled === false) {
        // user is opening the app for first time after installing
        this.props.navigation.navigate(lockSelectionRoute)
      } else {
        // not the first time user is opening app
        this.props.navigation.navigate(lockEnterPinRoute)
      }
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = ({
  authentication,
  config,
  deepLink,
  pushNotification,
  route,
  lock,
  smsPendingInvitation,
}) => ({
  authentication,
  config,
  deepLink,
  pushNotification,
  route,
  lock,
  smsPendingInvitation,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSmsPendingInvitation,
      authenticationRequestReceived,
      pushNotificationReceived,
      addPendingRedirection,
    },
    dispatch
  )

export default (mapStateDispatchConnection = connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreenView))
