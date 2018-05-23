// @flow

import React, { Component } from 'react'
import { Animated, TouchableWithoutFeedback } from 'react-native'
import { CustomView, CustomText, Container } from '../../components'
import type { KeyboardProps, KeyboardState } from './type-keyboard'
import {
  KEYBOARD_TEST_ID,
  SPECIAL_DECIMAL_FORMAT,
  BACK_SPACE_SYMBOL,
  BACK_SPACE,
  MAX_LENGTH,
  DECIMAL,
  ZERO,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
} from './keyboard-constants'
import styles from './styles'

const inputRange = [0, 0.5, 1]
const outputRange = [28, 35, 42]

export default class Keyboard extends Component<KeyboardProps, KeyboardState> {
  originalOptions: Array<string>
  _animation: any

  constructor(props: KeyboardProps) {
    super(props)
    this.state = {
      text: '',
    }
    this.originalOptions = [
      ONE,
      TWO,
      THREE,
      FOUR,
      FIVE,
      SIX,
      SEVEN,
      EIGHT,
      NINE,
      DECIMAL,
      ZERO,
      BACK_SPACE_SYMBOL,
    ]
    this._animation = this.originalOptions.map(i => new Animated.Value(0))
  }
  static defaultProps = {
    maxLength: 9,
  }

  animation = (key: string) => {
    const animationKey = this.originalOptions.indexOf(key)

    this._animation[animationKey].setValue(0)
    Animated.spring(this._animation[animationKey], {
      speed: 120,
      toValue: 1,
      bounciness: 10,
      overshootClamping: false,
    }).start(() => {
      this._animation[animationKey].setValue(0)
    })
  }

  Backspace(symbol: string) {
    const animationKey = this.originalOptions.indexOf(symbol)
    const textSize = this._animation[animationKey].interpolate({
      inputRange,
      outputRange,
    })
    return (
      <Container
        accessibilityLabel={BACK_SPACE}
        center
        testID={`${KEYBOARD_TEST_ID}-back-space`}
        onPress={() => {
          this.onPress(BACK_SPACE_SYMBOL)
        }}
      >
        <CustomText
          transparentBg
          animated
          center
          style={[
            styles.number,
            { color: this.props.color, fontSize: textSize },
          ]}
        >
          {symbol}
        </CustomText>
      </Container>
    )
  }

  Row(numbersArray: Array<string>) {
    const rowStyle = numbersArray.includes(ONE) ? styles.firstRow : styles.row
    let cells = numbersArray.map(val => this.Cell(val))

    return (
      <CustomView row style={[rowStyle]}>
        {cells}
      </CustomView>
    )
  }

  Cell(symbol: string) {
    const animationKey = this.originalOptions.indexOf(symbol)
    const { maxLength } = this.props
    const textSize = this._animation[animationKey].interpolate({
      inputRange,
      outputRange,
    })
    return (
      <TouchableWithoutFeedback
        key={symbol}
        testID={`${KEYBOARD_TEST_ID}-${symbol}`}
        accessibilityLabel={symbol}
        onPressIn={() => {
          maxLength && maxLength > this.state.text.length
            ? this.onPress(symbol)
            : this.onPress(symbol, MAX_LENGTH)
        }}
      >
        <Container center>
          <CustomText
            transparentBg
            animated
            center
            style={[
              styles.number,
              { color: this.props.color, fontSize: textSize },
            ]}
          >
            {symbol}
          </CustomText>
        </Container>
      </TouchableWithoutFeedback>
    )
  }

  onPress(key: string, MAX_LENGTH: ?string) {
    this.animation(key)

    const { text } = this.state
    const NO_DECIMAL = !text.includes(DECIMAL)
    const HAS_INPUT = text.length

    let curText: string = text

    if (MAX_LENGTH) {
      const animate = true
      this.setState({ text: curText })

      return this.props.onPress(curText, animate)
    } else if (key === BACK_SPACE_SYMBOL) {
      const updatedText =
        curText === SPECIAL_DECIMAL_FORMAT
          ? (curText = '')
          : curText.slice(0, -1)
      // animate if backspace is pressed with nothing stored in text
      const animate = HAS_INPUT ? false : true

      this.setState({ text: updatedText })

      return this.props.onPress(updatedText, animate)
    } else if (key === DECIMAL) {
      // only allow one decimal place
      const updatedText = HAS_INPUT
        ? NO_DECIMAL ? (curText += key) : curText
        : SPECIAL_DECIMAL_FORMAT
      const animate = HAS_INPUT ? (NO_DECIMAL ? false : true) : false

      this.setState({ text: updatedText })

      return this.props.onPress(updatedText, animate)
    } else if (key === ZERO && !HAS_INPUT) {
      const animate = true
      this.setState({ text })

      return this.props.onPress(text, animate)
    } else {
      const updatedText = (curText += key)
      const animate = false

      this.setState({ text: updatedText })

      return this.props.onPress(updatedText, animate)
    }
  }

  render() {
    return (
      <CustomView left style={[styles.container]}>
        {this.Row([ONE, TWO, THREE])}
        {this.Row([FOUR, FIVE, SIX])}
        {this.Row([SEVEN, EIGHT, NINE])}
        <CustomView row style={[styles.row]}>
          {this.Cell(DECIMAL)}
          {this.Cell(ZERO)}
          {this.Backspace(BACK_SPACE_SYMBOL)}
        </CustomView>
      </CustomView>
    )
  }
}
