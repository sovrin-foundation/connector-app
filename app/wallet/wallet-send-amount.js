// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Text, Animated } from 'react-native'
import { scale } from 'react-native-size-matters'
import { Container, CustomView, CustomText, CustomButton } from '../components'
import { Keyboard } from '../components'
import { color } from '../common/styles/constant'
import { SEND_TOKEN_BUTTON, FONT_SIZE_MAPPING } from './wallet-constants'
import styles from './styles'
import type {
  WalletSendAmountState,
  WalletSendAmountProps,
} from './type-wallet'
import { walletTabSendDetailsRoute } from '../common/route-constants'
import { selectTokenAmount } from './wallet-store'
import { getWalletBalance } from '../store/store-selector'
import type { Store } from '../store/type-store'
import { STORE_STATUS } from './type-wallet'

class WalletSendAmount extends PureComponent<
  WalletSendAmountProps,
  WalletSendAmountState
> {
  _shake: any
  _tokenKeyboard: null | Keyboard
  state = {
    text: '',
  }

  constructor(props) {
    super(props)
    this._shake = new Animated.Value(0)
  }

  changeText = (text: string, animate: boolean) => {
    if (animate) {
      return this.shake()
    }
    return this.setState({ text })
  }

  shake = () => {
    this._shake.setValue(0)
    Animated.spring(this._shake, {
      toValue: 1,
      friction: 3,
      tension: 10,
      useNativeDriver: true,
    }).start(() => {
      this._shake.setValue(0)
    })
  }

  sendTokenAmount = () => {
    this.props.selectTokenAmount(this.state.text)
    if (this.state.text.length) {
      this.props.screenProps.navigation.navigate(walletTabSendDetailsRoute, {
        ...this.props.navigation,
      })
    }
  }

  saveTokenKeyboardRef = tokenKeyboard => {
    this._tokenKeyboard = tokenKeyboard
  }

  render() {
    const { text } = this.state

    // adjust fontSize based on text length
    const fontSize = scale(FONT_SIZE_MAPPING(text.length))
    const animatedStyle = {
      transform: [
        {
          translateX: this._shake.interpolate({
            inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.55, 0.7, 0.8, 0.9, 1],
            outputRange: [0, -10, 0, -10, 0, -10, 0, -10, 0, 0],
          }),
        },
      ],
    }
    const isSendDisabled = text.length < 1 || text === '0'

    return (
      <Container tertiary>
        <Container style={[styles.verticalSpacing]}>
          <CustomView>
            <CustomView verticalSpace>
              <CustomText
                animated
                formatNumber
                transparentBg
                center
                style={[
                  animatedStyle,
                  {
                    fontSize,
                    color: color.bg.seventh.font.fifth,
                    height: 70,
                    lineHeight: 75,
                  },
                ]}
                numberOfLines={1}
              >
                {text || 0}
              </CustomText>
            </CustomView>
            <CustomText h6 center tertiary demibold uppercase transparentBg>
              sovrin tokens
            </CustomText>
          </CustomView>
          <Keyboard
            color={color.bg.seventh.font.fifth}
            onPress={this.changeText}
            maxValue={this.props.walletBalance}
            ref={this.saveTokenKeyboardRef}
          />
        </Container>
        <CustomView safeArea style={[styles.alignItemsCenter]}>
          <CustomButton
            disabled={isSendDisabled}
            customColor={{ backgroundColor: color.bg.eighth.color }}
            onPress={this.sendTokenAmount}
            testID={SEND_TOKEN_BUTTON}
            style={[styles.ctaButton]}
            primary
            title="Select Recipient"
          />
        </CustomView>
      </Container>
    )
  }

  componentDidUpdate(prevProps: WalletSendAmountProps) {
    if (
      this.props.paymentStatus !== prevProps.paymentStatus &&
      this.props.paymentStatus === STORE_STATUS.SUCCESS
    ) {
      // if payment is successful, we can now reset token amount and keyboard
      this.setState({ text: '' })
      this._tokenKeyboard && this._tokenKeyboard.clear()
    }
  }
}

const mapStateToProps = (state: Store) => {
  return {
    walletBalance: getWalletBalance(state),
    paymentStatus: state.wallet.payment.status,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      selectTokenAmount,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(WalletSendAmount)
