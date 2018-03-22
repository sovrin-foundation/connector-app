// @flow
import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { MESSAGE_TYPE } from '../api/api-constants'
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
import { claimReceived } from '../claim/claim-store'

import type {
  NotificationPayload,
  PushNotificationNavigatorProps,
  NextPropsPushNotificationNavigator,
  ClaimOfferPushPayload,
  AdditionalDataPayload,
  ClaimPushPayload,
} from './type-push-notification'
import type { NavigationParams } from '../common/type-common'
import type { Claim } from '../claim/type-claim'
import type {
  ProofRequestPushPayload,
  AdditionalProofDataPayload,
} from '../proof-request/type-proof-request'

const blackListedRoute = {}

export function convertClaimOfferPushPayloadToAppClaimOffer(
  pushPayload: ClaimOfferPushPayload
): AdditionalDataPayload {
  /**
   * Below expression Converts this format
   * {
   *  name: ["Test"],
   *  height: ["170"]
   * }
   * TO
   * [
   *  {label: "name", data: "Test"},
   *  {label: "height", data: "170"},
   * ]
   */
  const revealedAttributes = Object.keys(pushPayload.claim).map(
    attributeName => ({
      label: attributeName,
      data: pushPayload.claim[attributeName][0],
    })
  )

  return {
    issuer: {
      name: pushPayload.issuer_name || pushPayload.remoteName,
      did: pushPayload.issuer_did,
    },
    data: {
      name: pushPayload.claim_name,
      version: pushPayload.version,
      revealedAttributes,
      claimDefinitionSchemaSequenceNumber: pushPayload.schema_seq_no,
    },
  }
}

export function convertProofRequestPushPayloadToAppProofRequest(
  pushPayload: ProofRequestPushPayload
): AdditionalProofDataPayload {
  const { proof_request_data, remoteName } = pushPayload
  const { requested_attrs, name, version } = proof_request_data
  const requestedAttributes = Object.keys(requested_attrs).map(
    attributeKey => ({
      label: requested_attrs[attributeKey].name,
    })
  )

  return {
    data: {
      name,
      version,
      requestedAttributes,
    },
    requester: {
      name: remoteName,
    },
    originalProofRequestData: proof_request_data,
  }
}

export function convertClaimPushPayloadToAppClaim(
  pushPayload: ClaimPushPayload,
  uid: string,
  forDID: string
): Claim {
  return {
    ...pushPayload,
    messageId: pushPayload.claim_offer_id,
    remoteDid: pushPayload.from_did,
    uid,
    forDID,
  }
}

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
      const {
        type,
        additionalData,
        uid,
        senderLogoUrl,
        remotePairwiseDID,
        forDID,
      } = nextProps.pushNotification.notification

      if (type)
        if (!blackListedRoute[this.props.currentScreen])
          switch (type) {
            case MESSAGE_TYPE.AUTH:
              // TODO:PS: handle auth request
              break

            case MESSAGE_TYPE.CLAIM_OFFER:
              this.props.claimOfferReceived(
                convertClaimOfferPushPayloadToAppClaimOffer(additionalData),
                {
                  uid,
                  senderLogoUrl,
                  remotePairwiseDID,
                }
              )
              //TODO fix the scenario where claim-offer is not added to pending redirection when app is unlocked

              //Redirect to claimOffer after 1 sec because after unlocking the app
              //it redirects to home screen
              //If we don't wait and redirect to claimOffer immediately , then
              //sometimes claim offer screen disappears as home screen redirection will happen
              //after it
              setTimeout(() => {
                this.handleRedirection(claimOfferRoute, {
                  uid,
                })
              }, 1000)
              break

            case MESSAGE_TYPE.PROOF_REQUEST:
              this.props.proofRequestReceived(
                convertProofRequestPushPayloadToAppProofRequest(additionalData),
                {
                  uid,
                  senderLogoUrl,
                  remotePairwiseDID,
                }
              )
              this.handleRedirection(proofRequestRoute, {
                uid,
              })
              break

            case MESSAGE_TYPE.CLAIM:
              this.props.claimReceived(
                convertClaimPushPayloadToAppClaim(additionalData, uid, forDID)
              )
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
      claimReceived,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(
  PushNotificationNavigator
)
