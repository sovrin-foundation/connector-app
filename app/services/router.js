import { invitationRoute } from '../common/route-constants'

export default function handlePushNotification(props, expectedScreen) {
  if (props.route.currentScreen == expectedScreen) {
    // todo: remove hard coded data & get data from notification
    props.authenticationRequestReceived({
      offerMsgTitle: 'Hi Drummond',
      offerMsgText: 'Suncoast wants to connect with you',
      status: 'push-notification-sent',
    })
    props.navigation.navigate(invitationRoute)
    props.pushNotificationReceived(null)
  }
}
