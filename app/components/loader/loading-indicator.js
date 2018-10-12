// @flow
import React, { PureComponent } from 'react'
import { Image, View, StyleSheet, Animated, Easing } from 'react-native'
import type { LoadingIndicatorProps } from './type-loader'
import { DARK } from './type-loader'
import { color } from '../../common/styles/constant'

export default class LoadingIndicator extends PureComponent<
  LoadingIndicatorProps,
  void
> {
  spinValue = new Animated.Value(0)

  static defaultProps = {
    type: DARK,
  }

  spin() {
    this.spinValue.setValue(0)
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start()
  }

  componentDidMount() {
    this.spin()
  }

  render() {
    const rotate = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })
    const { type, size } = this.props
    const tintColor = type === DARK ? color.actions.sixth : color.actions.none

    return (
      <Animated.Image
        style={[
          {
            tintColor,
            transform: [{ rotate: rotate }],
            width: size,
            height: size,
          },
        ]}
        source={require('../../images/icon_sovrin.png')}
      />
    )
  }
}
