import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FCM, { FCMEvent } from 'react-native-fcm'
import {
  pushNotificationPermissionAction,
  updatePushToken,
  fetchAdditionalData,
} from '../store'
import { PUSH_COM_METHOD } from '../common'
import { setItem } from '../services/secure-storage'
import PushNotificationNavigator from './push-notification-navigator'

export class PushNotification extends PureComponent {
  componentDidMount() {
    // reset ios badge count to zero
    // iOS only and there's no way to set it in Android, yet.
    FCM.setBadgeNumber(0)
    FCM.removeAllDeliveredNotifications()
    FCM.getFCMToken().then(token => {
      this.saveDeviceToken(token)
    })

    this.notificationListener = FCM.on(FCMEvent.Notification, notification => {
      this.onPushNotificationReceived(notification)
    })

    this.initialNotificationListener = FCM.getInitialNotification().then(
      notification => {
        this.onPushNotificationReceived(notification)
      }
    )

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      this.saveDeviceToken(token)
    })
  }

  onPushNotificationReceived(notificationPayload) {
    if (notificationPayload) {
      this.props.fetchAdditionalData(notificationPayload)
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
    return (
      <PushNotificationNavigator navigateToRoute={this.props.navigateToRoute} />
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      pushNotificationPermissionAction,
      updatePushToken,
      fetchAdditionalData,
    },
    dispatch
  )

export default (mapsStateDispatch = connect(null, mapDispatchToProps)(
  PushNotification
))
