// @flow
import React, { PureComponent } from 'react'
import { Image, TouchableWithoutFeedback, View } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker'
import RNFetchBlob from 'react-native-fetch-blob'

import { Icon } from '../index'

import { saveUserSelectedAvatar } from '../../store/user/user-store'
import { getUserAvatarSource } from '../../store/store-selector'

import type { UserAvatarProps } from './type-user-avatar'
import type { Store } from '../../store/type-store'

const defaultAvatar = require('../../images/UserAvatar.png')

export class UserAvatar extends PureComponent<UserAvatarProps, void> {
  changeAvatar = async () => {
    if (!this.props.userCanChange) {
      return
    }

    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
      })
      this.props.saveUserSelectedAvatar(image.path)
    } catch (e) {
      // TODO:KS Don't know what to do if image is not picked
      // or we get some error, there is no UI to communicate these errors
      // so, for now, just log these things
      console.log(e)
    }
  }

  render() {
    let avatarSource = this.props.avatarName || defaultAvatar

    if (this.props.children) {
      // if we are using children as render prop
      // then we want user of the component to specify what to render
      return (
        <TouchableWithoutFeedback onPress={this.changeAvatar}>
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
  bindActionCreators({ saveUserSelectedAvatar }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserAvatar)
