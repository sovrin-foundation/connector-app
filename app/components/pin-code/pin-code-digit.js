// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image } from 'react-native'
import { CustomView } from '../../components'
import { color, OFFSET_1X } from '../../common/styles'
import type { PinCodeDigitProps } from './type-pin-code-box'

const sovrinIcon = require('../../images/SovrinSymbol.png')

export default class PinCodeDigit
  extends PureComponent<void, PinCodeDigitProps, void> {
  render() {
    const { entered, testID = undefined } = this.props
    const style = entered ? styles.entered : null

    return (
      <CustomView center style={[styles.digit, style]} testID={testID}>
        {entered &&
          <Image
            style={styles.icon}
            source={sovrinIcon}
            resizeMode="contain"
          />}
      </CustomView>
    )
  }
}

const iconDimension = 26

const styles = StyleSheet.create({
  digit: {
    borderBottomWidth: 5,
    borderBottomColor: color.actions.secondary,
    marginHorizontal: OFFSET_1X / 2,
    height: 66,
    width: 38,
  },
  entered: {
    borderBottomColor: color.actions.none,
  },
  icon: {
    height: iconDimension,
    width: iconDimension,
  },
})
