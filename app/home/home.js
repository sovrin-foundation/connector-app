// @flow
import React, { PureComponent } from 'react'
import { Animated, StyleSheet, Platform } from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  CustomView,
  Icon,
  UserAvatar,
  CustomText,
  CustomHeader,
} from '../components'
import CustomActivityIndicator from '../components/custom-activity-indicator/custom-activity-indicator'
import { createStackNavigator } from 'react-navigation'
import Bubbles from './bubbles'
import {
  color,
  barStyleDark,
  OFFSET_3X,
  OFFSET_2X,
  whiteSmokeSecondary,
} from '../common/styles'
import { primaryHeaderStyles } from '../components/layout/header-styles'
import { homeRoute, walletRoute } from '../common'
import { getConnections } from '../store/connections-store'
import type { Store } from '../store/type-store'
import type { HomeProps, HomeState } from './type-home'
import {
  FEEDBACK_TEST_ID,
  SOVRINTOKEN_TEST_ID,
  SOVRINTOKEN_AMOUNT_TEST_ID,
} from './home-constants'
import { Apptentive } from 'apptentive-react-native'
import WalletBalance from '../wallet/wallet-balance'
import type { Connection } from '../store/type-connection-store'
import Banner from '../components/banner/banner'
import { NavigationActions } from 'react-navigation'
import { getUnseenMessages } from '../store/store-selector'

export class DashboardScreen extends PureComponent<HomeProps, HomeState> {
  state = {
    scrollY: new Animated.Value(0),
  }

  static navigationOptions = ({ navigation }) => ({
    header: (
      <CustomHeader backgroundColor={whiteSmokeSecondary} largeHeader>
        <WalletBalance
          render={balance => (
            <CustomView
              horizontalSpace
              row
              center
              onPress={() => {
                const navigateAction = NavigationActions.navigate({
                  routeName: walletRoute,
                  key: walletRoute,
                })
                navigation.dispatch(navigateAction)
              }}
              testID={SOVRINTOKEN_AMOUNT_TEST_ID}
            >
              <Icon
                small
                testID={SOVRINTOKEN_TEST_ID}
                src={require('../images/sovrinTokenOrange.png')}
              />
              <CustomText
                h5
                demiBold
                center
                style={[styles.floatTokenAmount]}
                transparentBg
                testID={SOVRINTOKEN_AMOUNT_TEST_ID}
                formatNumber
              >
                {balance}
              </CustomText>
            </CustomView>
          )}
        />

        <CustomView horizontalSpace>
          <Icon
            medium
            onPress={() => Apptentive.presentMessageCenter()}
            testID={FEEDBACK_TEST_ID}
            src={require('../images/icon_feedback_grey.png')}
          />
        </CustomView>
      </CustomHeader>
    ),
  })

  render() {
    const bubblesHeight = this.state.scrollY.interpolate({
      inputRange: [0, 5],
      outputRange: [0, -5],
      extrapolate: 'clamp',
    })

    const { connections: { data, hydrated }, unSeenMessages } = this.props
    // type casting from Array<mixed> to any and then to what we need
    // because flow Array<mixed> can't be directly type casted as of now
    const connections: Connection[] = (getConnections(data): any)
    const connectionsCheck = connections && connections.length > 0

    return (
      <Container tertiary>
        <Container tertiary>
          <Banner navigation={this.props.navigation} />
          {connectionsCheck && (
            <Bubbles
              navigation={this.props.navigation}
              height={bubblesHeight}
              connections={connections}
              unSeenMessages={unSeenMessages}
            />
          )}
          {!hydrated ? <CustomActivityIndicator /> : null}
        </Container>
        <CustomView vCenter style={[styles.userAvatarContainer]}>
          <UserAvatar />
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => {
  // when ever there is change in claimOffer state and proof request state
  // getUnseenMessages selector will return updated data
  // this data is used to update red dots on connection bubbles.
  let unSeenMessages = getUnseenMessages(state)
  return {
    connections: state.connections,
    unSeenMessages,
  }
}

export default createStackNavigator({
  [homeRoute]: {
    screen: connect(mapStateToProps)(DashboardScreen),
  },
})

const styles = StyleSheet.create({
  userAvatarContainer: {
    marginVertical: Platform.OS === 'ios' ? OFFSET_3X : OFFSET_3X / 2,
  },
  floatTokenAmount: {
    paddingLeft: 10,
    color: color.actions.font.seventh,
    fontSize: 26,
  },
})
