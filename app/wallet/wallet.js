// @flow

import React, { PureComponent } from 'react'
import { Image } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Container, CustomView, CustomText, Icon } from '../components'
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
    headerLeft: <Container style={[styles.headerSpacer]} />,
    headerTitle: (
      <WalletBalance
        render={balance => (
          <Container style={[styles.balanceHeader]}>
            <Container center style={[styles.sovrinLogoWrapper]}>
              <Image large source={sovrinLogo} />
            </Container>
            <CustomView row center>
              <Icon medium src={tokenLogo} />
              <CustomView horizontalSpace>
                <CustomText
                  h3
                  demiBold
                  formatNumber
                  transparentBg
                  style={[{ width: '100%' }]}
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
    ),
    headerRight: (
      <CustomView testID={'wallet-header-close'} style={[styles.headerSpacer]}>
        <Icon
          medium
          onPress={() => navigation.goBack(null)}
          testID="wallet-header-close-image"
          iconStyle={[styles.headerCloseIcon]}
          src={closeImage}
        />
      </CustomView>
    ),
    headerStyle: {
      backgroundColor: color.actions.font.seventh,
      height: 120,
    },
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

export default StackNavigator({
  [walletRoute]: {
    screen: Wallet,
  },
})
