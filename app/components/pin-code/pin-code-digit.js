// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image } from 'react-native'
import { CustomView } from '../../components'
import { color, OFFSET_1X } from '../../common/styles'
import type { PinCodeDigitProps } from './type-pin-code-box'

const sovrinIcon = require('../../images/icon_sovrin.png')

export default class PinCodeDigit extends PureComponent<
  PinCodeDigitProps,
  void
> {
  render() {
    const { entered, testID = undefined, onPress } = this.props
    const style = entered ? styles.entered : null

    return (
      <CustomView
        onPress={onPress}
        center
        style={[styles.digit, style]}
        testID={testID}
      >
        {entered && (
          <Image style={styles.icon} source={sovrinIcon} resizeMode="contain" />
        )}
      </CustomView>
    )
  }
}

const iconDimension = 26

const styles = StyleSheet.create({
  digit: {
    borderBottomWidth: 5,
    borderBottomColor: color.bg.tertiary.font.tertiary,
    marginHorizontal: OFFSET_1X / 2,
    height: 66,
    width: 38,
  },
  entered: {
    borderBottomColor: color.bg.tertiary.font.tertiary,
  },
  icon: {
    height: iconDimension,
    width: iconDimension,
  },
})
