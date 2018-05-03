// @flow

import React, { PureComponent } from 'react'
import { CustomView, CustomText, Container } from '../../components'
import type { KeyboardProps, KeyboardState } from './type-keyboard'
import {
  KEYBOARD_TEST_ID,
  SPECIAL_DECIMAL_FORMAT,
  BACK_SPACE_SYMBOL,
  BACK_SPACE,
  MAX_LENGTH,
  DECIMAL,
} from './keyboard-constants'
import styles from './styles'

export default class Keyboard extends PureComponent<
  KeyboardProps,
  KeyboardState
> {
  static defaultProps = {
    maxLength: 9,
  }

  state = {
    text: '',
  }

  Backspace(symbol: string) {
    return (
      <Container
        accessibilityLabel={BACK_SPACE}
        center
        testID={`${KEYBOARD_TEST_ID}-back-space`}
        onPress={() => {
          this.onPress(BACK_SPACE)
        }}
      >
        <CustomText
          transparentBg
          center
          style={[styles.number, { color: this.props.color }]}
        >
          {symbol}
        </CustomText>
      </Container>
    )
  }

  Row(numbersArray: Array<string>) {
    let cells = numbersArray.map(val => this.Cell(val))
    return (
      <CustomView row style={[styles.marginTop]}>
        {cells}
      </CustomView>
    )
  }

  Cell(symbol: string) {
    const { maxLength } = this.props
    return (
      <Container
        center
        key={symbol}
        testID={`${KEYBOARD_TEST_ID}-${symbol}`}
        accessibilityLabel={symbol.toString()}
        onPress={() => {
          maxLength && maxLength > this.state.text.length
            ? this.onPress(symbol.toString())
            : this.onPress(MAX_LENGTH)
        }}
      >
        <CustomText
          transparentBg
          center
          style={[styles.number, { color: this.props.color }]}
        >
          {symbol}
        </CustomText>
      </Container>
    )
  }

  onPress(key: string) {
    const { text } = this.state
    const NO_DECIMAL = !text.includes(DECIMAL)
    const HAS_INPUT = text.length

    let curText: string = text
    let animate: boolean = false
    if (isNaN(key)) {
      if (key === BACK_SPACE) {
        curText =
          text === SPECIAL_DECIMAL_FORMAT
            ? (curText = '')
            : curText.slice(0, -1)
        // animate if backspace is pressed with nothing stored in text
        animate = HAS_INPUT ? false : true
      } else if (key === MAX_LENGTH) {
        curText = curText
        animate = true
      } else if (key === DECIMAL) {
        // only allow one decimal place
        curText = HAS_INPUT
          ? NO_DECIMAL ? (curText += key) : curText
          : SPECIAL_DECIMAL_FORMAT
        animate = HAS_INPUT ? (NO_DECIMAL ? false : true) : false
      }
    } else if (key === '0' && !HAS_INPUT) {
      curText = curText
      animate = true
    } else {
      curText += key
    }
    this.setState({ text: curText })
    this.props.onPress(curText, animate)
  }

  render() {
    return (
      <CustomView left style={[styles.container]}>
        {this.Row(['1', '2', '3'])}
        {this.Row(['4', '5', '6'])}
        {this.Row(['7', '8', '9'])}
        <CustomView row style={[styles.marginTop]}>
          {this.Cell(DECIMAL)}
          {this.Cell('0')}
          {this.Backspace(BACK_SPACE_SYMBOL)}
        </CustomView>
      </CustomView>
    )
  }
}
