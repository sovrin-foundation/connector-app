// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'
import { Container, CustomView, Avatar } from '../../components'
import { getConnectionLogo } from '../../store'
import type { RequestDetailAvatarProps } from './type-request'
import { OFFSET_4X, OFFSET_1X } from '../../common/styles'

export default class RequestDetailAvatars extends PureComponent<
  RequestDetailAvatarProps,
  void
> {
  render() {
    const senderAvatar = getConnectionLogo(this.props.senderLogoUrl)

    return (
      <AnimatedView
        animation="bounceInUp"
        delay={300}
        duration={1500}
        testID={'invitation-text-container-avatars-animation'}
      >
        <CustomView center spaceBetween>
          <CustomView
            row
            vCenter
            spaceBetween
            style={[styles.avatarsContainer]}
            testID={'invitation-text-avatars-container'}
          >
            <Avatar
              medium
              shadow
              src={require('../../images/UserAvatar.png')}
              testID={'invitation-text-avatars-invitee'}
            />
            <Image
              style={styles.forwardArrow}
              source={require('../../images/connectDots.png')}
            />
            <Avatar
              medium
              shadow
              src={senderAvatar}
              testID={'invitation-text-avatars-inviter'}
            />
          </CustomView>
        </CustomView>
      </AnimatedView>
    )
  }
}

const styles = StyleSheet.create({
  avatarsContainer: {
    marginVertical: OFFSET_4X,
  },
  forwardArrow: {
    width: 60,
    height: 8,
    marginHorizontal: OFFSET_1X / 2,
  },
})
