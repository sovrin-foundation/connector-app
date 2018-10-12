// @flow
import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Container, CustomView, CustomText } from '../components'
import { OFFSET_3X, OFFSET_4X } from '../common/styles'

export default class WaitForInvitation extends PureComponent<void, void> {
  render() {
    return (
      <Container primary style={[styles.expiredTokenContainer]}>
        <CustomView vCenter style={[styles.textContainer]}>
          <CustomText h1 style={[styles.sorryText]}>
            One sec... Waking up the hamsters...
          </CustomText>
        </CustomView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  expiredTokenContainer: {
    paddingTop: OFFSET_3X,
  },
  textContainer: {
    paddingTop: OFFSET_3X,
  },
  sorryText: {
    paddingVertical: OFFSET_4X,
  },
})
