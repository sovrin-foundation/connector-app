// @flow
import React, { Component, PureComponent } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { HAIRLINE_WIDTH, maroonRed, white } from '../common/styles/constant'

type DotProps = {
  size: string,
}

export class Dot extends PureComponent<DotProps, void> {
  render() {
    const { size } = this.props
    const dotSize =
      size === 'small'
        ? styles.badgeSmall
        : size === 'medium' ? styles.badgeMedium : styles.badgeLarge
    return <View style={[styles.badge, dotSize]} />
  }
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: maroonRed,
    ...Platform.select({
      ios: {
        borderWidth: HAIRLINE_WIDTH,
      },
      android: {
        borderWidth: 1,
      },
    }),
    borderColor: white,
  },
  badgeSmall: {
    width: 15,
    height: 15,
    borderRadius: 10,
  },
  badgeMedium: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  badgeLarge: {
    width: 25,
    height: 25,
    borderRadius: 15,
  },
})
