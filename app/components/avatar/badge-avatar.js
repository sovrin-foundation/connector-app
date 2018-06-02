// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Avatar } from './avatar'
import Badge from '../badge'
import type { BadgeAvatarProps } from './type-avatar'

export class BadgeAvatar extends PureComponent<BadgeAvatarProps, void> {
  render() {
    const { count, onPress } = this.props

    return (
      <Avatar
        {...this.props}
        extraNode={
          <Badge
            count={count}
            secondary
            shadow
            badgeStyle={style.topLeft}
            onPress={onPress}
          />
        }
      />
    )
  }
}

const style = StyleSheet.create({
  topLeft: {
    top: 0,
    left: 0,
    position: 'absolute',
  },
})
