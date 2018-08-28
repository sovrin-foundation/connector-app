// @flow

import React, { PureComponent } from 'react'
import { Image } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { scale } from 'react-native-size-matters'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomHeader,
  CustomSafeAreaView,
} from '../components'
import { homeRoute, walletRoute } from '../common'
import { color } from '../common/styles/constant'
import { RECEIVE_TAB, SEND_TAB, HISTORY_TAB } from './wallet-constants'
import WalletBalance from './wallet-balance'
import WalletTabs from './wallet-tabs'
import type { WalletProps } from './type-wallet'
import styles from './styles'

const closeImage = require('../images/iconClose.png')
const sovrinLogo = require('../images/sovrinLogo.png')
const tokenLogo = require('../images/sovrinTokenWhite.png')

export class Wallet extends PureComponent<WalletProps, void> {
  static navigationOptions = ({ navigation }) => ({
    // Makes it so that headerTitle is centered Android
    header: (
      <CustomHeader
        backgroundColor={color.actions.font.seventh}
        outerContainerStyles={{ height: 120 }}
        largeHeader
      >
        <CustomView style={[styles.headerSpacer]} />

        <WalletBalance
          render={(balance: string) => (
            <Container>
              <Container center>
                <Icon extraLarge src={sovrinLogo} />
              </Container>
              <CustomView row center>
                <Icon medium src={tokenLogo} />
                <CustomView horizontalSpace>
                  {/**
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
                   */}
                  <CustomText
                    medium
                    formatNumber
                    transparentBg
                    style={[{ width: '100%', fontSize: scale(30) }]}
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

        <CustomView
          testID={'wallet-header-close'}
          style={[styles.headerSpacer]}
        >
          <Icon
            medium
            onPress={() => navigation.goBack(null)}
            testID="wallet-header-close-image"
            iconStyle={[styles.headerCloseIcon]}
            src={closeImage}
          />
        </CustomView>
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
