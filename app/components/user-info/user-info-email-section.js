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

const emailDividerLeft = <ItemDividerLabel>EMAIL ADDRESSES</ItemDividerLabel>

const swipeableProps = {
  leftButtonWidth: 140,
  leftActionReleaseAnimationFn: Animated.spring,
  leftButtons: [<SeeAllButton text={'SEE ALL CONNECTIONS'} />],
  rightButtons: rightActionButtons,
}

export default class UserInfoEmailSection extends PureComponent {
  render() {
    return (
      <View>
        <Divider left={emailDividerLeft} right={addButtonText} />
        <UserInfoSectionList
          infoList={this.props.emails}
          isSwipeable
          swipeableProps={swipeableProps}
          onSwipeStart={this.props.onSwipeStart}
          onSwipeRelease={this.props.onSwipeRelease}
        />
      </View>
    )
  }
}
