// @flow
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
  waitForInvitationRoute,
} from '../common/route-constants'
import {
  TOKEN_EXPIRED_CODE,
  PENDING_CONNECTION_REQUEST_CODE,
} from '../api/api-constants'
import { addPendingRedirection } from '../store'
import {
  getSmsPendingInvitation,
  safeToDownloadSmsInvitation,
} from '../sms-pending-invitation/sms-pending-invitation-store'
import { loadHistory } from '../connection-history/connection-history-store'
import type { SplashScreenProps } from './type-splash-screen'
import type { Store } from '../store/type-store'
import { SMSPendingInvitationStatus } from '../sms-pending-invitation/type-sms-pending-invitation'
import { deepLinkProcessed } from '../deep-link/deep-link-store'
import { DEEP_LINK_STATUS } from '../deep-link/type-deep-link'

export class SplashScreenView extends PureComponent<SplashScreenProps, void> {
  componentWillReceiveProps(nextProps: SplashScreenProps) {
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

          // if we are redirecting user to either of authentication screen
          // we are sure that now user can't change the environment
          // so we need to raise an action for safe to download invitation
          // from environment information available after app is hydrated
          this.props.safeToDownloadSmsInvitation()
        }
      }
    }

    // check if deepLink is changed, then that means we either got token
    // or we got error or nothing happened with deep link
    const nextDeepLinkTokens = nextProps.deepLink.tokens
    if (
      nextProps.deepLink.isLoading !== this.props.deepLink.isLoading &&
      nextProps.deepLink.isLoading === false &&
      Object.keys(nextDeepLinkTokens).length === 0
    ) {
      if (nextProps.lock.isAppLocked === false) {
        // we did not get any token and deepLink data loading is done
        SplashScreen.hide()
        this.props.navigation.navigate(homeRoute)
      } else {
        this.props.addPendingRedirection([{ routeName: homeRoute }])
      }
    }

    if (
      nextProps.deepLink.isLoading === false &&
      Object.keys(nextDeepLinkTokens).length >
        Object.keys(this.props.deepLink.tokens).length &&
      Object.keys(nextDeepLinkTokens).length !== 0
    ) {
      Object.keys(nextDeepLinkTokens).map(
        smsToken =>
          nextDeepLinkTokens[smsToken].status !== DEEP_LINK_STATUS.PROCESSED &&
          nextProps.getSmsPendingInvitation(smsToken)
      )
      if (nextProps.lock.isAppLocked === false) {
        this.props.navigation.navigate(waitForInvitationRoute)
      }
    }

    if (
      JSON.stringify(nextProps.smsPendingInvitation) !==
      JSON.stringify(this.props.smsPendingInvitation)
    ) {
      const smsPendingInvitationTokens = Object.keys(
        nextProps.smsPendingInvitation
      )
      const smsPendingInvitations = smsPendingInvitationTokens.map(
        invitationToken => {
          return {
            ...nextProps.smsPendingInvitation[invitationToken],
            invitationToken,
          }
        }
      )
      const unHandledSmsPendingInvitations = smsPendingInvitations.filter(
        ({ invitationToken }) =>
          invitationToken &&
          nextProps.deepLink.tokens[invitationToken].status !==
            DEEP_LINK_STATUS.PROCESSED
      )
      const isAnyOneOfSmsPendingInvitationHasError = unHandledSmsPendingInvitations.some(
        ({ error }) => error
      )
      const isAnyOneOfSmsPendingInvitationWasExpired = unHandledSmsPendingInvitations.some(
        ({ error }) => error && error.code && error.code === TOKEN_EXPIRED_CODE
      )
      const unseenSmsPendingInvitations = unHandledSmsPendingInvitations
        .filter(
          ({ payload, status }) =>
            payload &&
            payload.senderDetail.DID &&
            status === SMSPendingInvitationStatus.RECEIVED
        )
        .map(({ payload, invitationToken }) => ({
          payload,
          invitationToken,
        }))
      if (isAnyOneOfSmsPendingInvitationWasExpired) {
        if (nextProps.lock.isAppLocked === false) {
          this.props.navigation.navigate(expiredTokenRoute)
        } else {
          this.props.addPendingRedirection([{ routeName: expiredTokenRoute }])
        }
      } else if (isAnyOneOfSmsPendingInvitationHasError) {
        if (nextProps.lock.isAppLocked === false) {
          this.props.navigation.navigate(homeRoute)
        } else {
          this.props.addPendingRedirection([{ routeName: homeRoute }])
        }
      }

      // check if smsPendingInvitation payload are the only props that are changed

      const pendingReditectionList = unseenSmsPendingInvitations.map(
        ({ payload, invitationToken }) => {
          if (payload) {
            const senderDID = payload.senderDetail.DID
            nextProps.deepLinkProcessed(invitationToken)
            return {
              routeName: invitationRoute,
              params: { senderDID, token: invitationToken },
            }
          }
        }
      )
      pendingReditectionList.length !== 0 &&
        nextProps.addPendingRedirection(pendingReditectionList)
      // all error token links should be processed processed
      unHandledSmsPendingInvitations.map(({ error, invitationToken }) => {
        error ? nextProps.deepLinkProcessed(invitationToken) : null
      })
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

        // if we are redirecting user to either of authentication screen
        // we are sure that now user can't change the environment
        // so we need to raise an action for safe to download invitation
        // from environment information available after app is hydrated
        this.props.safeToDownloadSmsInvitation()
      }
    }

    // load connection history
    this.props.loadHistory()
  }

  render() {
    return null
  }
}

const mapStateToProps = ({
  config,
  deepLink,
  lock,
  smsPendingInvitation,
}: Store) => ({
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
      safeToDownloadSmsInvitation,
      deepLinkProcessed,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreenView)
