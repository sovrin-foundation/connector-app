import React from 'react'
import { StyleSheet, View } from 'react-native'
import { RoundedImage } from '../styled-components/common-styled'
import { Container, CustomView } from '../components'
import { ForwardArrow } from '../styled-components/invitation-styled'

export default ({ inviter, invitee }) => (
  <Container row style={[styles.avatars]}>
    <RoundedImage size={'medium'} source={require('./images/invitee.png')} />
    <ForwardArrow source={require('./images/arrow-forward.png')} />
    <RoundedImage size={'medium'} source={require('./images/inviter.jpeg')} />
  </Container>
)

const styles = StyleSheet.create({
  avatars: {
    justifyContent: 'space-around',
    marginTop: 63,
  },
})
