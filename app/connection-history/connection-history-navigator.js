// @flow
import { createStackNavigator } from 'react-navigation'

import {
  connectionHistoryDetailsRoute,
  connectionHistoryPendingRoute,
  connectionHistoryRoute,
} from '../common/route-constants'
import ConnectionHistory from './connection-history'
import ConnectionHistoryDetails from './connection-history-details'
import ConnectionHistoryPending from './connection-history-pending'

export default createStackNavigator(
  {
    [connectionHistoryRoute]: {
      screen: ConnectionHistory,
    },
    [connectionHistoryDetailsRoute]: {
      screen: ConnectionHistoryDetails,
    },
    [connectionHistoryPendingRoute]: {
      screen: ConnectionHistoryPending,
    },
  },
  {
    headerMode: 'none',
  }
)
