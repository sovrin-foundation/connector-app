// @flow
import React, { PureComponent } from 'react'
import { Image, TouchableWithoutFeedback, View, StyleSheet } from 'react-native'
import debounce from 'lodash.debounce'
import { CustomView } from '../layout/custom-view'
import avatarStyle from './avatar-style'
import type { AvatarProps } from './type-avatar'

const empty = []

export class Avatar extends PureComponent<AvatarProps, void> {
  onPressDebounce = debounce(
    event => {
      if (this.props.onPress) {
        this.props.onPress(event)
      }
    },
    300,
    { leading: true, trailing: false }
  )

  render() {
    const {
      small,
      medium,
      large,
      square,
      shadow,
      style = empty,
      imageStyle = empty,
      src,
      extraNode,
      onPress,
      onLongPress,
      testID,
      onLoad,
      onError,
      clearBg,
      radius,
    } = this.props
    const size = small ? 'small' : medium ? 'medium' : 'large'
    const imageShadow = shadow ? 'imageShadow' : null
    const elementStyle = [
      ...style,
      square
        ? null
        : // $FlowFixMe flow does not support dynamic property lookup
          avatarStyle[`${size}Round`],
      clearBg ? avatarStyle['clearBg'] : null,
    ]
    const elementContentStyle = [
      radius ? { width: radius * 2, height: radius * 2 } : avatarStyle[size],
      // avatar style contains round styles on the basis of size of Image
      // if we passed size as small, then corresponding style for round image
      // will be `smallRound`, that's why we are concatenating
      // value of `size` with "Round"
      // for example: if this component is used like <Avatar small round />
      // then we will get size="small" and we get round as true,
      // then style that we get from avatarStyle will be `smallRound`
      square
        ? null
        : radius
          ? { borderRadius: radius }
          : // $FlowFixMe flow does not support dynamic property lookup
            avatarStyle[`${size}Round`],
      ...imageStyle,
    ]

    return (
      <CustomView
        imageShadow={imageShadow}
        style={elementStyle}
        testID={testID}
      >
        <TouchableWithoutFeedback
          onPress={this.onPressDebounce}
          onLongPress={onLongPress}
        >
          <Image
            source={src}
            style={elementContentStyle}
            testID={`${testID}-image`}
            accessible={true}
            accessibilityLabel={`${testID}-image`}
            onLoad={onLoad}
            onError={onError}
          />
        </TouchableWithoutFeedback>
        {extraNode && extraNode}
      </CustomView>
    )
  }
}
