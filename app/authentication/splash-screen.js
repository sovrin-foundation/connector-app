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
  lockEnterFingerprintRoute,
  invitationRoute,
} from '../common/route-constants'
import {
  TOKEN_EXPIRED_CODE,
  PENDING_CONNECTION_REQUEST_CODE,
} from '../api/api-constants'
import { addPendingRedirection } from '../store'
import { getSmsPendingInvitation } from '../sms-pending-invitation/sms-pending-invitation-store'
import { loadHistory } from '../connection-history/connection-history-store'

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
          if (nextProps.lock.isTouchIdEnabled) {
            this.props.navigation.navigate(lockEnterFingerprintRoute)
          } else {
            this.props.navigation.navigate(lockEnterPinRoute)
          }
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
            this.props.addPendingRedirection([{ routeName: homeRoute }])
          }
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
            this.props.addPendingRedirection([{ routeName: expiredTokenRoute }])
          }
        } else {
          if (nextProps.lock.isAppLocked === false) {
            this.props.navigation.navigate(homeRoute)
          } else {
            this.props.addPendingRedirection([{ routeName: homeRoute }])
          }
        }
      }

      // check if smsPendingInvitation payload are the only props that are changed
      if (
        nextProps.smsPendingInvitation.payload !==
        this.props.smsPendingInvitation.payload
      ) {
        const senderDID =
          nextProps.smsPendingInvitation.payload.senderDetail.DID
        if (senderDID) {
          if (nextProps.lock.isAppLocked === false) {
            this.props.navigation.navigate(invitationRoute, { senderDID })
          } else {
            this.props.addPendingRedirection([
              {
                routeName: invitationRoute,
                params: { senderDID },
              },
            ])
          }
        } else {
          if (nextProps.lock.isAppLocked === false) {
            this.props.navigation.navigate(homeRoute)
          } else {
            this.props.addPendingRedirection([{ routeName: homeRoute }])
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
        if (this.props.lock.isTouchIdEnabled) {
          this.props.navigation.navigate(lockEnterFingerprintRoute)
        } else {
          this.props.navigation.navigate(lockEnterPinRoute)
        }
      }
    }

    // load connection history
    this.props.loadHistory()
  }

  render() {
    return null
  }
}

const mapStateToProps = ({ config, deepLink, lock, smsPendingInvitation }) => ({
  config,
  deepLink,
  lock,
  smsPendingInvitation,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSmsPendingInvitation,
      addPendingRedirection,
      loadHistory,
    },
    dispatch
  )

export default (mapStateDispatchConnection = connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreenView))
