// @flow
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import firebase from 'react-native-firebase'
import type { Notification, NotificationOpen } from 'react-native-firebase'
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
  notificationDisplayedListener = null
  onNotificationOpenedListener = null

  // Because the type returned from Notification for data is: { [string]: string }, we're parsing it in order to have proper type checks
  notificationParser(notification: Notification) {
    const {
      data: { forDID, uid, type, remotePairwiseDID, senderLogoUrl },
    } = notification

    return {
      forDID,
      uid,
      type,
      remotePairwiseDID,
      senderLogoUrl,
    }
  }

  componentDidMount = async () => {
    // TODO: refactor to run this based off of actions so that we're not creating a new push notification token when user is trying to restore wallet

    // Sets the current badge number on the app icon to zero.
    // iOS only for now.
    firebase.notifications().setBadge(0)
    // Removes all delivered notifications.
    firebase.notifications().removeAllDeliveredNotifications()

    // When a notification is displayed, the listener is invoked with the notification.
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        this.onPushNotificationReceived(this.notificationParser(notification))
      })

    // When a notification is received, but not displayed, the listener is invoked with the notification.
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        this.onPushNotificationReceived(this.notificationParser(notification))
      })

    // When a notification is opened, the listener is invoked with the notification and the action that was invoked when it was clicked on.
    this.onNotificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification
        this.onPushNotificationReceived(this.notificationParser(notification))
      })

    try {
      // Due to the delay in the React Native bridge, the onNotification listeners will not be available at startup, so this method can be used to check to see if the application was opened by a notification.
      const notificationOpen: NotificationOpen = await firebase
        .notifications()
        .getInitialNotification()

      // App was opened by a notification
      if (notificationOpen) {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification
        this.onPushNotificationReceived(this.notificationParser(notification))
      }
    } catch (e) {
      // TODO: handle error better
      console.log(e)
    }
  }

  listenForTokenUpdate() {
    this.refreshTokenListener = firebase.messaging().onTokenRefresh(token => {
      this.saveDeviceToken(token)
    })
  }

  onPushNotificationReceived(notificationPayload: NotificationPayload) {
    if (notificationPayload) {
      this.props.fetchAdditionalData(notificationPayload)
    }
  }

  saveDeviceToken(token: string) {
    if (token) {
      this.props.updatePushToken(token)
    }
  }

  getToken() {
    firebase
      .messaging()
      .getToken()
      .then(token => {
        if (token) {
          // user has a device token
          this.saveDeviceToken(token)
          this.listenForTokenUpdate()
        } else {
          // user doesn't have a device token
        }
      })
  }

  componentDidUpdate(prevProps: PushNotificationProps) {
    if (
      this.props.isAllowed !== prevProps.isAllowed &&
      this.props.isAllowed === true
    ) {
      this.getToken()
    }
  }
  componentWillUnmount() {
    // stop listening for events
    this.notificationListener && this.notificationListener.remove()
    this.refreshTokenListener && this.refreshTokenListener.remove()
    this.notificationDisplayedListener &&
      this.notificationDisplayedListener.remove()
    this.onNotificationOpenedListener &&
      this.onNotificationOpenedListener.remove()
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
