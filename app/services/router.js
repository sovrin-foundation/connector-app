// @flow
import {
  PUSH_NOTIFICATION_SENT_CODE,
  PUSH_NOTIFICATION_TYPE,
  lockEnterPinRoute,
  claimOfferRoute,
  invitationRoute,
} from '../common'
import { CLAIM_OFFER_STATUS } from '../claim-offer/type-claim-offer'

// TODO:KS Add type for flow, before 461 is done, complete types
export default function handlePushNotification(
  props: any,
  notification: any,
  expectedScreen: string,
  isAppLocked?: boolean,
  pendingRedirectAction?: (routeName: string) => void
) {
  if (notification.type === PUSH_NOTIFICATION_TYPE.AUTH) {
    // TODO: change push-notification-sent to push-notification-received
    if (props.route.currentScreen == expectedScreen) {
      props.authenticationRequestReceived({
        offerMsgTitle: notification.authNotifMsgTitle,
        offerMsgText: notification.authNotifMsgText,
        statusCode: PUSH_NOTIFICATION_SENT_CODE,
        logoUrl: notification.logoUrl,
        remoteConnectionId: notification.remoteConnectionId || null,
      })
      if (!isAppLocked) {
        props.navigation.navigate(invitationRoute)
      } else {
        pendingRedirectAction && pendingRedirectAction(invitationRoute)
      }
      props.pushNotificationReceived(null)
    }
  }

  if (
    notification.type === PUSH_NOTIFICATION_TYPE.CLAIM_OFFER &&
    props.route.currentScreen === expectedScreen &&
    expectedScreen !== lockEnterPinRoute
  ) {
    // if we receive claim-offer push notification while we are on lock screen
    // we won't redirect user, because claim offer is supposed to open
    // as a modal pop up, which slides up and then slide down back
    // so, it should open after user is redirected to home screen or connection
    // Other screens will handle redirecting user to claim-offer screen
    // and when claim offer is accepted/ignored or close button is pressed
    // claim offer will slide down and back view will be shown
    // we need to somehow handle all push notification and redirection related
    // stuff in our own navigator which will be built on top of StackNavigator
    props.navigation.navigate(claimOfferRoute)
  }
}
