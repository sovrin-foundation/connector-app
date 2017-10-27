import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FCM, { FCMEvent } from 'react-native-fcm'
import {
  pushNotificationPermissionAction,
  pushNotificationReceived,
  updatePushToken,
  claimOfferReceived,
  fetchClaimOffer,
} from '../store'
import { PUSH_COM_METHOD, PUSH_NOTIFICATION_TYPE } from '../common'
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
    if (notification) {
      if (notification.type === PUSH_NOTIFICATION_TYPE.AUTH) {
        notification.remoteConnectionId = notification.remotePairwiseDID
      }

      if (notification.type === PUSH_NOTIFICATION_TYPE.CLAIM_OFFER) {
        let payload
        try {
          payload = JSON.parse(notification.data)
        } catch (e) {
          console.log('invalid claim offer payload', e)
        }
        this.props.claimOfferReceived(payload)
      }
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
      claimOfferReceived,
      fetchClaimOffer,
    },
    dispatch
  )

export default (mapsStateDispatch = connect(
  mapStateToProps,
  mapDispatchToProps
)(PushNotification))
