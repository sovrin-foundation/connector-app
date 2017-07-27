import React from 'react'
import { StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { RoundedImage } from '../styled-components/common-styled'
import { Container } from '../components'
import { ForwardArrow } from '../styled-components/invitation-styled'
import { Avatar } from '../components/avatar'

export default () => (
  <Container
    row
    style={[styles.avatars]}
    testID={'invitation-text-avatars-container'}
  >
    <Avatar
      medium
      src={require('./images/invitee.png')}
      testID={'invitation-text-avatars-invitee'}
    />
    <ForwardArrow source={require('../images/iconRArrow.png')} />
    <Avatar
      medium
      src={require('./images/inviter.jpeg')}
      testID={'invitation-text-avatars-invitee'}
    />
  </Container>
)

const styles = StyleSheet.create({
  avatars: {
    justifyContent: 'space-around',
    marginTop: 63,
  },
})
