import React from 'react'
import { StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { RoundedImage } from '../styled-components/common-styled'
import { Container } from '../components'
import { ForwardArrow } from '../styled-components/invitation-styled'

export default ({ tapAvatar }) => (
  <Container row style={[styles.avatars]}>
    {/*TODO:PS: Replace TouchableWithoutFeedback with RoundedImage component with Avatar component*/}
    <TouchableWithoutFeedback onPress={tapAvatar}>
      <RoundedImage size={'medium'} source={require('./images/invitee.png')} />
    </TouchableWithoutFeedback>
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
