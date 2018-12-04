// @flow
import { Alert } from 'react-native'

const showDID = (senderDID: string, myDID: string) => {
  Alert.alert(
    'Connection DID',
    'Sender DID:\n' + senderDID + '\nMy DID:\n' + myDID,
    [{ text: 'OK' }],
    { cancelable: true }
  )
}

export default showDID
