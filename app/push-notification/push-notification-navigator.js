// @flow
import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { PUSH_NOTIFICATION_TYPE } from '../services'
import {
  fetchAdditionalData,
  authenticationRequestReceived,
  claimOfferReceived,
  proofRequestReceived,
  pushNotificationReceived,
  addPendingRedirection,
} from '../store'
import {
  claimOfferRoute,
  invitationRoute,
  proofRequestRoute,
  qrCodeScannerTabRoute,
  homeTabRoute,
} from '../common'

import type {
  NotificationPayload,
  PushNotificationNavigatorProps,
  NextPropsPushNotificationNavigator,
} from './type-push-notification'

import type { NavigationParams } from '../common/type-common'

const blackListedRoute = {
  [invitationRoute]: invitationRoute,
  [qrCodeScannerTabRoute]: qrCodeScannerTabRoute,
}

export class PushNotificationNavigator extends PureComponent<
  void,
  PushNotificationNavigatorProps,
  void
> {
  componentWillReceiveProps(nextProps: PushNotificationNavigatorProps) {
    if (
      nextProps.pushNotification.notification &&
      nextProps.pushNotification.notification !==
        this.props.pushNotification.notification
    ) {
      const {
        type,
        additionalData,
        uid,
        senderLogoUrl,
        remotePairwiseDID,
      } = nextProps.pushNotification.notification

      if (type)
        if (!blackListedRoute[this.props.currentScreen])
          switch (type) {
            case PUSH_NOTIFICATION_TYPE.AUTH:
              // TODO:PS: handle auth request
              break

            case PUSH_NOTIFICATION_TYPE.CLAIM_OFFER:
              this.props.claimOfferReceived(additionalData, {
                uid,
                senderLogoUrl,
                remotePairwiseDID,
              })
              this.handleRedirection(claimOfferRoute, {
                uid,
              })
              break

            case PUSH_NOTIFICATION_TYPE.PROOF_REQUEST:
              this.props.proofRequestReceived(additionalData, {
                uid,
                senderLogoUrl,
                remotePairwiseDID,
              })
              this.handleRedirection(proofRequestRoute, {
                uid,
              })
              break
          }
    }
  }

  handleRedirection = (routeName: string, params: NavigationParams) => {
    if (this.props.isAppLocked)
      this.props.addPendingRedirection([
        { routeName: homeTabRoute },
        { routeName, params },
      ])
    else this.props.navigateToRoute(routeName, params)
  }

  render() {
    return null
  }
}

const mapStateToProps = ({ pushNotification, route, lock }) => ({
  pushNotification,
  currentScreen: route.currentScreen,
  isAppLocked: lock.isAppLocked,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchAdditionalData,
      authenticationRequestReceived,
      claimOfferReceived,
      proofRequestReceived,
      pushNotificationReceived,
      addPendingRedirection,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(
  PushNotificationNavigator
)
