import React, { PureComponent } from 'react'
import { View, Animated, Text } from 'react-native'
import Divider from '../divider'
import { ItemDividerLabel } from '../../styled-components/common-styled'
import {
  addButtonText,
  SeeAllButton,
  rightActionButtons,
  UserInfoSectionList,
} from './user-info-common-components'

const phoneDividerLeft = <ItemDividerLabel>PHONE NUMBERS</ItemDividerLabel>

const swipeableProps = {
  leftButtonWidth: 140,
  leftActionReleaseAnimationFn: Animated.spring,
  leftButtons: [<SeeAllButton text={'SEE ALL CONNECTIONS'} />],
  rightButtons: rightActionButtons,
}

export default class UserInfoPhoneSection extends PureComponent {
  render() {
    return (
      <View>
        <Divider left={phoneDividerLeft} right={addButtonText} />
        <UserInfoSectionList
          infoList={this.props.phones}
          isSwipeable
          swipeableProps={swipeableProps}
          onSwipeStart={this.props.onSwipeStart}
          onSwipeRelease={this.props.onSwipeRelease}
        />
      </View>
    )
  }
}
