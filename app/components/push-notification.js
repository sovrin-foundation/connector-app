import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FCM, { FCMEvent } from 'react-native-fcm'
import {
  pushNotificationPermissionAction,
  pushNotificationReceived,
  updatePushToken,
} from '../store'
import { PUSH_COM_METHOD } from '../common'
import { setItem } from '../services'

export class PushNotification extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    // reset ios badge count to zero
    // iOS only and there's no way to set it in Android, yet.
    FCM.setBadgeNumber(0)
    if (nextProps.deepLink.isLoading !== this.props.deepLink.isLoading) {
      if (nextProps.deepLink.isLoading === false) {
        FCM.removeAllDeliveredNotifications()
        FCM.getFCMToken().then(token => {
          this.saveDeviceToken(token)
        })

        this.notificationListener = FCM.on(
          FCMEvent.Notification,
          notification => {
            this.onPushNotificationReceived(notification)
          }
        )

        this.initialNotificationListener = FCM.getInitialNotification().then(
          notification => {
            this.onPushNotificationReceived(notification)
          }
        )

        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
          this.saveDeviceToken(token)
        })
      }
    }
  }

  onPushNotificationReceived(notification) {
    // handling 'auth-req', will handle others later if any
    if (notification && notification.type === 'auth-req') {
      notification.remoteConnectionId = notification.remotePairwiseDID
      this.props.pushNotificationReceived(notification)
    }
  }

  saveDeviceToken(token) {
    if (token) {
      setItem(PUSH_COM_METHOD, token)
        .then(() => {
          this.props.pushNotificationPermissionAction(true)
          this.props.updatePushToken(token)
        })
        .catch(function(error) {
          console.log('LOG: error saveDeviceToken setItem, ', error)
        })
    }
  }

  componentWillUnmount() {
    // stop listening for events
    this.notificationListener.remove()
    this.initialNotificationListener.remove()
    this.refreshTokenListener.remove()
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  pushNotification: state.pushNotification,
  config: state.config,
  deepLink: state.deepLink,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushNotificationPermissionAction,
      pushNotificationReceived,
      updatePushToken,
    },
    dispatch
  )

export default (mapsStateDispatch = connect(
  mapStateToProps,
  mapDispatchToProps
)(PushNotification))
