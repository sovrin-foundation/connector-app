// @flow
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FCM, { FCMEvent } from 'react-native-fcm'
import {
  pushNotificationPermissionAction,
  updatePushToken,
  fetchAdditionalData,
} from './push-notification-store'
import PushNotificationNavigator from './push-notification-navigator'
import type { PushNotificationProps } from './type-push-notification'
import type { Store } from '../store/type-store'
import type { NotificationPayload } from '../common/type-common'

export class PushNotification extends PureComponent<
  PushNotificationProps,
  void
> {
  notificationListener = null
  initialNotificationListener = null
  refreshTokenListener = null

  componentDidMount() {
    // TODO: refactor to run this based off of actions so that we're not creating a new push notification token when user is trying to restore wallet
    // reset ios badge count to zero
    // iOS only and there's no way to set it in Android, yet.
    FCM.setBadgeNumber(0)
    FCM.removeAllDeliveredNotifications()

    this.notificationListener = FCM.on(FCMEvent.Notification, notification => {
      this.onPushNotificationReceived(notification)
    })

    this.initialNotificationListener = FCM.getInitialNotification().then(
      notification => {
        this.onPushNotificationReceived(notification)
      }
    )
  }

  onPushNotificationReceived(notificationPayload: ?NotificationPayload) {
    if (notificationPayload) {
      this.props.fetchAdditionalData(notificationPayload)
    }
  }

  saveDeviceToken(token: string) {
    if (token) {
      this.props.updatePushToken(token)
    }
  }

  listenForTokenUpdate() {
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      this.saveDeviceToken(token)
    })
  }

  componentDidUpdate(prevProps: PushNotificationProps) {
    if (
      this.props.isAllowed !== prevProps.isAllowed &&
      this.props.isAllowed === true
    ) {
      FCM.getFCMToken()
        .then(token => {
          this.saveDeviceToken(token)
          this.listenForTokenUpdate()
        })
        .catch(e => {
          console.log(e)
        })
    }
  }

  componentWillUnmount() {
    // stop listening for events
    this.notificationListener && this.notificationListener.remove()
    this.refreshTokenListener && this.refreshTokenListener.remove()
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

const mapStateToProps = (state: Store) => {
  return {
    isAllowed: state.pushNotification.isAllowed,
    pushToken: state.pushNotification.pushToken,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PushNotification)
