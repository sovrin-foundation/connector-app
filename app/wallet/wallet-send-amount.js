// @flow

import React, { PureComponent } from 'react'
import { Text, Animated } from 'react-native'
import { Container, CustomView, CustomText, CustomButton } from '../components'
import { Keyboard } from '../components'
import { color } from '../common/styles/constant'
import { SEND_TOKEN_BUTTON } from './wallet-constants'
import styles from './styles'
import type {
  WalletSendAmountState,
  WalletSendAmountProps,
} from './type-wallet'
import { walletTabSendDetailsRoute } from '../common/route-constants'

const FONT_SIZE_MAPPING = {
  '0': 70,
  '1': 70,
  '2': 70,
  '3': 70,
  '4': 70,
  '5': 60,
  '6': 60,
  '7': 50,
  '8': 50,
  '9': 50,
}

export default class WalletSendAmount extends PureComponent<
  WalletSendAmountProps,
  WalletSendAmountState
> {
  _shake: any
  state = {
    text: '',
  }
  componentWillMount() {
    this._shake = new Animated.Value(0)
  }

  changeText(text: string, animate: boolean) {
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
    if (this.state.text.length) {
      // TODO route to send token amount details with state.text as a parameter

      this.props.screenProps.navigation.navigate(walletTabSendDetailsRoute)
    }
  }

  render() {
    const { text } = this.state

    // adjust fontSize based on text length
    const fontSize = FONT_SIZE_MAPPING[text.length]
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
            onPress={(val, animate) => this.changeText(val, animate)}
          />
        </Container>
        <CustomView safeArea style={[styles.alignItemsCenter]}>
          <CustomButton
            disabled={text.length < 1}
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
}
