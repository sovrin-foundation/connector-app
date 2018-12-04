// @flow
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { CustomView } from '../components'
import { color } from '../common/styles'

export default class Separator extends Component<void, void> {
  render() {
    return <CustomView style={[styles.separator]} />
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 2,
    backgroundColor: color.bg.secondary.font.tertiary,
  },
})
