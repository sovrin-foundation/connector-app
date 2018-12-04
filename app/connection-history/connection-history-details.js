// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Dimensions, Platform, ScrollView } from 'react-native'
import { createStackNavigator } from 'react-navigation'
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
  CustomSafeAreaView,
} from '../components'
import {
  connectionHistoryDetailsRoute,
  connectionHistoryRoute,
} from '../common'
import {
  OFFSET_1X,
  OFFSET_3X,
  OFFSET_9X,
  OFFSET_2X,
  iPhoneXHeight,
} from '../common/styles/constant'

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
      <Container clearBg center style={[headerStyles.centerTitle]}>
        {action && (
          <CustomText transparentBg center>
            {action}
          </CustomText>
        )}
        {name && (
          <CustomText
            style={[styles.headerContent]}
            transparentBg
            semiBold
            center
            numberOfLines={1}
          >
            {name}
          </CustomText>
        )}

        {timestamp && (
          <CustomDate
            transparentBg
            h7
            center
            uppercase
            style={[styles.headerContent, styles.headerDate]}
          >
            {timestamp}
          </CustomDate>
        )}
      </Container>
    ),
    headerRight: <Container />,
    headerStyle: [
      headerStyles.header,
      styles.headerContainer,
      { backgroundColor: theme },
    ],
  })

  getContainerStyle = (deviceClass: string) => {
    if (deviceClass === 'IphoneX') {
      return {
        marginTop: OFFSET_2X,
      }
    }
    return {
      marginTop: OFFSET_9X / 2,
    }
  }

  render() {
    const { height } = Dimensions.get('window')

    const deviceClass =
      Platform.OS === 'ios'
        ? height === iPhoneXHeight ? 'IphoneX' : 'ios'
        : 'android'

    if (this.props.navigation.state) {
      const { type, data, claimMap } = this.props.navigation.state.params
      const listType = type === 'CLAIM' ? 'center' : 'end'

      return (
        <Container style={[this.getContainerStyle(deviceClass)]}>
          {data && (
            <ScrollView>
              <CustomList items={data} type={listType} claimMap={claimMap} />
            </ScrollView>
          )}
        </Container>
      )
    }

    // TODO: Handle scenario if no navigation props are passed
    return <Container />
  }
}

export default createStackNavigator({
  [connectionHistoryDetailsRoute]: {
    screen: ConnectionHistoryDetails,
  },
})
