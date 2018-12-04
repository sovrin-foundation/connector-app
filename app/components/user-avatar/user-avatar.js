// @flow
import React, { PureComponent } from 'react'
import { Image, TouchableWithoutFeedback, View, Platform } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RNFetchBlob from 'react-native-fetch-blob'

import { Icon } from '../index'

import { selectUserAvatar } from '../../store/user/user-store'
import { getUserAvatarSource } from '../../store/store-selector'

import type { UserAvatarProps } from './type-user-avatar'
import type { Store } from '../../store/type-store'

const defaultAvatar = require('../../images/UserAvatar.png')

export class UserAvatar extends PureComponent<UserAvatarProps, void> {
  changeAvatar = () => {
    if (!this.props.userCanChange) {
      return
    }

    this.props.selectUserAvatar()
  }

  render() {
    let avatarSource = this.props.avatarName || defaultAvatar

    if (this.props.children) {
      // if we are using children as render prop
      // then we want user of the component to specify what to render
      return (
        <TouchableWithoutFeedback
          testID={this.props.testID}
          accessible={true}
          accessibilityLabel={this.props.testID}
          onPress={this.changeAvatar}
        >
          <View pointerEvents="box-only">
            {this.props.children(avatarSource)}
          </View>
        </TouchableWithoutFeedback>
      )
    }

    return (
      <Icon
        src={avatarSource}
        onPress={this.changeAvatar}
        extraLarge
        round
        resizeMode="cover"
        testID="user-avatar"
      />
    )
  }
}

const mapStateToProps = (state: Store) => ({
  avatarName: getUserAvatarSource(state.user.avatarName),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ selectUserAvatar }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatar)
