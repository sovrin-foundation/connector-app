// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Container } from './layout/container'
import { color, MARGIN_BOTTOM } from '../common/styles/constant'
import type { GenericObject } from '../common/type-common'

// TODO:KS Change GenericObject to specific props by combining CustomView props
export class ListItem extends PureComponent<GenericObject, *> {
  render() {
    const { style = [], bottomMargin } = this.props
    const itemStyles = [bottomMargin ? styles.bottomMargin : null, ...style]

    return (
      <Container secondary pad row {...this.props} style={itemStyles}>
        {this.props.children}
      </Container>
    )
  }
}

export class ListItemData extends PureComponent<GenericObject, *> {
  render() {
    return (
      <Container row {...this.props}>
        {this.props.children}
      </Container>
    )
  }
}

export default class InfoSectionList extends PureComponent<GenericObject, *> {
  render() {
    return (
      <Container tertiary {...this.props}>
        {this.props.children}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  bottomMargin: {
    marginBottom: MARGIN_BOTTOM,
  },
})
