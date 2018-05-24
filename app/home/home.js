// @flow
import React, { PureComponent } from 'react'
import { Animated, StyleSheet, SafeAreaView, Platform } from 'react-native'
import { connect } from 'react-redux'
import {
  Container,
  CustomView,
  Icon,
  UserAvatar,
  CustomText,
} from '../components'
import { StackNavigator } from 'react-navigation'
import Bubbles from './bubbles'
import { color, barStyleDark, OFFSET_3X, OFFSET_2X } from '../common/styles'
import { primaryHeaderStyles } from '../components/layout/header-styles'
import { homeRoute, walletRoute } from '../common'
import { getConnections } from '../store'
import { CLAIM_OFFER_STATUS } from '../claim-offer/type-claim-offer'
import type { Store } from '../store/type-store'
import type { HomeProps, HomeState } from './type-home'
import {
  FEEDBACK_TEST_ID,
  SOVRINTOKEN_TEST_ID,
  SOVRINTOKEN_AMOUNT_TEST_ID,
} from './home-constants'
import { Apptentive } from 'apptentive-react-native'
import WalletBalance from '../wallet/wallet-balance'

export class DashboardScreen extends PureComponent<HomeProps, HomeState> {
  state = {
    scrollY: new Animated.Value(0),
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <WalletBalance
        render={balance => (
          <CustomView
            horizontalSpace
            row
            center
            onPress={() => navigation.navigate(walletRoute)}
            testID={SOVRINTOKEN_AMOUNT_TEST_ID}
            accessible={true}
            accessibilityLabel="token-balance-home"
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
    ),
    headerRight: (
      <CustomView horizontalSpace>
        <Icon
          medium
          onPress={() => Apptentive.presentMessageCenter()}
          testID={FEEDBACK_TEST_ID}
          accessible={true}
          accessibilityLabel={FEEDBACK_TEST_ID}
          src={require('../images/icon_feedback_grey.png')}
        />
      </CustomView>
    ),
    headerStyle: primaryHeaderStyles.header,
  })

  render() {
    const bubblesHeight = this.state.scrollY.interpolate({
      inputRange: [0, 5],
      outputRange: [0, -5],
      extrapolate: 'clamp',
    })

    const { connections: { data } } = this.props
    const connections = getConnections(data)

    return (
      <Container tertiary>
        <Container tertiary>
          {connections &&
            connections.length > 0 && (
              <Bubbles
                navigation={this.props.navigation}
                height={bubblesHeight}
                connections={connections}
              />
            )}
        </Container>
        <CustomView vCenter style={[styles.userAvatarContainer]}>
          <UserAvatar />
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  connections: state.connections,
})

export default StackNavigator({
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
