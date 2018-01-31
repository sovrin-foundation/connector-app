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
  void,
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
    const { type, data } = this.props.navigation.state.params
    const listType = type === 'CLAIM' ? 'center' : 'end'
    return (
      <Container>
        <CustomList items={data} type={listType} />
      </Container>
    )
  }
}

export default StackNavigator({
  [connectionHistoryDetailsRoute]: {
    screen: ConnectionHistoryDetails,
  },
})
