import React, { PureComponent } from 'react'
import { Image, TouchableWithoutFeedback } from 'react-native'
import { CustomView } from '../layout'
import avatarStyle from './avatar-style'
import empty from '../../common/empty'

import debounce from 'lodash.debounce'

export default class Avatar extends PureComponent {
  constructor(props) {
    super(props)
    this.onPressDebounce = debounce(
      event => {
        this.props.onPress(event)
      },
      300,
      { leading: true, trailing: false }
    )
  }
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
      square ? null : avatarStyle[`${size}Round`],
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
        : radius ? { borderRadius: radius } : avatarStyle[`${size}Round`],
      ...imageStyle,
    ]

    return (
      <CustomView
        imageShadow={imageShadow}
        style={elementStyle}
        testID={testID}
      >
        <TouchableWithoutFeedback onPress={this.onPressDebounce}>
          <Image
            source={src}
            style={elementContentStyle}
            testID={`${testID}-image`}
            onLoad={onLoad}
            onError={onError}
          />
        </TouchableWithoutFeedback>
        {extraNode && extraNode}
      </CustomView>
    )
  }
}
