// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
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
  Icon,
} from '../components'
import {
  connectionHistoryDetailsRoute,
  connectionHistoryRoute,
} from '../common'
import { OFFSET_1X, OFFSET_3X, OFFSET_9X } from '../common/styles/constant'

const styles = StyleSheet.create({
  headerContent: {
    marginTop: OFFSET_1X / 2,
  },
  headerDate: {
    marginBottom: OFFSET_3X / 2,
  },
  headerContainer: {
    minHeight: 109,
  },
  containerStyle: {
    marginTop: OFFSET_9X / 2,
  },
})

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
        <Icon
          testID={'history-details-back-arrow'}
          iconStyle={[headerStyles.headerLeft]}
          small
          src={require('../images/icon_backArrow_white.png')}
          resizeMode="contain"
          onPress={() => goBack(null)}
        />
      </CustomView>
    ),
    headerTitle: (
      <CustomView>
        {action && (
          <CustomText transparentBg semiBold center>
            {action}
          </CustomText>
        )}
        {name && (
          <CustomText
            style={[styles.headerContent]}
            transparentBg
            semiBold
            center
          >
            {name}
          </CustomText>
        )}

        {timestamp && (
          <CustomDate
            format="MM/DD/YYYY | hh:mm A"
            transparentBg
            h7
            center
            uppercase
            style={[styles.headerContent, styles.headerDate]}
          >
            {timestamp}
          </CustomDate>
        )}
      </CustomView>
    ),
    headerStyle: [
      headerStyles.header,
      styles.headerContainer,
      { backgroundColor: theme },
    ],
  })

  render() {
    if (this.props.navigation.state) {
      const { type, data, claimMap } = this.props.navigation.state.params
      const listType = type === 'CLAIM' ? 'center' : 'end'

      return (
        <Container style={[styles.containerStyle]}>
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
