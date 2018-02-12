// @flow
import React, { PureComponent } from 'react'
import { TouchableHighlight, Image } from 'react-native'
import { StackNavigator } from 'react-navigation'

import type { ConnectionHistoryDetailsProps } from './type-connection-history'
import {
  Container,
  CustomView,
  CustomText,
  CustomList,
  headerStyles,
  ConnectionTheme,
  CustomDate,
} from '../components'
import {
  connectionHistoryDetailsRoute,
  connectionHistoryRoute,
} from '../common'

export class ConnectionHistoryDetails extends PureComponent<
  ConnectionHistoryDetailsProps,
  void
> {
  static navigationOptions = ({
    navigation: {
      goBack,
      state: {
        params: {
          action,
          name,
          timestamp,
          theme,
          senderName,
          image,
          senderDID,
        },
      },
    },
  }) => ({
    headerLeft: (
      <CustomView>
        <TouchableHighlight
          testID={'history-details-back-button'}
          //goBack from current screen works when null is added
          onPress={() => goBack(null)}
        >
          <Image
            testID={'history-details-back-arrow'}
            style={headerStyles.headerLeft}
            source={require('../images/icon_backArrow_white.png')}
            resizeMode="contain"
            onPress={() => goBack(null)}
          />
        </TouchableHighlight>
      </CustomView>
    ),
    headerTitle: (
      <CustomView>
        {action && (
          <CustomText transparentBg semiBold center>
            {action} {name && ' - '} {name}
          </CustomText>
        )}
        {timestamp && (
          <CustomDate
            format="MM/DD/YYYY | hh:mm A"
            transparentBg
            h7
            center
            uppercase
          >
            {timestamp}
          </CustomDate>
        )}
      </CustomView>
    ),
    headerStyle: [headerStyles.header, { backgroundColor: theme }],
  })

  render() {
    if (this.props.navigation.state) {
      const { type, data, claimMap } = this.props.navigation.state.params
      const listType = type === 'CLAIM' ? 'center' : 'end'

      return (
        <Container>
          {data && (
            <CustomList items={data} type={listType} claimMap={claimMap} />
          )}
        </Container>
      )
    }

    // TODO: Handle scenario if no navigation props are passed
    return <Container />
  }
}

export default StackNavigator({
  [connectionHistoryDetailsRoute]: {
    screen: ConnectionHistoryDetails,
  },
})
