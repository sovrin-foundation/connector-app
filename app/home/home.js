// @flow
import React, { PureComponent } from 'react'
import { Animated, StyleSheet, Platform, Dimensions } from 'react-native'
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
  isBiggerThanShortDevice,
  isBiggerThanVeryShortDevice,
  whiteSmokeSecondary,
  responsiveHorizontalPadding,
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
import { scale } from 'react-native-size-matters'
import { size } from './../components/icon'

const { width, height } = Dimensions.get('window')

export class DashboardScreen extends PureComponent<HomeProps, HomeState> {
  state = {
    scrollY: new Animated.Value(0),
  }

  static navigationOptions = ({ navigation }) => ({
    header: (
      <CustomHeader
        backgroundColor={whiteSmokeSecondary}
        outerContainerStyles={styles.headerOuterContainer}
        largeHeader
      >
        <WalletBalance
          render={balance => (
            <CustomView
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
                style={[
                  styles.floatTokenAmount,
                  {
                    fontSize: tokenAmountSize(balance.length),
                  },
                ]}
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
          <CustomView style={[styles.userAvatarContainer]}>
            <UserAvatar />
          </CustomView>
        </Container>
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
const getHeight = height => {
  if (isBiggerThanVeryShortDevice && !isBiggerThanShortDevice) {
    return height - 230
  }
  if (isBiggerThanShortDevice) {
    return height - 250
  }
  return height - 220
}
export default createStackNavigator({
  [homeRoute]: {
    screen: connect(mapStateToProps)(DashboardScreen),
  },
})

const tokenAmountSize = (tokenAmountLength: number): number => {
  // this resizing logic is different than wallet tabs header
  switch (true) {
    case tokenAmountLength < 16:
      return scale(26)
    case tokenAmountLength < 20:
      return scale(20)
    default:
      return scale(19)
  }
}

const styles = StyleSheet.create({
  userAvatarContainer: {
    backgroundColor: 'transparent',
    width: size.extraLarge, // width of user avathar icon extraLarge
    position: 'absolute',
    left: (width - size.extraLarge) / 2,
    top: getHeight(height),
  },
  floatTokenAmount: {
    color: color.actions.font.seventh,
    paddingHorizontal: 8,
  },
  headerOuterContainer: {
    paddingHorizontal: responsiveHorizontalPadding,
  },
})
