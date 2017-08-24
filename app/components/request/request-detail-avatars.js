// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'
import { Container, Avatar } from '../../components'
import { getConnectionLogo } from '../../store'
import type { RequestDetailAvatarProps } from './type-request'

export default class RequestDetailAvatars
  extends PureComponent<void, RequestDetailAvatarProps, void> {
  render() {
    const senderAvatar = getConnectionLogo(this.props.senderLogoUrl)

    return (
      <AnimatedView
        animation="bounceInUp"
        delay={300}
        duration={1500}
        testID={'invitation-text-container-avatars-animation'}
      >
        <Container
          row
          style={[styles.avatars]}
          testID={'invitation-text-avatars-container'}
        >
          <Avatar
            medium
            src={senderAvatar}
            testID={'invitation-text-avatars-inviter'}
          />
          <Image
            style={styles.forwardArrow}
            source={require('../../images/iconRArrow.png')}
          />
          <Avatar
            medium
            src={require('../../images/invitee.jpeg')}
            testID={'invitation-text-avatars-invitee'}
          />
        </Container>
      </AnimatedView>
    )
  }
}

const styles = StyleSheet.create({
  avatars: {
    justifyContent: 'space-around',
    marginTop: 63,
  },
  forwardArrow: {
    marginTop: 30,
  },
})
