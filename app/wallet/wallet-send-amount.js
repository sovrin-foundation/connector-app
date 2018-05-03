// @flow

import React, { PureComponent } from 'react'
import * as Animatable from 'react-native-animatable'
import { Text, Animated } from 'react-native'

import { Container, CustomView, CustomText } from '../components'
import { Keyboard } from '../components'
import { color } from '../common/styles/constant'
import type {
  WalletSendAmountState,
  WalletSendAmountProps,
} from './type-wallet'

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
  render() {
    const { text } = this.state
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
        <CustomView spaceAround>
          <CustomView>
            <CustomView doubleVerticalSpace>
              <CustomText
                animated
                formatNumber
                adjustsFontSizeToFit
                minimumFontScale={0.8}
                transparentBg
                center
                style={[
                  animatedStyle,
                  {
                    color: color.bg.seventh.font.fifth,
                    fontSize: 70,
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
        </CustomView>
      </Container>
    )
  }
}
