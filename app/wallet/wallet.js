// @flow

import React, { PureComponent } from 'react'
import { TouchableHighlight, Image } from 'react-native'
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

class Wallet extends PureComponent<WalletProps, void> {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: null,
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
      <CustomView
        onPress={() => navigation.goBack(null)}
        testID={'wallet-header-close'}
      >
        <Icon
          medium
          absolute="TopRight"
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
  })

  render() {
    return (
      <Container tertiary>
        <WalletTabs />
      </Container>
    )
  }
}

export default StackNavigator({
  [walletRoute]: {
    screen: Wallet,
  },
})
