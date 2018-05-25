// @flow
import React, { PureComponent } from 'react'
import { Image, StyleSheet, Platform } from 'react-native'
import Modal from 'react-native-modal'
import { Avatar, CustomView, UserAvatar } from '../components'
import { color, OFFSET_1X, OFFSET_2X, isiPhone5 } from '../common/styles'
import avatarStyle from '../components/avatar/avatar-style'
import type { ImageSource } from '../common/type-common'

// TODO:KS Add types and tests for this component
// change the name of the file to match our convention of snake-case
// move this component to it's own folder, add type, tests, etc.
export default class AvatarsPair extends PureComponent<*, void> {
  renderAvatarWithSource = (avatarSource: ImageSource | number) => (
    <Avatar
      medium
      shadow
      src={avatarSource}
      testID={`avatars-pair-avatars-invitee`}
    />
  )

  render() {
    const { middleImage, middleImageStyle, avatarRight, testID } = this.props
    return (
      <CustomView
        row
        vCenter
        spaceBetween
        style={[styles.avatarsContainer]}
        testID={`${testID}-text-avatars-container`}
      >
        <UserAvatar>{this.renderAvatarWithSource}</UserAvatar>
        {middleImage && (
          <Image
            style={[styles.checkMark, middleImageStyle && middleImageStyle]}
            source={middleImage}
            testID={`${testID}-check-mark`}
            accessible={true}
            accessibilityLabel={`${testID}-check-mark`}
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
    marginHorizontal: isiPhone5 ? OFFSET_1X : OFFSET_2X,
    ...Platform.select({
      android: {
        paddingVertical: OFFSET_1X / 2,
      },
    }),
  },
  checkMark: {
    width: 30,
    height: 22,
  },
})
