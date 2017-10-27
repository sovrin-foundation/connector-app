import React, { PureComponent } from 'react'
import { Image, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { Avatar, CustomView } from '../components'
import { color, OFFSET_1X, OFFSET_2X } from '../common/styles'

export default class AvatarsPair extends PureComponent {
  render() {
    const {
      avatarLeft,
      middleImage,
      middleImageStyle,
      avatarRight,
      testID,
    } = this.props
    return (
      <CustomView
        row
        vCenter
        style={[styles.avatarsContainer]}
        testID={`${testID}-text-avatars-container`}
      >
        {avatarLeft && (
          <Avatar
            medium
            shadow
            src={avatarLeft}
            testID={`${testID}-text-avatars-invitee`}
          />
        )}
        {middleImage && (
          <Image
            style={[styles.checkMark, middleImageStyle && middleImageStyle]}
            source={middleImage}
            testID={`${testID}-check-mark`}
          />
        )}
        {avatarRight && (
          <Avatar
            medium
            shadow
            src={avatarRight}
            testID={`${testID}-text-avatars-inviter`}
          />
        )}
      </CustomView>
    )
  }
}
const styles = StyleSheet.create({
  avatarsContainer: {
    marginVertical: OFFSET_1X,
  },
  checkMark: {
    width: 30,
    height: 22,
  },
})
