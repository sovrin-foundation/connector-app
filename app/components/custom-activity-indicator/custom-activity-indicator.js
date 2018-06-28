// @flow
import React, { PureComponent } from 'react'
import { Animated, Easing } from 'react-native'
import { Container } from '../layout/container'
import { color } from '../../common/styles/constant'
import type { CustomActivityIndicatorProps } from './type-custom-activity-indicator'

export default class CustomActivityIndicator extends PureComponent<
  CustomActivityIndicatorProps,
  void
> {
  spinValue = new Animated.Value(0)

  static defaultProps = {
    tintColor: color.actions.sixth,
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

    return (
      <Container center>
        <Animated.Image
          style={{
            tintColor: this.props.tintColor,
            transform: [{ rotate: rotate }],
            width: 30,
            height: 30,
          }}
          source={require('../../images/icon_sovrin.png')}
        />
      </Container>
    )
  }
}
