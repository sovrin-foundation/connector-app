import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Container } from './layout'
import { color, MARGIN_BOTTOM } from '../common/styles/constant'
import empty from '../common/empty'

export class ListItem extends PureComponent {
  render() {
    const { style = empty, bottomMargin } = this.props
    const itemStyles = [bottomMargin ? styles.bottomMargin : null, ...style]

    return (
      <Container secondary pad row {...this.props} style={itemStyles}>
        {this.props.children}
      </Container>
    )
  }
}

export class ListItemData extends PureComponent {
  render() {
    return (
      <Container row {...this.props}>
        {this.props.children}
      </Container>
    )
  }
}

export default class InfoSectionList extends PureComponent {
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
