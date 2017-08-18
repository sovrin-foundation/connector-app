import { invitationRoute } from '../common/route-constants'
import { PUSH_NOTIFICATION_SENT_CODE } from '../common/api-constants'

export default function handlePushNotification(
  props,
  notification,
  expectedScreen
) {
  // TODO: change push-notification-sent to push-notification-recevied
  if (props.route.currentScreen == expectedScreen) {
    props.authenticationRequestReceived({
      offerMsgTitle: notification.authNotifMsgTitle,
      offerMsgText: notification.authNotifMsgText,
      statusCode: PUSH_NOTIFICATION_SENT_CODE,
      remoteConnectionId: notification.remoteConnectionId || null,
    })
    props.navigation.navigate(invitationRoute)
    props.pushNotificationReceived(null)
  }
}
