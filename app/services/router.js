import { invitationRoute } from '../common/route-constants'
import { PUSH_NOTIFICATION_SENT_CODE } from '../common/api-constants'

export default function handlePushNotification(
  props,
  notification,
  expectedScreen,
  isAppLocked,
  pendingRedirectAction
) {
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
      pendingRedirectAction(invitationRoute)
    }
    props.pushNotificationReceived(null)
  }
}
