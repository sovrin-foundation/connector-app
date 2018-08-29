// @flow
import React, { PureComponent } from 'react'
import { Platform } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import type {
  PushNotificationNavigatorProps,
  NextPropsPushNotificationNavigator,
  ClaimOfferPushPayload,
  AdditionalDataPayload,
  ClaimPushPayload,
} from './type-push-notification'
import {
  updatePayloadToRelevantStoreAndRedirect,
  clearNavigateToRoutePN,
} from './push-notification-store'
import type {
  NavigationParams,
  NotificationPayload,
} from '../common/type-common'
import type { Claim } from '../claim/type-claim'
import type {
  ProofRequestPushPayload,
  AdditionalProofDataPayload,
} from '../proof-request/type-proof-request'

export class PushNotificationNavigator extends PureComponent<
  PushNotificationNavigatorProps,
  void
> {
  componentWillReceiveProps(nextProps: PushNotificationNavigatorProps) {
    if (
      nextProps.pushNotification.notification &&
      nextProps.pushNotification.notification !==
        this.props.pushNotification.notification
    ) {
      this.props.updatePayloadToRelevantStoreAndRedirect(
        nextProps.pushNotification.notification
      )
    }
    if (
      nextProps.pushNotification.navigateRoute &&
      nextProps.pushNotification.navigateRoute !==
        this.props.pushNotification.navigateRoute
    ) {
      const { routeName, params } = nextProps.pushNotification.navigateRoute
      this.props.clearNavigateToRoutePN()
      this.props.navigateToRoute(routeName, params)
    }
  }

  render() {
    return null
  }
}

const mapStateToProps = ({ pushNotification, route, lock }) => ({
  pushNotification,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updatePayloadToRelevantStoreAndRedirect,
      clearNavigateToRoutePN,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(
  PushNotificationNavigator
)
