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
  HeaderStyles,
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
      navigate,
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
          onPress={() =>
            navigate(connectionHistoryRoute, { senderName, image, senderDID })}
        >
          <Image
            testID={'history-details-back-arrow'}
            style={HeaderStyles.headerLeft}
            source={require('../images/icon_backArrow_white.png')}
            resizeMode="contain"
            onPress={() =>
              navigate(connectionHistoryRoute, {
                senderName,
                image,
                senderDID,
              })}
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
            format="MM/DD/YYY | hh:mm A"
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
    headerStyle: [HeaderStyles.header, { backgroundColor: theme }],
  })

  render() {
    const { type, data } = this.props.navigation.state.params
    const listType = type === 'claim' ? 'center' : 'end'
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
