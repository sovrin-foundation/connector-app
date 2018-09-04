// @flow

import React, { PureComponent } from 'react'
import { Image, StyleSheet } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { scale } from 'react-native-size-matters'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomHeader,
} from '../components'
import { walletRoute } from '../common'
import {
  color,
  isSmallWidthDevice,
  responsiveHorizontalPadding,
} from '../common/styles/constant'
import WalletBalance from './wallet-balance'
import WalletTabs from './wallet-tabs'
import type { WalletProps } from './type-wallet'
import styles from './styles'

const closeImage = require('../images/iconClose.png')
const sovrinLogo = require('../images/sovrinLogo.png')
const tokenLogo = require('../images/sovrinTokenWhite.png')

const walletTabsHeaderBalanceFontSize = (balance: string) => {
  /**
   * TODO:KS below logic to select size as per length is an ugly logic
   * adjustsFontSizeToFit is not working due to center alignment and no width
   * on parent container, we can't set width as well from Dimensions module
   * because there are other elements besides this which are taking up space
   * also, other elements width are not defined, so we can't calculate width as well
   * Even if we would have used adjustsFontSizeToFit, we can't control the scale
   * with which font size is reduced on Android, a scale factor is provided for ios
   * So, for now as a hack we are providing font by ourselves.
   * Normally, we would have preferred to just wrap the text, but we can't wrap it
   * because it is a number. Also, header is hard coded with a height
   */
  const digits = balance.length
  switch (true) {
    case digits < 13:
      return scale(30)
    case digits < 16:
      return scale(25)
    case digits < 20:
      return scale(19)
    default:
      return scale(16)
  }
}

const walletTabsHeaderStyles = StyleSheet.create({
  outerContainer: {
    height: 120,
    paddingHorizontal: responsiveHorizontalPadding,
  },
  closeButtonContainer: { height: '100%', alignItems: 'flex-end', zIndex: 1 },
})
// sovrin currency logo beside the amount also needs to be scaled down
// this cannot be scaled down just one the basis of device
// because if wallet balance is just 5 or 6 characters, then font size
// for wallet balance will be big, so we want to scale this logo as well
// as per the size of wallet balance text as well
const sovrinTokenIconSize = (balanceLength: number) =>
  balanceLength > 14 && isSmallWidthDevice ? { small: true } : { medium: true }

export class Wallet extends PureComponent<WalletProps, void> {
  static navigationOptions = ({ navigation }) => ({
    // Makes it so that headerTitle is centered Android
    header: (
      <CustomHeader
        backgroundColor={color.actions.font.seventh}
        outerContainerStyles={walletTabsHeaderStyles.outerContainer}
        largeHeader
      >
        <Container />

        <WalletBalance
          render={(balance: string) => (
            <Container>
              <Container center>
                <Icon extraLarge src={sovrinLogo} />
              </Container>
              <CustomView row center>
                <Icon
                  {...sovrinTokenIconSize(balance.length)}
                  src={tokenLogo}
                />
                <CustomView horizontalSpace>
                  <CustomText
                    medium
                    formatNumber
                    transparentBg
                    style={[
                      {
                        width: '100%',
                        fontSize: walletTabsHeaderBalanceFontSize(balance),
                      },
                    ]}
                  >
                    {balance}
                  </CustomText>
                </CustomView>
              </CustomView>
              <CustomView center>
                <CustomText h6 demiBold transparentBg uppercase>
                  current balance
                </CustomText>
              </CustomView>
            </Container>
          )}
        />

        <Container
          testID={'wallet-header-close'}
          style={[walletTabsHeaderStyles.closeButtonContainer]}
        >
          <Icon
            medium
            onPress={() => navigation.goBack(null)}
            testID="wallet-header-close-image"
            iconStyle={[styles.headerCloseIcon]}
            src={closeImage}
          />
        </Container>
      </CustomHeader>
    ),
    gesturesEnabled: true,
  })

  render() {
    return (
      <Container tertiary>
        <WalletTabs navigation={this.props.navigation} />
      </Container>
    )
  }
}

export default createStackNavigator({
  [walletRoute]: {
    screen: Wallet,
  },
})
