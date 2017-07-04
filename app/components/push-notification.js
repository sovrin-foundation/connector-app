import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import FCM, { FCMEvent } from 'react-native-fcm'
import { setItem } from '../services/secure-storage'
import { PUSH_COM_METHOD } from '../common/secure-storage-constants'
import UserEnroll from './user-enroll'
import {
  enroll,
  pushNotificationPermissionAction,
  pushNotificationReceived,
} from '../store'

export class PushNotification extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // push notification events
    FCM.requestPermissions() // for iOS
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

  onPushNotificationReceived(notification) {
    // todo: handling 'auth-req', will handle others later if any
    if (notification && notification.type === 'auth-req') {
      this.props.pushNotificationReceived(notification)
    }
  }

  saveDeviceToken(token) {
    if (token) {
      setItem(PUSH_COM_METHOD, token)
        .then(() => {
          this.props.pushNotificationPermissionAction(true)
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
    if (this.props.pushNotification.isAllowed) {
      return (
        <UserEnroll
          enrollAction={this.props.enroll}
          config={this.props.config}
        />
      )
    }

    return null
  }
}

const mapStateToProps = state => ({
  pushNotification: state.pushNotification,
  config: state.config,
})

const mapDispatchToProps = dispatch => ({
  enroll: (device, config) => dispatch(enroll(device, config)),
  pushNotificationPermissionAction: isAllowed =>
    dispatch(pushNotificationPermissionAction(isAllowed)),
  pushNotificationReceived: notification =>
    dispatch(pushNotificationReceived(notification)),
})

export default (mapsStateDispatch = connect(
  mapStateToProps,
  mapDispatchToProps
)(PushNotification))
