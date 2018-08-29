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
  eulaRoute,
  restoreRoute,
} from '../common/route-constants'
import {
  TOKEN_EXPIRED_CODE,
  PENDING_CONNECTION_REQUEST_CODE,
} from '../api/api-constants'
import { addPendingRedirection } from '../lock/lock-store'
import {
  getSmsPendingInvitation,
  safeToDownloadSmsInvitation,
} from '../sms-pending-invitation/sms-pending-invitation-store'
import type { SplashScreenProps } from './type-splash-screen'
import type { Store } from '../store/type-store'
import { SMSPendingInvitationStatus } from '../sms-pending-invitation/type-sms-pending-invitation'
import type { SMSPendingInvitations } from '../sms-pending-invitation/type-sms-pending-invitation'
import { deepLinkProcessed } from '../deep-link/deep-link-store'
import { DEEP_LINK_STATUS } from '../deep-link/type-deep-link'

const isReceived = ({ payload, status }) =>
  payload &&
  payload.senderDetail.DID &&
  status === SMSPendingInvitationStatus.RECEIVED

export class SplashScreenView extends PureComponent<SplashScreenProps, void> {
  ifDeepLinkFoundGoToWaitForInvitationScreenNFetchInvitation = (
    prevProps: SplashScreenProps
  ) => {
    const nextDeepLinkTokens = this.props.deepLink.tokens
    if (
      this.props.deepLink.isLoading === false &&
      Object.keys(nextDeepLinkTokens).length >
        Object.keys(prevProps.deepLink.tokens).length
    ) {
      Object.keys(nextDeepLinkTokens).map(
        smsToken =>
          nextDeepLinkTokens[smsToken].status !== DEEP_LINK_STATUS.PROCESSED &&
          this.props.getSmsPendingInvitation(smsToken)
      )
      if (this.props.lock.isAppLocked === false) {
        this.props.navigation.navigate(waitForInvitationRoute)
      }
    }
  }

  getUnHandledSmsPendingInvitations = () => {
    const smsPendingInvitations = Object.keys(
      this.props.smsPendingInvitation
    ).map(invitationToken => {
      return {
        ...this.props.smsPendingInvitation[invitationToken],
        invitationToken,
      }
    })
    const unHandledSmsPendingInvitations: SMSPendingInvitations = smsPendingInvitations.filter(
      ({ invitationToken }) =>
        invitationToken &&
        this.props.deepLink.tokens[invitationToken].status !==
          DEEP_LINK_STATUS.PROCESSED
    )
    return unHandledSmsPendingInvitations
  }

  handleExpiredTokens = (
    unHandledSmsPendingInvitations: SMSPendingInvitations
  ) => {
    const isAnyOneOfSmsPendingInvitationHasError: boolean = unHandledSmsPendingInvitations.some(
      ({ error }) => error
    )
    const isAnyOneOfSmsPendingInvitationWasExpired: boolean = unHandledSmsPendingInvitations.some(
      ({ error }) => error && error.code && error.code === TOKEN_EXPIRED_CODE
    )
    if (isAnyOneOfSmsPendingInvitationWasExpired) {
      // TODO: This conditions pops up too many times, we should create a common function for this.
      // TODO: It should be something like this this.redirect(nextProps.lock, routeName)
      if (this.props.lock.isAppLocked === false) {
        this.props.navigation.navigate(expiredTokenRoute)
      } else {
        this.props.addPendingRedirection([{ routeName: expiredTokenRoute }])
      }
    } else if (isAnyOneOfSmsPendingInvitationHasError) {
      // * This condition is needed to avoid un wanted redirection to home screen if unHandledSmsPendingInvitations are empty
      // * or if we are in middle of other invitation fetching process
      if (this.props.lock.isAppLocked === false) {
        this.props.navigation.navigate(homeRoute)
      } else {
        this.props.addPendingRedirection([{ routeName: homeRoute }])
      }
    }
    unHandledSmsPendingInvitations.map(({ error, invitationToken }) => {
      error ? this.props.deepLinkProcessed(invitationToken) : null
    })
  }

  handleSmsPendingInvitations = (prevProps: SplashScreenProps) => {
    const nextDeepLinkTokens = this.props.deepLink.tokens
    if (
      JSON.stringify(prevProps.smsPendingInvitation) !==
      JSON.stringify(this.props.smsPendingInvitation)
    ) {
      const unHandledSmsPendingInvitations = this.getUnHandledSmsPendingInvitations()
      this.handleExpiredTokens(unHandledSmsPendingInvitations)
      const unseenSmsPendingInvitations = unHandledSmsPendingInvitations.filter(
        isReceived
      )

      const pendingRedirectionList = unseenSmsPendingInvitations.map(
        ({ payload, invitationToken }) => {
          if (payload) {
            const senderDID = payload.senderDetail.DID
            this.props.deepLinkProcessed(invitationToken)
            if (this.props.lock.isAppLocked === false) {
              this.props.navigation.navigate(invitationRoute, {
                senderDID,
                token: invitationToken,
              })
            }
            return {
              routeName: invitationRoute,
              params: { senderDID, token: invitationToken },
            }
          }
        }
      )

      pendingRedirectionList.length !== 0 &&
        this.props.lock.isAppLocked === true &&
        this.props.addPendingRedirection(pendingRedirectionList)

      // * all error token links should be processed
    }
  }

  componentDidUpdate(prevProps: SplashScreenProps) {
    if (this.props.isInitialized !== prevProps.isInitialized) {
      // hydrated is changed, and if it is changed to true,
      // that means this is the only time we would get inside this if condition
      if (this.props.isInitialized) {
        SplashScreen.hide()
        // now we can safely check value of isAlreadyInstalled
        if (
          !this.props.lock.isLockEnabled ||
          this.props.lock.isLockEnabled === 'false'
        ) {
          // user is opening the app for first time after installing
          if (!this.props.eula.isEulaAccept) {
            this.props.navigation.navigate(eulaRoute)
          } else {
            this.props.navigation.navigate(restoreRoute)
          }
        } else {
          // not the first time user is opening app
          if (this.props.lock.isTouchIdEnabled) {
            this.props.navigation.navigate(lockEnterFingerprintRoute)
          } else {
            this.props.navigation.navigate(lockEnterPinRoute)
          }
        }
      }
    }

    // check if deepLink is changed, then that means we either got token
    // or we got error or nothing happened with deep link
    const nextDeepLinkTokens = this.props.deepLink.tokens
    if (
      prevProps.deepLink.isLoading !== this.props.deepLink.isLoading &&
      this.props.deepLink.isLoading === false &&
      Object.keys(nextDeepLinkTokens).length === 0
    ) {
      if (this.props.lock.isAppLocked === false) {
        // we did not get any token and deepLink data loading is done
        SplashScreen.hide()
        this.props.navigation.navigate(homeRoute)
      } else {
        this.props.addPendingRedirection([{ routeName: homeRoute }])
      }
    }

    this.ifDeepLinkFoundGoToWaitForInvitationScreenNFetchInvitation(prevProps)
    this.handleSmsPendingInvitations(prevProps)
  }

  componentDidMount() {
    // It might be the case the hydration finishes
    // even before component is mounted,
    // so we need to check for pin code here as well

    if (this.props.isInitialized) {
      SplashScreen.hide()
      // now we can safely check value of isAlreadyInstalled
      if (this.props.lock.isLockEnabled === 'false') {
        // user is opening the app for first time after installing
        if (!this.props.eula.isEulaAccept) {
          this.props.navigation.navigate(eulaRoute)
        } else {
          this.props.navigation.navigate(restoreRoute)
        }
      } else {
        // not the first time user is opening app
        if (this.props.lock.isTouchIdEnabled) {
          this.props.navigation.navigate(lockEnterFingerprintRoute)
        } else {
          this.props.navigation.navigate(lockEnterPinRoute)
        }
      }
    }
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
  eula,
}: Store) => ({
  isInitialized: config.isInitialized,
  // DeepLink should be it's own component that will handle only deep link logic
  // in that way, we will be able to restrict re-render and re-run of code
  deepLink,
  // only need 3 props
  lock,
  smsPendingInvitation,
  // only need isEulaAccept
  eula,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSmsPendingInvitation,
      addPendingRedirection,
      safeToDownloadSmsInvitation,
      deepLinkProcessed,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreenView)
